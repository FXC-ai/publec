

# Part 1: **K3s et Vagrant**

L'objectif de cette partie est d'utiliser **Vagrant pour automatiser la création de deux VMs** : un serveur k3s et un agent k3s.

![Schéma issu de la documentation k3s](/projets/InceptionOfThings/tutoriel/assets/how-it-works-k3s.svg)

Schéma issu de la documentation k3s

Cette figure montre les différents composants obtenus lors de l’installation de `k3s serveur` et de `k3s Agent`. Chaque installation sera effectuée dans une VM différente.

🐳 **Docker vs Vagrant**

- **Docker** crée et lance des *containers* à partir d'images disponibles sur Docker Hub, décrites dans un `Dockerfile`
- **Vagrant** crée et configure des *machines virtuelles* à partir de boxes disponibles sur Vagrant Cloud, décrites dans un `Vagrantfile`

Les boxes Vagrant sont l'équivalent des images Docker — mais pour des VMs complètes.

## Initialisation et vérification de l’état de la VM

Avant de configurer le projet complet, vous pouvez vérifier que la box fonctionne correctement avec ces 3 commandes :

```bash
# Initialisation de la box privée
vagrant init IOTTitans/alpine-3.23.2 --box-version 1.0.0

# Lancement et téléchargement
vagrant up

# Vérification du système invité
vagrant ssh -c "cat /etc/os-release"
```

Comme vu précédemment nous avons créé et utilisé notre propre box pour ce projet.

## Connexion à Vagrant Cloud et récupération de la box privée

La box `IOTTitans/alpine-3.23.2` est privée. Pour la télécharger, vous devez vous authentifier.

