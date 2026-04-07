# Sujet

## Chapitre I - Introduction

Bienvenue dans **ft_linux**. Dans ce projet, vous devez construire une distribution Linux basique mais fonctionnelle. Ce sujet ne porte **pas sur la programmation du noyau (Kernel)**, mais il y est **étroitement lié**. Cette distribution sera **la base de tous vos projets liés au noyau**, car tout votre code kernel sera exécuté ici, sur votre propre distribution. Essayez d'y implémenter ce que vous voulez ou ce dont vous avez besoin. C'est votre **espace utilisateur** — prenez-en soin !

## Chapitre II - Objectifs

- Construire un noyau Linux
- Installer plusieurs binaires (voir la liste ci-dessous)
- Mettre en place une **hiérarchie de système de fichiers conforme aux [standards](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)**
- Connecter le système à Internet

## Chapitre III - Instructions générales

### III.0.1 Ressources

- [**La Bible**](https://www.linuxfromscratch.org/lfs/view/stable/index.html)
- **Comment construire un noyau Linux** : il existe en ligne de nombreuses ressources détaillant, étape par étape, la configuration, la compilation et l'exécution d'un noyau Linux personnalisé.
- [**Autotools**](https://www.gnu.org/software/automake/manual/html_node/index.html#SEC_Contents)

### III.0.2 Instructions

- Pour ce projet, vous **devez utiliser une machine virtuelle** (par exemple VirtualBox ou VMWare).
- Bien que **non obligatoire**, il est **vivement recommandé** de lire certains documents de référence dès maintenant et de garder ces standards à l'esprit. Vous ne serez pas noté sur votre conformité totale à ces standards, mais ce sera une **bonne pratique**.
- Vous devez utiliser une **version du noyau ≥ 4.0** (stable ou non, du moment que c'est une version ≥ 4.0).
- Les **sources du noyau** doivent se trouver dans : `/usr/src/kernel-$(version)`
- Vous devez utiliser **au moins trois partitions** :
    - une racine (`/`)
    - une `/boot`
    - une **partition d'échange (swap)**
        
        Vous pouvez bien sûr en créer davantage si vous le souhaitez.
        
- Votre distribution doit implémenter un **chargeur de modules du noyau**, comme `udev`.
- La version du noyau doit contenir **votre login étudiant**, par exemple : `Linux kernel 4.1.2-<login_étudiant>`
- Le **nom d'hôte** de votre distribution doit également être **votre login étudiant**.
- Vous êtes libre de choisir entre un **système 32 bits ou 64 bits**.
- Vous devez utiliser un logiciel de **gestion et configuration centralisée**, comme **SysV** ou **SystemD**.
- Votre distribution doit **démarrer avec un chargeur d'amorçage**, tel que **LILO** ou **GRUB**.
- Le **binaire du noyau** situé dans `/boot` doit être nommé comme suit : `vmlinuz-<linux_version>-<login_étudiant>`
    
    Adaptez votre configuration de bootloader en conséquence.
    

## Chapitre IV - Partie obligatoire

### IV.0.1 Paquets à installer

Les paquets listés ci-dessous (comme **vim**, **bash**, **grub**, **udev**) ne sont que des **exemples**. Vous pouvez les remplacer par tout équivalent de votre choix et utiliser les **versions** que vous voulez.

- Acl

- Attr

- Autoconf

- Automake

- Bash

- Bc

- Binutils

- Bison

- Bzip2

- Check

- Coreutils

- DejaGNU

- Diffutils

- Eudev

- E2fsprogs

- Expat

- Expect

- File

- Findutils

- Flex

- Gawk

- GCC

- GDBM

- Gettext

- Glibc

- GMP

- Gperf

- Grep

- Groff

- GRUB

- Gzip

- Iana-Etc

- Inetutils

- Intltool

- IPRoute2

- Kbd

- Kmod

- Less

- Libcap

- Libpipeline

- Libtool

- M4

- Make

- Man-DB

- Man-pages

- MPC

- MPFR

- Ncurses

- Patch

- Perl)

- Pkg-config

- Procps

- Psmisc

- Readline

- Sed

- Shadow

- Sysklogd

- Sysvinit

- Tar

- Tcl

- Texinfo

- Time Zone Data

- Udev-lfs Tarball

- Util-linux

- Vim

- XML::Parser

- Xz Utils

- Zlib

> Pour les **besoins de l'évaluation**, vous devez être capable de **télécharger du code source**. Nous recommandons fortement d'installer **curl**, **wget** ou tout autre outil équivalent.
> 

> À des fins d'évaluation, vous devez également être capable d'installer des paquets, alors assurez-vous d'avoir tout ce dont vous avez besoin.
> 

## Chapitre V - Partie bonus

Vous avez un système stable ? Parfait. Maintenant, amusons-nous un peu !

Installez ce que vous voulez.

N'importe quel logiciel, une interface graphique, **N'IMPORTE QUOI**.

Faites de ce système **le vôtre**, avec **votre touche personnelle**.

Des points spéciaux seront attribués pour l'installation d'un **serveur X** et de **gestionnaires de fenêtres / environnements de bureau**, tels que **GNOME**, **LXDE**, **KDE**, **i3**, **dwm**, etc.

> ⚠️ La partie bonus ne sera évaluée **que si la partie obligatoire est PARFAITE.** « Parfaite » signifie que la partie obligatoire a été entièrement réalisée et fonctionne **sans aucun dysfonctionnement.**
> 

Si vous n'avez pas rempli **toutes** les exigences obligatoires, votre partie bonus ne sera **pas évaluée du tout.**

## Chapitre VI - Rendu et évaluation par les pairs

Soumettez votre projet dans votre dépôt Git comme d'habitude. Seul le travail présent **dans votre dépôt** sera évalué lors de la soutenance.

N'hésitez pas à vérifier soigneusement les noms de vos dossiers et fichiers pour vous assurer qu'ils sont corrects.

Pour des raisons évidentes, vous ne pousserez **pas** l'intégralité de votre machine virtuelle, mais plutôt **une somme de contrôle (checksum)** de votre image disque.

Cela peut être fait avec une commande comme :

```bash
shasum < disk.vdi
```

Gardez votre image disque quelque part pour l'évaluation par les pairs.
