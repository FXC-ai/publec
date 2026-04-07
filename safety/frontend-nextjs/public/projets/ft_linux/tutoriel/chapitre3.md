# Linux From Scratch !

Bon bon bon… Debian 13 est installé dans une VM maintenant nous allons construire notre propre distribution Linux From Scratch. Je ne vais pas recopier le livre ici. Je vous invite à lire et suivre les instructions qu'il contient pas à pas. Dans cette section je vais me contenter de commenter certains passages pour apporter quelques éclaircissements.

## Création d'une nouvelle partition (Section 2.4)

Le livre indique qu'« une partition de 30 Go devrait suffire ». Pour ft_linux, je recommande plutôt un **disque virtuel de 50 Go**, plus confortable (marges de manœuvre, logs, recompilations, etc.). Voici une proposition de découpage compatible avec un démarrage **en BIOS** et une partition **/boot séparée** :

| Partition | Taille | Rôle |
| --- | --- | --- |
| `/dev/sdb1` | 1 MiB | **BIOS boot partition** (nécessaire pour GRUB en mode BIOS sur disque GPT) |
| `/dev/sdb2` | 256 MiB | **/boot** (noyau `vmlinuz`, initramfs, fichiers du bootloader) |
| `/dev/sdb3` | 45 GiB | **/** (racine : l'arborescence complète du système) |
| `/dev/sdb4` | ~4–5 GiB | **swap** (mémoire d'échange) |

Ne confondez pas la partition **BIOS boot** (1 MiB) avec la partition **/boot** :

- la **BIOS boot** ne contient **pas** de système de fichiers et sert à GRUB quand on démarre en **BIOS** sur un disque **GPT** ;
- la partition **/boot**, elle, contient les fichiers nécessaires au démarrage (noyau, initramfs, etc.).

Le nom du disque à partitionner dépend de votre VM (souvent `sdb`, mais pas toujours). Pour vérifier :`lsblk` ou `sudo fdisk -l` . Ensuite j'ai utilisé fdisk pour partitionner le disque.

### Tutoriel fdisk

Tout d'abord démarez fdisk :

```bash
sudo fdisk /dev/sdX
```

Remplacez `sdX` par le bon disque (ex. `/dev/sdb`).

Pour le partitionnement sur fdisk, il faudra ensuite effectuer la suite de commande suivante :

Tout d'abord `g` permet de choisir le type de disque dur (g pour GPT). La notion GPT VS MBR est abordée plus haut.

```bash
Welcome to fdisk (util-linux 2.41).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help): g
Created a new GPT disklabel (GUID: EACB74D2-7A4A-44C9-8655-BD190BC7E51E).
```

- Partition d'amorçage

`n` pour "new" demande à fdisk la création d'une nouvelle partition. Ici on choisit la partition no 1 qui est destiné au secteur d'amorçage. Pour choisir le type, il faut taper `t` et choisir le type avec l'indice 4 qui correspond au bios boot. `L` permet de voit la liste des différents types de partition disponibles. Notre LFS démarrera en BIOS et non pas en UEFI (cf section plus haut pour comprendre la différence).

```bash
Command (m for help): n
Partition number (1-128, default 1): 1
First sector (2048-62914526, default 2048):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-62914526, default 62912511): +1M

Created a new partition 1 of type 'Linux filesystem' and of size 1 MiB.

Command (m for help): t
Selected partition 1
Partition type or alias (type L to list all): L
  1 EFI System                     C12A7328-F81F-11D2-BA4B-00A0C93EC93B
  2 MBR partition scheme           024DEE41-33E7-11D3-9D69-0008C781F39F
  3 Intel Fast Flash               D3BFE2DE-3DAF-11DF-BA40-E3A556D89593
  4 BIOS boot                      21686148-6449-6E6F-744E-656564454649
  5 Sony boot partition            F4019732-066E-4E12-8273-346C5641494F
	[..]
Partition type or alias (type L to list all): 4
Changed type of partition 'Linux filesystem' to 'BIOS boot'.
```

<aside>
📖

