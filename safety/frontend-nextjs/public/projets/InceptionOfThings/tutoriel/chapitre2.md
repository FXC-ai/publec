

# Prérequis pour Inception Of Things

> ⚠️ **Conseil important avant de commencer**
Nous vous recommandons **fortement** de faire ce projet sur votre **ordinateur personnel**, avec Ubuntu installé directement dessus (pas dans une VM).
> 
> 
> Sur les machines de l'école, il faudrait faire tourner des VMs dans une VM — ce qu'on appelle de la **nested virtualization**. Après de nombreuses tentatives, nous avons abandonné cette piste : c'est trop instable et trop complexe pour ce projet.
> 

**Configuration minimale recommandée :**

| Ressource | Minimum | Recommandé |
| --- | --- | --- |
| RAM | 8 Go *(lent et instable)* | **16 Go** |
| Disque | 50 Go | **100 Go** |
| OS | Abandonné sur Windows / iOS ou autre | **Ubuntu (bare metal)** |

## Aide mémoire concernant Docker

La partie 3 du projet utilise Docker intensivement. Entre les tests et les allers-retours, les images et containers inutilisés s'accumulent vite et **mangent de l'espace disque**. Voici les commandes pour garder votre système propre.

| Commande | Ce que ça supprime |
| --- | --- |
| `docker container prune` | Tous les containers **arrêtés** |
| `docker image prune -a` | Toutes les images **inutilisées** |
| `docker builder prune -a` | Le **cache de build** |
| `docker system prune -a` | Supprime containers arrêtés + images inutilisées + réseaux inutilisés
N'inclut PAS les volumes — ajoutez --volumes si vous en avez besoin |

> 💡 **Bonus système** : si vous manquez d'espace disque, cette commande libère les blocs inutilisés de votre système de fichiers (utile après un gros nettoyage Docker) : `sudo fstrim -av`
> 

## Installation de Vagrant sur Linux

> ⚠️ **Note pour les étudiants de 42**
Il est techniquement possible d'installer Vagrant dans une VM sur les machines de l'école, mais les ressources disponibles sont insuffisantes et les VMs imbriquées (*nested VMs*) ajoutent une couche de complexité inutile. **Nous déconseillons cette option**, même sur un ordinateur personnel.
> 

### Option A — Via les dépôts APT (recommandée)

C'est la méthode propre et officielle. Elle nécessite les droits `sudo`.

```bash
# 1. Ajouter la clé GPG officielle HashiCorp
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# 2. Ajouter le dépôt APT HashiCorp
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# 3. Mettre à jour et installer
sudo apt update && sudo apt install vagrant
```

Ce script fait trois choses : il ajoute le dépôt officiel HashiCorp, met à jour la liste des paquets, puis installe Vagrant.

### Option B — Via le binaire (dépréciée)

> ⚠️ **Limitation connue** : même en installant Vagrant sans `sudo`, vous aurez besoin des droits root pour charger le module kernel `vboxnetflt` de VirtualBox (nécessaire pour gérer les réseaux privés des VMs). Sans ça, vous obtiendrez cette erreur :
> 
> 
> `VBoxManage: error: Failed to open/create the internal network
> 'HostInterfaceNetworking-vboxnet0' (VERR_SUPDRV_COMPONENT_NOT_FOUND)`
> 
> Cette méthode reste utile pour **découvrir Vagrant** sur une machine sans droits admin, mais elle sera bloquante dès que vous aurez besoin du réseau privé.
> 

Si vous souhaitez quand même l'essayer :

1. Téléchargez l'archive sur [developer.hashicorp.com/vagrant](https://developer.hashicorp.com/vagrant/tutorials/get-started/install)
2. Extrayez le zip et déplacez le binaire `vagrant` dans `~/bin/`
3. Ajoutez-le au `$PATH` si nécessaire :

```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Vérification de l’installation

```bash
vagrant --version
```

Si une version s'affiche, vous êtes prêt !

## Essayer de faire fonctionner Vagrant sur macOS arm64 (Abandonné)

> 🍎 **Cette section s'adresse aux utilisateurs Mac avec une puce Apple Silicon (M1/M2/M3).**
Si vous êtes sur Linux x86, vous pouvez passer directement à la section suivante.
> 

### Le problème de départ

VirtualBox ne supporte pas l'architecture ARM64. Les boxes Vagrant disponibles avec `provider=virtualbox` et `architecture=arm64` n'ont tout simplement pas fonctionné.

### Tentatives de résolution des problèmes

On a tenté de contourner le problème en utilisant **QEMU** comme provider à la place de VirtualBox :

```bash
# Installer QEMU
brew install qemu

# Installer le plugin Vagrant pour QEMU
vagrant plugin install vagrant-qemu

# Lancer la VM avec QEMU
vagrant up --provider qemu
```

Ça règle le problème d'incompatibilité d'architecture… mais ça en crée d'autres.

**1. Réseau** 🔴 Bloquant

warning: `The QEMU provider doesn't support any of the Vagrant high-level network configurations (config.vm.network). They will be silently ignored.` (cf. [https://github.com/ppggff/vagrant-qemu/issues/40](https://github.com/ppggff/vagrant-qemu/issues/40) et [https://github.com/ppggff/vagrant-qemu/issues/41](https://github.com/ppggff/vagrant-qemu/issues/41))

