# À propos de Vagrant

**Vagrant** est un outil qui permet de **créer et configurer des machines virtuelles automatiquement**, à partir d'un simple fichier de configuration. Fini les clics dans VirtualBox — tout se fait en ligne de commande.

Il repose sur **3 piliers** :

| Pilier | Description |
| --- | --- |
| **Vagrantfile** | Le fichier de configuration de vos VMs, écrit en Ruby. Il décrit la machine à créer et les scripts à exécuter au démarrage. C'est ce fichier que vous partagez avec votre équipe. |
| **Boxes** | Des images de machines pré-configurées, téléchargeables en ligne. L'équivalent des `.iso` — mais en beaucoup plus simple à utiliser. |
| **Providers** | Vagrant ne crée pas lui-même la VM : il délègue ça à un logiciel de virtualisation comme **VirtualBox** ou VMware. |

> ⚙️ **Dans ce projet**, on utilise **VirtualBox** comme provider. Vous aurez donc besoin d'installer les deux : **VirtualBox** + **Vagrant**.
> 

Sources :

> 📚 Sources : 
https://developer.hashicorp.com/vagrant/docs
> 
> 
> https://blog.stephane-robert.info/docs/infra-as-code/provisionnement/vagrant/
> 
> https://gist.github.com/wpscholar/a49594e2e2b918f4d0c4
> 

## À propos du CLI Vagrant

Voici un schéma récapitulatif des commandes pour utiliser Vagrant en CLI :

![Schéma récapitulatif des différentes commandes](/projets/InceptionOfThings/tutoriel/assets/CLI_vagrant.png)

Schéma récapitulatif des différentes commandes

Ces 4 commandes permettent de commencer:

```bash
vagrant init   # Crée un nouveau Vagrantfile dans le dossier courant
vagrant up     # Crée et démarre la VM (la télécharge si c'est la première fois)
vagrant ssh    # Se connecte en SSH à la VM (sans config de clé, c'est magique ✨)
vagrant destroy # Supprime complètement la VM et libère l'espace disque
```

Les commandes utiles au quotidien :

```bash
vagrant halt      # Éteint la VM proprement (RAM libérée, disque conservé)
vagrant suspend   # Met la VM en veille (reprise rapide)
vagrant reload    # Redémarre la VM — à faire après une modif du Vagrantfile
vagrant provision # Rejoue uniquement les scripts de configuration (sans reboot)
vagrant status    # Affiche l'état actuel de la VM
vagrant port      # Liste les redirections de ports entre votre machine et la VM
```

Les commandes pour les snapshots :

```bash
vagrant snapshot save [nom]     # Sauvegarde l'état actuel de la VM
vagrant snapshot restore [nom]  # Revient à un état sauvegardé
vagrant snapshot list           # Liste tous les snapshots disponibles
```

<aside>
💡

**C'est quoi le provisioning ?**
Le provisioning, c'est l'automatisation de l'installation de logiciels au démarrage de la VM. Plutôt que de taper vos commandes apt install à la main à chaque vagrant up, vous les écrivez une fois dans le Vagrantfile (via un script Shell ou Ansible) — et Vagrant les exécute automatiquement.

</aside>

### **Exemple pour débuter**

Voici comment créer et démarrer votre première VM en 3 commandes :

```bash
vagrant init hashicorp/bionic64 # Initialise le projet avec une image Ubuntu standard d'hashicorp
vagrant up # Lance la machine
vagrant ssh # Se connecte dans la machine
```