> 💡 **Alternative sans authentification** : vous pouvez télécharger la box directement depuis [GitHub](https://github.com/phlearning/alpine-linux-vagrant-box-builder/releases/tag/v1.0.0) sans avoir besoin de compte.
> 

### **A. Méthode recommandée : Service Principal (Automation)**

Cette méthode est à privilégier car elle permet de s'authentifier sans interaction manuelle et d'utiliser des identifiants dédiés au projet plutôt que des comptes personnels.

1. **Génération des clés** : Il faut créer un Service Principal dans le projet HCP et récupérer le **Client ID** et **Client Secret**. (Dans notre cas c’est le service principal nommé [**Viewer](https://portal.cloud.hashicorp.com/access/role-assignments/Viewer-234089@6e56fbb9-1b0b-40ea-98aa-56af651eb5c3?org_id=720d27d0-9228-4194-a015-aa39f3d395c7&project_id=6e56fbb9-1b0b-40ea-98aa-56af651eb5c3))**

2. **Configuration** : Exporter ces identifiants dans l’environnement de travail. Vagrant les détectera automatiquement pour s'authentifier lors du `vagrant up`.

```bash
# Configuration des accès via Service Principal
export HCP_CLIENT_ID=f2a1ac1961dc3c743d01b83e634e1c5f
export HCP_CLIENT_SECRET=114bda22fce128df4195a6425d38e873f27acff8c60fff74db45c797a1bb36b7
```

2. Un prompt apparaîtra pour saisir le **nom d'utilisateur** et le **mot de passe**.

3. Une fois connecté, un token local sera stocké sur la machine (généralement dans `~/.vagrant.d/data/vagrant_login_token`).

### **B. Méthode alternative : Authentification interactive**

Utile pour un accès rapide et ponctuel avec un compte utilisateur Hashicorp standard. Tapez la commande suivante dans votre terminal :

```bash
vagrant cloud auth login
```

## Le fichier .env

Toutes les variables de configuration du projet sont centralisées dans un fichier `.env` :

```bash
SERVER_IP=192.168.56.110
WORKER_IP=192.168.56.111
SERVER_VM_NAME=wilS
WORKER_VM_NAME=wilSW
HCP_CLIENT_ID=f2a1ac1961dc3c743d01b83e634e1c5f
HCP_CLIENT_SECRET=114bda22fce128df4195a6425d38e873f27acff8c60fff74db45c797a1bb36b7
BOX=IOTTitans/alpine-3.23.2
BOX_VERSION=1.0.0
```

Pour charger ce fichier dans le `Vagrantfile`, deux options s'offrent à vous.

### Option 1 — Plugin `vagrant-env`

Il existe un plugin officiel (installé si on `vagrant plugin install vagrant-env`) mais il n’est plus compatible avec les versions de Ruby récentes ⇒ [https://github.com/gosuri/vagrant-env/issues/16](https://github.com/gosuri/vagrant-env/issues/16)

Un fork plus récent qui supporte ces versions de Ruby fonctionne ⇒ [https://github.com/Meantub/vagrant-env](https://github.com/Meantub/vagrant-env)

```bash
git clone https://github.com/Meantub/vagrant-env.git
cd ./vagrant-env
gem build vagrant-env.gemspec
vagrant plugin install ./vagrant-env-{VERSION}.gem
```

> Sources
https://www.ryanchapin.com/using-environment-variables-in-a-vagrant-file/
> 
> 
> https://www.fromthekeyboard.com/configuring-vagrant-virtual-machines-with-env/
> 
> https://developer.hashicorp.com/vagrant/docs/provisioning/shell#env
> 
> https://stackoverflow.com/questions/19648088/pass-environment-variables-to-vagrant-shell-provisioner
> 

### Option 2 — Script Ruby `load_env.rb` (recommandée)

Un script Ruby minimaliste qui parse le `.env` et injecte les variables dans l'environnement. Il vérifie aussi que les variables obligatoires sont bien définies et affiche un message d'erreur clair si ce n'est pas le cas :

```ruby
# Vérifie si le fichier de configuration ".env" existe dans le répertoire courant
if File.exist?(".env")
    # Parcourt le fichier ligne par ligne
    File.foreach(".env") do |line|
        # Saute la ligne si elle est vide (après suppression des espaces) ou si c'est un commentaire (#)
        next if line.chomp.empty? || line.start_with?("#")
        
        # Sépare la ligne en deux parties au premier signe "=" (clé et valeur)
        key, value = line.split('=', 2)
        
        # Si une clé et une valeur existent, on les traite
        if key && value
            # 1. key.strip : retire les espaces autour du nom de la variable
            # 2. value.strip : retire les espaces autour de la valeur
            # 3. .gsub(...) : retire les guillemets simples ou doubles entourant la valeur
            # 4. ENV[...] : injecte le résultat dans les variables d'environnement du système
            ENV[key.strip] = value.strip.gsub(/^"|"$|^'|'$/, '')
        end
    end

    # Liste des variables indispensables au bon fonctionnement de Vagrant
    required_vars = %w[SERVER_VM_NAME WORKER_VM_NAME BOX BOX_VERSION]
    
    # Identifie les variables manquantes ou définies avec une valeur vide
    missing = required_vars.select { |var| ENV[var].nil? || ENV[var].strip.empty? }

    # Si la liste des variables manquantes n'est pas vide
    unless missing.empty?
        # Arrête immédiatement l'exécution (Vagrant s'arrête) et affiche un message d'erreur clair
        abort <<~MSG
            Les variables d'environnement suivantes sont manquantes ou vides dans le fichier .env :
              #{missing.join(', ')}

            Veuillez les définir dans le fichier .env avant de lancer Vagrant.
        MSG
    end
end
```

## Le Vagrantfile

Vagrant se charge de créer les deux VM grâce à un Vagrantfile :

```ruby
# Charge toutes les variables d'environnement
load File.join(__dir__, "load_env.rb") 

Vagrant.configure("2") do |config|
        # Définit le dossier partagé entre l'hôte et la VM
    synced_folder_host = File.join(__dir__, "shared")    
    
    
    FileUtils.mkdir_p(synced_folder_host) unless File.directory?(synced_folder_host)    
    
    # Définit les variables ServerName et workerName qui permettront de nommer les VM
    serverName = ENV['SERVER_VM_NAME']    
    workerName = ENV['WORKER_VM_NAME']    
    
    # Définit les variables de la box utilisée pour les VM
    box = ENV['BOX']
    box_version = ENV['BOX_VERSION']
    
    # Configure la box qui sera utilisée pour les deux VM
    config.vm.box = box    
    config.vm.box_version = box_version    
    config.vm.synced_folder synced_folder_host, "/shared"
    
    # Configuration de la VM serveur 
    config.vm.define serverName do |vmServer|
        vmServer.vm.hostname = serverName        
        vmServer.vm.network "private_network", ip: ENV['SERVER_IP']
        
        vmServer.vm.provider "virtualbox" do |v|            
            v.name = serverName            
            v.memory = 1024            
            v.cpus = 1        
          end
          
          # Provisionnement de la VM
        vmServer.vm.provision "shell", path: "./scripts/server.sh", env: {"SERVER_IP" => ENV['SERVER_IP']}
    end
      
      # Configuration de la VM client 
    config.vm.define workerName do |vmWorker|
        vmWorker.vm.hostname = workerName        
        vmWorker.vm.network "private_network", ip: ENV['WORKER_IP']
        
        vmWorker.vm.provider "virtualbox" do |v|            
            v.name = workerName            
            v.memory = 1024            
            v.cpus = 1
        end
        
        vmWorker.vm.provision "shell", path: "./scripts/worker.sh", env: {"SERVER_IP" => ENV['SERVER_IP'], "WORKER_IP" => ENV['WORKER_IP']}
    end
    
end
```

## Les scripts d’installation…

### … du serveur

```bash
# !/bin/bash

echo "Installation de k3s sur le serveur."

# Install K3s on the master node
curl -sfL https://get.k3s.io | sh -s - server --node-ip $SERVER_IP

# Make sure kubectl is set up for the vagrant user

echo "En attente du fichier k3s.yaml"

while [ ! -f /etc/rancher/k3s/k3s.yaml ]; do
    echo "..."
    sleep 1
done

sudo mkdir -p /home/vagrant/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/vagrant/.kube/config
sudo chown -R vagrant:vagrant /home/vagrant/.kube/config
echo 'export KUBECONFIG=$HOME/.kube/config' >> /home/vagrant/.profile
chown vagrant:vagrant /home/vagrant/.profile

# Get the token for the worker nodes
echo "En attente du token"

while [ ! -f /var/lib/rancher/k3s/server/node-token ]; do
    echo "..."
    sleep 1
done

TOKEN=$(sudo cat /var/lib/rancher/k3s/server/node-token)

# Store the token for the workers to use
echo $TOKEN > /shared/token
```

> 🔐 **Pourquoi copier le kubeconfig dans `~/.kube/config` ?**
Une approche plus simple consiste à lancer k3s avec `--write-kubeconfig-mode=644`, ce qui rend le fichier lisible par tous les utilisateurs. Mais c'est une **mauvaise pratique de sécurité** : n'importe quel utilisateur de la VM aurait alors accès aux certificats et tokens admin. En copiant le fichier dans le home de `vagrant`, seul cet utilisateur (et `root`) peut exécuter des commandes `kubectl`.
> 
> 
> La variable `KUBECONFIG` est ajoutée dans `.profile` (et non `.bashrc`) car Alpine utilise `ash` par défaut, et `vagrant ssh` ouvre un *login shell* — c'est `.profile` qui est exécuté dans ce cas.
> 

> 📚 Sources : [docs.k3s.io](https://docs.k3s.io/installation/configuration) — [blog.stephane-robert.info](https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/k3s/#installation-mono-serveur)
> 

### … du worker

```ruby
#!/bin/bash
echo "Installation de k3s sur le worker."

# Récupération du token via le dossier partagé. Le token a été copié dans ce dossier par le serveur
TOKEN=$(cat /shared/token)

# Installation de k3s puis lancement en mode agent
# 6443 est le port par défaut
curl -sfL https://get.k3s.io | K3S_URL=https://$SERVER_IP:6443 K3S_TOKEN=$TOKEN sh -s - agent --node-ip $WORKER_IP
```