Les IP que je veux assigner aux VMs ne sont jamais prises en compte malgré différentes tentatives de résolution (réécrire la config de `/etc/network/interfaces` …)

**2. Dossiers partagés** 🟡 Résolu

erreur: `Vagrant SMB synced folders require the account password to be stored in an NT compatible format. Please update your sharing settings to enable a Windows compatible password and try again.` 

Résolu en activant les dossiers partagés dans les préférences système macOS, puis en passant au type `rsync` :

```bash
config.vm.synced_folder ".", "/vagrant", type: "rsync"
```

Sources :  https://developer.hashicorp.com/vagrant/docs/synced-folders/smb#macos-host

**3. Conflits de ports SSH** 🟡 Résolu

Erreur : The forwarded port to 50022 is already in use on the host machine.

Résolu en précisant un port SSH différent pour chaque VM dans le Vagrantfile :

```ruby
vmServer.vm.provider "qemu" do |qe|
  qe.ssh_port = "50223"
end

vmWorker.vm.provider "qemu" do |qe|
  qe.ssh_port = "50224"
end
```

### Verdict

Le problème de réseau est **insurmontable** dans le cadre des contraintes du sujet. L'assignation d'IPs fixes aux VMs est une exigence non négociable — et QEMU ne le permet pas.

> 🚫 **Conclusion : si vous êtes sur Mac Apple Silicon, faites le projet sur un Linux x86. C'est la seule option viable.**
> 

> 📚 Sources :
> 
> 
> https://joachim8675309.medium.com/vagrant-with-macbook-mx-arm64-0f590fd7e48a
> 
> https://gist.github.com/beauwilliams/69eabc42e540a309f53d55c4b8e6ffe3
> 
> https://github.com/ppggff/vagrant-qemu/pull/73
> 

## Erreurs rencontrées sous Linux

Sur une distribution nouvellement bootée, il faut installer `VirtualBox`, `git`, `vagrant` (c.f. [installation via dépots](https://www.notion.so/2e3cd684d97580a7b4cac6c53f24e8ce?pvs=21)).

### Erreur 1 : Secured Boot

**Symptôme** : la commande `VBoxManage` retourne cette erreur :

```bash
WARNING: The character device /dev/vboxdrv does not exist.
         Please install the virtualbox-dkms package and the appropriate
         headers, most likely linux-headers-generic.
         You will not be able to start VMs until this problem is fixed.
```

**Cause** : le module kernel VirtualBox n'est pas chargé, souvent parce que le **Secure Boot** est activé dans le BIOS — ce qui bloque le chargement des modules non signés.

**Résolution** :

```bash
# 1. Installer les packages nécessaires
sudo apt-get install dkms build-essential linux-headers-$(uname -r)

# 2. Vérifier l'état du Secure Boot
mokutil --sb-state
```

Si le Secure Boot est activé :

1. Rebootez votre machine
2. Entrez dans le BIOS / UEFI
3. Désactivez le **Secure Boot**
4. Sauvegardez et rebootez

```bash
# 3. Charger le module VirtualBox
sudo modprobe vboxdrv

# 4. Vérifier que tout est OK
ls -l /dev/vboxdrv  # Un fichier doit exister ici
```

### Erreur 2 : Conflit avec KVM

**Symptôme** : au premier `vagrant up`, l'erreur suivante apparaît :

```bash
VBoxManage: error: VT-x is being used by another hypervisor (VERR_VMX_IN_VMX_ROOT_MODE).
VBoxManage: error: VirtualBox can't operate in VMX root mode.
Please disable the KVM kernel extension, recompile your kernel and reboot.
```

**Cause** : **KVM** (l'hyperviseur natif Linux) est déjà en train d'utiliser les extensions de virtualisation matérielle. VirtualBox et KVM ne peuvent pas cohabiter simultanément.

**Résolution** : désactiver temporairement KVM (recommandé pour ce projet) :

```bash
# Lister les modules KVM actifs
sudo lsmod | grep kvm

# Désactiver les modules concernés
sudo modprobe -r kvm_intel  # ou kvm_amd selon votre CPU
```

> ⚠️ **Pourquoi ne pas blacklister KVM définitivement ?**
La doc Vagrant suggère d'ajouter `kvm-intel` à `/etc/modprobe.d/blacklist.conf` pour une désactivation permanente. Ce n'est pas idéal si vous utilisez KVM pour d'autres projets — préférez la désactivation temporaire ci-dessus, qui ne persiste pas au reboot.
> 

> 📚 Sources : [https://www.reddit.com/r/linux4noobs/comments/1ntbjhw/trying_to_install_virtual_box_but_getting_an_error/](https://www.reddit.com/r/linux4noobs/comments/1ntbjhw/trying_to_install_virtual_box_but_getting_an_error/)
> 