> 📚 Sources : [developer.hashicorp.com/vagrant/docs](https://developer.hashicorp.com/vagrant/docs) — [blog.stephane-robert.info](https://blog.stephane-robert.info/docs/infra-as-code/provisionnement/vagrant/)
> 

## **Les Vagrant boxes**

Une **box** Vagrant, c'est une image de machine pré-configurée, prête à être utilisée. Comme une image Docker, mais pour des VMs. Vous avez deux façons d'en créer une :

### **Option 1 - À partir d’un VDI**

Si vous avez déjà une VM VirtualBox, vous pouvez la "packager" en box Vagrant avec une seule commande :

```ruby
vagrant package --base [VM Name] --output my_new_box.box
```

### Option 2 — Avec Packer (recommandé)

**Packer** est un outil HashiCorp qui automatise la création d'images disque from scratch. L'idée : vous décrivez votre machine dans un fichier de config, et Packer fait l'installation à votre place — de manière **reproductible et identique** à chaque fois.

> 💡 C'est l'approche **Infrastructure as Code** : votre image de base est versionnée et partageable, comme du code.
> 

**🛠️ Installation de Packer (Ubuntu/Debian) :**

Packer doit être installé sur votre machine hôte. Sur **Ubuntu / Debian**, utilisez les commandes suivantes :

```bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install packer
```

**📂 Structure du projet Packer :**

L'organisation des fichiers pour la création d'une "box" Alpine Linux est la suivante :

```hcl
.
├── alpine.pkr.hcl    # Configuration principale (HCL)
└── http/             # Serveur HTTP local pour l'automatisation
    └── answers       # Fichier de réponses pour l'installeur Alpine
```

Le fichier `alpine.pkr.hcl` définit tout : l'ISO source, les ressources de la VM, les étapes d'installation, et le format de sortie.

- `alpine.pkr.hcl`
    
    ```hcl
    variable "iso_url" {
      type    = string
      default = "https://dl-cdn.alpinelinux.org/alpine/v3.23/releases/x86_64/alpine-virt-3.23.2-x86_64.iso"
    }
    
    variable "iso_checksum" {
      type    = string
      default = "sha256:c328a553ba9861e4ccb3560d69e426256955fa954bc6f084772e6e6cd5b0a4d0"
    }
    
    variable "vm_name" {
      type    = string
      default = "alpine-3.23.2"
    }
    
    variable "root_password" {
      type    = string
      default = "vagrant"
    }
    
    variable "additional_packages" {
      type    = list(string)
      default = ["bash", "curl", "vim", "cgroup-tools", "iptables", "ip6tables"]
    }
    
    packer {
      required_plugins {
        virtualbox = {
          source  = "github.com/hashicorp/virtualbox"
          version = ">= 1.1.3"
        }
        vagrant = {
          version = "~> 1"
          source  = "github.com/hashicorp/vagrant"
        }
      }
    }
    
    source "virtualbox-iso" "alpine" {
      iso_url        = var.iso_url
      iso_checksum   = var.iso_checksum
      http_directory = "http"
    
      vm_name       = var.vm_name
      guest_os_type = "Linux_64"
      disk_size     = 10240 # Au moins 10 Go, si moins cela peut poser problèmes pour lancer des pods
      headless      = false # Watch the installation to ensure it syncs
    
      vboxmanage = [
        ["modifyvm", "{{ .Name }}", "--memory", "512"],
        ["modifyvm", "{{ .Name }}", "--cpus", "1"],
        ["modifyvm", "{{ .Name }}", "--graphicscontroller", "vmsvga"],
        ["modifyvm", "{{ .Name }}", "--vram", "16"]
      ]
    
      ssh_username = "root"
      ssh_password = var.root_password
      ssh_timeout  = "15m"
    
      boot_wait = "10s"
      boot_command = [
        "root<enter><wait5>",
        "ifconfig eth0 up && udhcpc -i eth0<enter><wait10>",
        "wget -O /tmp/answers http://{{ .HTTPIP }}:{{ .HTTPPort }}/answers<enter><wait5>",
        "export ERASE_DISKS=/dev/sda<enter>",
        "setup-alpine -f /tmp/answers<enter><wait15>",
        "${var.root_password}<enter><wait2>${var.root_password}<enter><wait20>",
        # Try mounting standard root (sda3 or sda2) OR LVM root (vg0-lv_root)
        "mount /dev/sda3 /mnt || mount /dev/sda2 /mnt || mount /dev/vg0/lv_root /mnt<enter><wait2>",
        "echo 'PermitRootLogin yes' >> /mnt/etc/ssh/sshd_config<enter><wait2>",
        "umount /mnt<enter><wait2>",
        "reboot<enter>"
      ]
      shutdown_command = "poweroff"
    }
    
    build {
      sources = ["source.virtualbox-iso.alpine"]
    
      provisioner "shell" {
        inline = [
          # 1. Configuration des dépôts et mise à jour
          "sed -i 's/#http/http/g' /etc/apk/repositories",
          "apk update && apk upgrade",
          "apk add virtualbox-guest-additions sudo ${join(" ", var.additional_packages)}",
          "rc-update add cgroups default",
          "rc-update add virtualbox-guest-additions default",
          "rc-update -u",
    
          "sed -i 's/default_kernel_opts=\"/default_kernel_opts=\"cgroup_enable=memory cgroup_memory=1 /' /etc/update-extlinux.conf",
          "update-extlinux",
    
          # 2. Création de l'utilisateur vagrant
          "adduser -D -s /bin/bash vagrant",
          "echo 'vagrant:vagrant' | chpasswd",
          "echo 'vagrant ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers",
    
          # 3. Configuration SSH (Récupération de la clé via curl)
          "mkdir -pm 700 /home/vagrant/.ssh",
          "curl -L https://raw.githubusercontent.com/hashicorp/vagrant/master/keys/vagrant.pub -o /home/vagrant/.ssh/authorized_keys",
          "chmod 0600 /home/vagrant/.ssh/authorized_keys",
          "chown -R vagrant:vagrant /home/vagrant/.ssh",
    
          # 4. Nettoyage
          "sed -i '/PermitRootLogin yes/d' /etc/ssh/sshd_config",
          "rm -rf /var/cache/apk/*"
        ]
      }
    
      post-processor "vagrant" {
        output = "${var.vm_name}.box"
      }
    }
    ```
    

Le fichier `answers` permet quant à lui de répondre automatiquement aux questions de l'installateur Alpine — sans intervention humaine.

- `answers`
    
    ```
    # Use US layout
    KEYMAPOPTS="us us"
    
    # Set hostname
    HOSTNAMEOPTS="-n alpine-inception"
    
    # Network config
    INTERFACESOPTS="auto lo
    iface lo inet loopback
    
    auto eth0
    iface eth0 inet dhcp"
    
    # Timezone and Proxy
    TIMEZONEOPTS="-z Europe/Zurich"
    PROXYOPTS="none"
    
    # Use the fastest mirror
    APKREPOSOPTS="-1"
    
    # IMPORTANT: Skip user creation to avoid the 'Full Name' hang you saw
    USEROPTS="none"
    
    # SSH and NTP
    SSHDOPTS="-c openssh"
    NTPOPTS="-c chrony"
    
    # Disk setup (System install on sda)
    DISKOPTS="-L -m sys /dev/sda"
    
    # Disable caching to save space
    LBUOPTS="none"
    APKCACHEOPTS="none"
    ```
    

> 📚 Sources : [developer.hashicorp.com/packer](https://developer.hashicorp.com/packer/install) — [notre box Alpine](https://github.com/phlearning/alpine-linux-vagrant-box-builder)
> 

### Le port forwarding avec Vagrant

Il faut faire 2 port forwarding :

- le premier entre la machine hôte et cluster dans le Vagrantfile : `config.vm.network "forwarded_port", guest: 8080, host: 8888`
- le second entre le cluster et la VM :  `kubectl port-forward pod/app1-598b6d7866-2cdm6 --address 0.0.0.0 8080:80`

> 📚 Sources :
https://developer.hashicorp.com/vagrant/docs/boxes
> 
> 
> https://www.youtube.com/watch?v=JkKBZU9OwjE
> https://github.com/shnorbluk/Packer-Alpine/blob/main/packer/alpine.pkr.hcl
> 