Cette partition n a aucun systeme de fichier. Elle conteint core.img qui est lu par le BIOS pour demarer la machine… Elle est necessaire car le disque est en GPT.

</aside>

- Partition boot

Pour cette seconde partition nous laisserons le type par défaut : 'Linux filesystem'

```bash
Command (m for help): n
Partition number (2-128, default 2): 2
First sector (4096-62914526, default 4096):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (4096-62914526, default 62912511): +256M

Created a new partition 2 of type 'Linux filesystem' and of size 256 MiB.
```

- Partition root

Même chose que pour la précédente mais cette fois ci nous allons choisir une taille beaucoup plus grande : 47,7 G.

```bash
Command (m for help): n
Partition number (3-128, default 3): 3
First sector (528384-62914526, default 528384):

Last sector, +/-sectors or +/-size{K,M,G,T,P} (528384-62914526, default 62912511): +45G

Created a new partition 3 of type 'Linux filesystem' and of size 45 GiB.
```

- Partition swap

Pour cette dernière partition, il n'est pas nécessaire de remplir la taille car c'est la dernière et nous lui laissons tout l'espace disque restant. L'indice du type pour une partition swap est 19 dans mon cas.

```bash
Command (m for help): n
Partition number (4-128, default 4): 4
First sector (55054336-62914526, default 55054336):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (55054336-62914526, default 62912511):

Created a new partition 4 of type 'Linux filesystem' and of size 4.7 GiB.

Command (m for help): t
Partition number (1-4, default 4): 4
Partition type or alias (type L to list all): L
[..]
 17 HP-UX data                     75894C1E-3AEB-11D3-B7C1-7B03A0000000
 18 HP-UX service                  E2A1E728-32E3-11D6-A682-7B03A0000000
 19 Linux swap                     0657FD6D-A4AB-43C4-84E5-0933C84B4F4F
[..]
Partition type or alias (type L to list all): 19

Changed type of partition 'Linux filesystem' to 'Linux swap'.
```

Enfin la dernière étape consiste à écrire sur le disque toutes les partitions que nous venon de créer à l'aide de la commande `w` de fdisk :

