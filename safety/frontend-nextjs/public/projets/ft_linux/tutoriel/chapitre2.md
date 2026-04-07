# Préparation de l'environnement de développement

<aside>
⚠️

Attention ! Dans cette section, j'appelle **machine hôte** l'ordinateur *physique* sur lequel est installé VirtualBox. Par la suite la "machine hôte" désignera la machine virtuelle sur laquelle nous allons construire notre distribution.

</aside>

## Etape 0 : Installer Virtual Box

Sur Windows, VirtualBox peut nécessiter certains prérequis (selon la version : pilotes, packs additionnels, etc.). Pour ma part j'ai dû installer Microsoft Visual C++.

## Etape 1 : Installer une distribution Linux sur une machine virtuelle

Créez une machine virtuelle Debian. De mon côté, j'ai utilisé **Debian 13 (Trixie)** avec interface graphique, et un disque virtuel (VDI) de **50 Go**.

Côté ressources, ma VM avait **4 Go de RAM**, **4 vCPU**, et **deux disques virtuels de 50 Go** :

- **Disque 1** : pour Debian (la machine invitée "outil").
- **Disque 2** : dédié à la future installation **LFS**.

<aside>
💡

Pour trouver l'image correspondant à votre architecture sur windows, il suffit d'utiliser la commande `set` dans cmd.

</aside>

La machine virtuelle que j'ai utilisé comporte 4 Go de RAM, 4 CPU et deux disques durs de 50 Go. Le premier disque dur sera dédié à la machine virtuelle qui permettra la construction de notre Linux From Scratch. Le second disque sera utilisé pour notre LFS lui même.

## Etape 2 : Ajouter un disque dur virtuel supplémentaire à la VM

Dans VirtualBox : **Paramètres de la VM → Stockage → Ajouter un disque dur**. "add hard disk".

![ajout_disk.png](/projets/ft_linux/tutoriel/assets/ajout_disk.png)

## Etape 3 : Établir un connexion ssh entre la machine hôte et la machine virtuelle

Une connexion SSH est fortement recommandée : vous allez faire énormément de copier/coller depuis le livre LFS. Sans SSH, vous risquez de devoir retaper des centaines de commandes.

Voici les étapes à suivre pour établir une connexion ssh entre la machine et la machine virtuelle.

### 1) Dans la VM Debian (machine invitée)

Installez le serveur SSH :

- `sudo apt update`
- `sudo apt install openssh-server`

Vérifiez que le service tourne :

- `sudo systemctl status ssh`

Pare-feu (optionnel mais propre) :

- `sudo apt install ufw`
- `sudo ufw allow OpenSSH` *(ou `sudo ufw allow 22/tcp`)*
- `sudo ufw enable`
- `sudo ufw status`

### 2) Dans VirtualBox : redirection de port

Dans les réglages réseau de la VM (mode NAT), ajoutez une règle de redirection :

- **Port hôte** : `2222`
- **Port invité** : `22`
    
    ![Capture d'écran 2025-11-17 145731.png](/projets/ft_linux/tutoriel/assets/Capture_dcran_2025-11-17_145731.png)
    

### 3) Depuis la machine hôte

Vous pouvez maintenant vous connecter à la VM avec :

`ssh -p 2222 <user>@localhost`

- `<user>` = un utilisateur existant dans Debian
- `p 2222` indique le port côté machine hôte (redirigé vers le 22 de la VM)