```bash
Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

Ensuite il faudra ajouter un système de fichier aux partitions avec les commandes `mkfs -v -t ext4 /dev/*<xxx*` et swap : `mkswap /dev/*<yyy>`.* Mais le livre LFS est parfaitement clair à ce sujet. Je ne reviens donc pas sur ce point. Pour observer les filesystems : `findmnt <chemin_vers_le_dossier>`

## **Montage de la nouvelle partition (Section 2.7)**

### Partition root

Il faut garder en tête que le montage d'une partition n'est **pas permanent** : après chaque arrêt/redémarrage de la VM, la partition n'est plus montée, et son contenu n'est donc plus visible tant que vous ne la remontez pas. Pour éviter de refaire le montage à la main à chaque fois, on peut ajouter une entrée dans `/etc/fstab`, le fichier qui décrit quelles partitions doivent être montées automatiquement au démarrage (systemd s'appuie sur ce fichier pour générer les points de montage).

Dans notre cas, pendant la construction de LFS, on souhaite surtout remonter la partition "root LFS" (souvent `/dev/sdb3`) sur le répertoire `/mnt/lfs`.

Le livre propose d'ajouter une ligne de ce type :

```
/dev/<xxx>  /mnt/lfs  ext4  defaults  1  1
```

Le problème, c'est que le nom `/dev/sdb3` peut changer d'un démarrage à l'autre (ordre de détection des disques), ce qui peut empêcher le montage automatique et, selon la configuration, bloquer le démarrage en mode "emergency".

La solution la plus fiable est d'utiliser l'**UUID** (identifiant unique qui ne change pas) :

```bash
sudo blkid /dev/sdb3
```

Puis dans `/etc/fstab` :

```
UUID=<uuid_de_sdb3>  /mnt/lfs  ext4  defaults  1  1
```

Une alternative acceptable, si vous voulez éviter qu'un échec de montage perturbe le démarrage, est d'ajouter une entrée "tolérante" :

```
UUID=<uuid_de_sdb3>  /mnt/lfs  ext4  defaults,nofail,x-systemd.device-timeout=1,x-systemd.automount  0  0
```

Dans ce cas, la partition sera montée automatiquement **à la première tentative d'accès** à `/mnt/lfs`.

### Partition swap

LFS nous propose d'activer le swap sur la machine hôte à l'aide de cette commande : `/sbin/swapon -v /dev/<zzz>`. C'est plus que probablement inutile. Notre distribution hôte possède très probablement déjà un swap. `lsblk` peut en témoigner. Cette activation ne sera véritablement utile que lorsque nous démarrerons notre distribution à la toute fin du projet.

## **Remarques techniques sur la chaîne de compilation (Partie II de LFS)**

Cette page est la plus importante de tout de livre. Elle explique la notion essentielle à comprendre pour la construction d'une nouvelle distribution Linux. Il indispensable mon sens de la lire attentivement et e bien l'appréhender. Je me propose ici de faire une explication équivalente dans le but de faciliter votre compréhension. Il est plus que possible que cette partie contienne quelques inexactitudes.

### Le chroot

Le chroot consiste à dire au système que le "/" a changé de dossier. Le dossier racine n'est plus "/" mais est /mnt/lfs dans notre cas.

### La "Canadian Cross Compilation"

Cette Canadian Cross Compilation imagine un scenario à trois machines : A, B et C. Au départ nous disposons uniquement du compilateur de la machine A.

A chaque étape nous avons 3 éléments à prendre en considération :

- La machine qui compile le nouveau compilateur (Construction)
- La machine qui utilisera ce nouveau compilateur (Hôte)
- La machine pour laquelle le nouveau compilateur sera en mesure de produire des binaires (Cible)

Voici les 3 étapes de compilation :

| Étape | Construction | Hôte | Cible | Action |
| --- | --- | --- | --- | --- |
| 1 | A | A | B | Construire un compilateur croisé cc1 avec ccA sur la machine A. |
| 2 | A | B | C | Construire un compilateur croisé cc2 avec cc1 sur la machine A. |
| 3 | B | C | C | Construire le compilateur ccC avec cc2 sur la machine B. |

Étape 1 : La machine A utilise ccA pour produire un nouveau compilateur : cc1. cc1 est capable de tourner sur la machine A et produit des exécutables pour la machine B.

Étape 2 : La machine A utilise cc1 pour produire un nouveau compilateur : cc2. cc2 est capable de tourner sur la machine B et produit des exécutables pour la machine C.

Étape 3 : La machine B utilise cc2 pour produire un nouveau compilateur : ccC. ccC est capable de tourner sur la machine C et produit des exécutables pour la machine C.

C'est clair ? Non ? Ba il faut relire 😊.

### **La compilation croisée dans LFS**

Maintenant nous allons nous intéresser à la compilation croisée dans le cadre de notre LFS. Le sommaire nous fait constater que GCC est compilé 3 fois exactement comme dans l'exemple théorique précedent. Voici les 3 compilations de gcc :

- [GCC-15.2.0 — Passe 1](https://fr.linuxfromscratch.org/view/lfs-12.4-systemd-fr/chapter05/gcc-pass1.html)
- [GCC-15.2.0 — Passe 2](https://fr.linuxfromscratch.org/view/lfs-12.4-systemd-fr/chapter06/gcc-pass2.html)
- [GCC-15.2.0](https://fr.linuxfromscratch.org/view/lfs-12.4-systemd-fr/chapter08/gcc.html) (nous l'appellerons gcc-lfs)

Voici les 3 étapes de compilation impémentées pour LFS :

| Étape | Construction | Hôte | Cible | Action |
| --- | --- | --- | --- | --- |
| 1 | Debian | Debian | Chroot | Construire un compilateur croisé gcc-Passe1 avec le gcc de la Debian sur la Debian. |
| 2 | Debian | Chroot | LFS | Construire un compilateur croisé gcc-Passe2 avec gcc-Passe1 sur la Debian. |
| 3 | Chroot | LFS | LFS | Construire le compilateur gcc-lfs avec gcc-Passe2 dans le Chroot. |

On retrouve donc les 3 mêmes étapes que dans la "Canadian Cross" : 

Étape 1 : La Debian utilise son compilateur pour produire un nouveau compilateur : gcc-Passe1. gcc-Passe1 est capable de tourner sur la Debian et produit des exécutables pour le Chroot.

Étape 2 : La Debian utilise gcc1-Passe1 pour produire un nouveau compilateur : gcc-Passe2. gcc-Passe2 est capable de tourner dans le Chroot et produit des exécutables pour LFS.

Étape 3 : Le Chroot utilise gcc-Passe2 pour produire un nouveau compilateur : gcc-lfs. gcc-lfs est capable de tourner dans LFS et produit des exécutables pour LFS.

Oui mais… LFS et le Chroot sont identiques ! Ce sont les deux même systèmes. D'ailleurs Le tableau de l'implémentation de la compilation croisé est celui-ci dans le livre :

| Étape | Construction | Hôte | Cible | Action |
| --- | --- | --- | --- | --- |
| 1 | pc | pc | lfs | Construire un compilateur croisé cc1 avec cc-pc sur pc. |
| 2 | pc | lfs | lfs | Construire un compilateur cc-lfs avec cc1 sur pc. |
| 3 | lfs | lfs | lfs | Reconstruire (et éventuellement tester) cc-lfs avec lui-même sur lfs. |

Aucune distinction n'est faite entre LFS et le Chroot.

<aside>
⁉️

Mais ! A quoi sert la dernière étape puisque nous disposons déjà d'un compilateur capable de tourner sur LFS et de produire des binaires pour LFS ?

</aside>

Mais ? A quoi sert la dernière étape ? Effectivement, en observant attentivement le tableau, dés la deuxième étape nous avons un compilateur capable de tourner dans notre distribution et de produire des éxécutables pour notre distribution. A quoi bon continuer ? On pourrait même pousser la question encore plus loin. Pourquoi ne pas tout faire en une seule étape ? La  Debian utiliserai son compilateur pour produire un nouveau compilateur cc-lfs. cc-lfs serait capable de tourner dans LFS et produirait des exécutables pour LFS.

| Étape | Construction | Hôte | Cible | Action |
| --- | --- | --- | --- | --- |
| 1 | pc | lfs | lfs | Construire un compilateur cc-lfs avec cc-pc sur pc. |

Eh bien la réponse est finalement assez courte : à cause des dépendances circulaires. Je m'explique…

Le langage C définit une bibliothèque standard, appelée **glibc**. Cette bibliothèque doit être compilée pour la machine LFS, c'est-à-dire à l'aide du compilateur croisé cc1. Mais le compilateur lui-même utilise une bibliothèque interne  : **libgcc** qui ****doit être liée à la bibliothèque **glibc** pour fonctionner correctement ! De plus, la bibliothèque standard C++ (**libstdc++**) a aussi besoin d'être associée à **glibc**. La solution à ce problème consiste d'abord à construire une **libgcc** inférieure basée sur cc1, qui ne dispose pas de fonctionnalités avancées comme les threads et le traitement des exceptions, puis de construire **glibc** avec ce compilateur inférieur (**glibc** elle-même n'étant pas inférieure !), puis de construire **libstdc++**. Cette bibliothèque ne dispose pas des fonctionnalités avancées de **libgcc**.

La conséquence du paragraphe précédent est que cc1 est incapable de construire une **libstdc++** complètement fonctionnelle avec la **libgcc** dégradée, mais cc1 est le seul compilateur disponible pour construire les bibliothèques C/C++ à la deuxième étape. Comme indiqué, nous ne pouvons pas exécuter cc-lfs sur pc (la distribution hôte) car il peut nécessiter certaines bibliothèques, du code ou des données qui ne sont pas disponibles sur « la construction » (la distribution hôte). Ainsi, lorsque nous construisons la deuxième étape de gcc, nous remplaçons le chemin de recherche des bibliothèques pour se lier à **libstdc++** de la **libgcc** nouvellement reconstruite au lieu de l'ancienne construction dégradée. Cela rend la **libstdc++** reconstruite complètement fonctionnelle.

## **Préparer les systèmes de fichiers virtuels du noyau (Section 7.3) et Entrer dans l'environnement chroot (Section 7.4)**

L'entrée dans le chroot (= "change root") est la première fois que l'on "s'isole" du système hôte pour utiliser notre compilateur croisé qui nous permettra de compiler les binaires définitifs qui seront utilisés par notre distribution LFS. MAIS (!), notre LFS ne possède pas encore son propre noyau ni ses propres systèmes de fichier virtuels qui permettent la communication avec le dit noyau. Nous sommes donc obligé d'emprunter les systèmes de fichier virtuels du système hôte et d'utiliser son noyau. Les montages `proc`, `sysfs`, `devpts`, `tmpfs` sont les **systèmes de fichiers virtuels** fournis par le noyau (en mémoire), nécessaires pour que les programmes *dans le chroot* puissent "parler" au noyau (processus, périphériques, pseudo-tty, etc.). LFS le dit explicitement : ces FS sont virtuels et doivent être montés dans l'arborescence `$LFS` pour que les applis du chroot les trouvent.

> Les applications qui tournent en espace utilisateur utilisent différents systèmes de fichiers créés par le noyau pour communiquer avec le noyau lui-même. Ces systèmes de fichiers sont virtuels du fait qu'ils n'utilisent aucun espace disque. Le contenu de ces systèmes de fichiers réside en mémoire. Ces systèmes de fichiers doivent être montés dans l'arborescence de $LFS pour que les applications puissent les trouver dans l'environnement chroot.
> 

A chaque redémarrage, il sera nécessaire de monter à nouveau ces systèmes de fichier virtuels avant d'entrer à nouveau dans le chroot. C'est pourquoi je remet ici les commandes nécessaires pour faire cela afin que vous n'ayez pas à fouiller dans le livre à chaque redémarrage de votre VM. Ces commandes doivent donc être exécuté sur le système hôte en tant que `root` :

- Tout d'abord le montage des systèmes de fichier :

```bash
mount -v --bind /dev $LFS/dev

mount -vt devpts devpts -o gid=5,mode=0620 $LFS/dev/pts
mount -vt proc proc $LFS/proc
mount -vt sysfs sysfs $LFS/sys
mount -vt tmpfs tmpfs $LFS/run

if [ -h $LFS/dev/shm ]; then
install -v -d -m 1777 $LFS$(realpath /dev/shm)
else
mount -vt tmpfs -o nosuid,nodev tmpfs $LFS/dev/shm
fi
```

> Le montage avec --bind est un type spécial de montage qui vous permet de créer le miroir d'un répertoire ou d'un point de montage à un autre endroit.
> 

`mount --bind /dev $LFS/dev` n'attache pas une partition : c'est un **bind mount** = "deuxième vue" du même arbre de répertoires (ici, on "revois" `/dev` de l'hôte à l'intérieur de `$LFS/dev`).

- Ensuite l'entrée dans chroot :

```bash
chroot "$LFS" /usr/bin/env -i \
HOME=/root \
TERM="$TERM" \
PS1='(lfs chroot) \u:\w\$ ' \
PATH=/usr/bin:/usr/sbin \
MAKEFLAGS="-j$(nproc)" \
TESTSUITEFLAGS="-j$(nproc)" \
/bin/bash --login
```

## **Configuration générale du réseau (Section 9.2)**

Cette section est importante car elle permettra à notre futur système LFS de se connecter à internet. Comme le livre propose différentes solutions de configuration, je vous remet ici celle qui est la plus pertinente pour le projet ft_linux. 

- **9.2.1.3. Configuration du DHCP.**

```bash
cat > /etc/systemd/network/10-eth-dhcp.network << "EOF"
[Match]
Name=<network-device-name>

[Network]
DHCP=ipv4

[DHCPv4]
UseDomains=true
EOF
```

`ip link` permet de connaitre `<network-device-name>`

- **9.2.3. Configurer le nom d'hôte du système**

```bash
echo <student_login> > /etc/hostname
```

<aside>
⚠️

Attention cette commande  permet de répondre à l'une des éxigences du sujet : "Le **nom d'hôte** de votre distribution doit également être **votre login étudiant**." !

</aside>

- **9.2.4. Personnaliser le fichier /etc/hosts**

```bash
 cat > /etc/hosts << "EOF"
# Début de /etc/hosts

127.0.0.1 <login_student>.localhost.ch <login_student>
::1       ip6-localhost ip6-loopback
ff02::1   ip6-allnodes
ff02::2   ip6-allrouters

# Fin de /etc/hosts
EOF
```

## L**inux-6.16.1** (Section 10.3)

La section est parfaitement claire dans le livre. Cependant je vais attirer votre attention sur 3 consignes du sujet, qui doivent être remplis à ce moment :

- Consigne 1 : La version du noyau doit contenir **votre login étudiant**, par exemple : `Linux kernel 4.1.2-<login_étudiant>`

Il faut configurer cela dans le menu de configuration du noyau `make menuconfig`. Voici quelques captures d'ecran pour vous montrer comment faire :

![ecran1-menuconfig-lfs.jpg](/projets/ft_linux/tutoriel/assets/ecran1-menuconfig-lfs.jpg)

![ecran2-menuconfig-lfs.jpg](/projets/ft_linux/tutoriel/assets/ecran2-menuconfig-lfs.jpg)

![Ne pas oublier le "-" avant le login !](/projets/ft_linux/tutoriel/assets/ecran3-menuconfig-lfs.jpg)

Ne pas oublier le "-" avant le login !

- Consigne 2: Vous devez utiliser **au moins trois partitions** : une racine (`/`), une `/boot`, une **partition d'échange (swap)**

LFS vous prévient mais je le répète. Notre dossier /boot doit être monté sur une partition séparée de notre partition utilisateur (root). Cela signifie qu'avant d'entrer dans le chroot, il faut monter la partition boot avec le dossier boot qui se trouve dans `/mnt/lfs` . Attention la partition root doit être monté en premier pour pouvoir voir les dossiers qu'elle contient dans `/mnt/lfs` Pour cela :

```bash
mount /dev/sdXN /mnt/lfs/boot
```

- Consigne 3 : La version du noyau doit contenir **votre login étudiant**, par exemple : `Linux kernel 4.1.2-<login_étudiant>`

LFS nous dit "Vous pouvez changer le nom du fichier ci-dessous selon votre goût". Il est donc essentiel d'adapter la commande du livre commesuit : `cp -iv arch/x86/boot/bzImage /boot/vmlinuz-<linux_version>-<login_étudiant>` .

- Consigne 4 : Les **sources du noyau** doivent se trouver dans : `/usr/src/kernel-$(version)`. C'est le moment de le faire !

## **Utiliser GRUB pour paramétrer le processus de démarrage (Section 10.4)**

LFS nous propose ce template :

```bash
cat > /boot/grub/grub.cfg << "EOF"
# Début de /boot/grub/grub.cfg
set default=0
set timeout=5

insmod part_gpt
insmod ext2

set root=(hd0,2)

set gfxpayload=1024x768x32

menuentry "GNU/Linux, Linux 6.16.1-lfs-12.4-systemd" {
        linux   /boot/vmlinuz-6.16.1-lfs-12.4-systemd root=/dev/sda2 ro
}
EOF
```

Dans le projet il est nécessaire de faire quelques adaptations :

- `set root=(hd0,2)` : je conseille de remplacer ceci par `search -fs-uuid —set=root <UUID>` . Cela garantira le bon fonctionnement du systeme. Le risque etant que le disque virtuel change d'ordre lors du démarrage de la VM.
- `linux   /boot/vmlinuz-6.16.1-lfs-12.4-systemd root=/dev/sda2 ro` doit être remplacé par `linux   /boot/vmlinuz-6.16.1-<student_login> root=PARTUUID=<PARTUUID> ro`

Pour obtenir l'UUID et le PARTUUID du vdi que vous utilisez, il faut utiliser la commande `blkid` sur la machine hôte.
