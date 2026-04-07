# Notions essentielles à connaître avant de commencer

<aside>
📖

Les sources sont en bas de ce document. La plupart des réponses aux questions proviennent de wikipedia.

</aside>

## Quelle est le séquence de démarrage d'un micro-ordinateur ?

Voici la séquences des différentes couches qui interviennent lors de la mise sous tension d'un micro-ordinateur sur lequel est installé une distribution Linux :

<aside>
👉🏽

Matériel → Firmware (BIOS/UEFI) → Bootloader (ex. GRUB ; LILO est aujourd'hui rare) → Noyau Linux (souvent avec un initramfs) → Système d'initialisation (init / systemd) → Espace utilisateur (services, login, shell, etc.)

</aside>

Petite précision utile : le noyau lance en général un tout premier processus (PID 1) — **systemd** ou un autre *init* — qui se charge ensuite de démarrer le reste du système (services, montages, session…).

## Qu'est ce qu'une partition ?

En informatique, une **partition** est une section d'un support de stockage (disque dur, SSD, carte-mémoire...). Le partitionnement est l'opération qui consiste à diviser ce support en partitions dans lesquelles le système d'exploitation peut gérer les informations de manière séparée, généralement en y créant un système de fichiers, une manière d'organiser l'espace disponible.

Chaque système d'exploitation a une manière différente de désigner les partitions qu'il détecte. Les systèmes Unix ou Gnu/Linux, les désignent par un identifiant sous la forme *sdXN*, avec *X* une lettre représentant le support et *N* le numéro de la partition sur le support (par exemple *sdb3* pour la troisième partition du disque *b*).

On nomme « partition d'amorçage », ou en anglais *boot partition*, (parfois par abus de langage « partition primaire ») celle dans laquelle le micro-code, après avoir accompli l'initialisation du matériel, va chercher les *premières* instructions à exécuter pour continuer le processus de démarrage. En général, ce micro-code y trouve un chargeur d'amorçage qui lui permet, soit de démarrer l'unique système d'exploitation présent sur l'ordinateur, soit de présenter à l'utilisateur un choix entre différents systèmes chargeables.

Un support de stockage peut être partitionné pour différentes architectures. On trouve ainsi le partitionnement de type MBR (partitionnement Intel) longtemps employé sur la majorité des ordinateurs personnels de type PC pour les supports d'une capacité inférieure ou égale à 2 To (le partitionnement MBR étant limité par l'adressage en 32 bits), ou GPT pour des architectures plus récentes (Macintosh, Linux, et PC depuis les années 2010) conçues pour exploiter pleinement les supports de capacité supérieure à 2 To.

### Que signifit "monter une partition" ?

**Monter** (un système de fichiers) signifie **le rendre accessible en l'attachant à un répertoire**, appelé *point de montage*. Concrètement, quand vous montez une partition sur un dossier, son contenu apparaît **à cet endroit** dans l'arborescence (par exemple, monter `/dev/sda2` sur `/mnt/lfs` rend les fichiers de cette partition visibles via `/mnt/lfs`).

Le piège classique à éviter :

Si vous montez une partition sur un répertoire qui **contient déjà des fichiers**, ces fichiers ne sont pas supprimés, mais ils deviennent **invisibles tant que la partition reste montée**. Ils réapparaîtront après un `umount`. Autrement dit : la partition "recouvre" temporairement le contenu du dossier.

## Qu'est-ce qu'un système de fichier ?

De façon générale, un **système de fichiers** ou **système de gestion de fichiers** (SGF) est une façon de stocker les informations et de les organiser dans des fichiers sur ce que l'on appelle, en génie logiciel, des mémoires secondaires (pour le matériel informatique, il s'agit de mémoire de masse comme un disque dur, un disque SSD, une clé USB, etc.). Une telle gestion des fichiers permet de traiter, de conserver des quantités importantes de données ainsi que de les partager entre plusieurs programmes informatiques. Il offre à l'utilisateur une vue abstraite sur ses données et permet de les localiser à partir d'un chemin d'accès.

## Qu'est ce que le BIOS ?

Le **BIOS (*Basic Input Output System)*** est un firmware. Il est principalement utilisé sur les systèmes informatiques utilisant l'architecture de processeur 32 bits i686 d'Intel et 64 bits d'AMD. Il comporte un ensemble de fonctions, contenu dans la mémoire morte (ROM) de la carte mère de l'ordinateurs, lui permettant d'effectuer des opérations de base, lors de sa mise sous tension. Par exemple l'identification et l'initialisation des périphériques d'alimentation et d'entrée/sortie 
connectés et la lecture du système d'amorçage, que ce soit un secteur d'amorçage sur la mémoire de masse (disque dur, clé USB, SSD). Il permet également au système de communiquer avec les différents périphériques de la carte 
mère. Sur les cartes récentes, l'UEFI a été ajouté au BIOS pour unifier les méthodes de communication avec le noyau du système. C'est un palliatif de l'absence de spécification ouverte des pilotes de périphériques, tels qu'ils se présentent au sein du BIOS.

L'objectif du BIOS est de rendre transparente, à tout système d'exploitation, la façon dont le fabricant a développé la carte mère (quels composants il a choisis et la manière dont ils sont interconnectés). Ainsi, en utilisant les mêmes fonctions du BIOS sur deux cartes mères différentes, on obtiendra le même résultat. Les systèmes d'exploitation peuvent utiliser ces fonctions, au moins pendant les premières étapes du démarrage de l'ordinateur, et ensuite lors du fonctionnement normal pour un accès direct au matériel.

Le BIOS comprend également le logiciel nécessaire à l'amorçage de l'ordinateur. La première phase de l'amorçage  (*boot*) est la mise sous tension et le cadençage de quelques périphériques essentiels). Il vient ensuite l'auto-configuration à l'allumage (POST de l'anglais *Power-On Self-Test*), qui compte la quantité de mémoire, teste les disques et configure les composants. La séquence d'amorçage continue avec la recherche d'un système d'exploitation, dans l'ordre des périphériques disponibles, avant de le lancer.

Le BIOS prend en charge à bas niveau les communications avec les périphériques, néanmoins le système d'exploitation peut aussi s'adresser directement aux périphériques s'il le juge nécessaire. Parmi les prises en charge offertes par le BIOS, il y a celle du clavier et celle d'un mode d'affichage simplifié.

Le BIOS contient également des outils de diagnostic pour vérifier sommairement l'intégrité des composants critiques comme la mémoire, le clavier, le disque dur, les ports d'entrée/sortie, etc.

Certains paramètres du BIOS peuvent être réglés par l'utilisateur (ordre des périphériques à scruter pour détecter une zone de *boot*, type et fréquence du processeur, etc.). L'ensemble de ces paramètres est stocké de manière permanente grâce à une mémoire de taille réduite (quelques centaines d'octets) à faible consommation (type CMOS) alimentée par une pile (généralement au lithium) présente sur la carte mère. Cette mémoire est communément appelée, par abus, « CMOS ».

## Qu'est ce que l'UEFI ?

Le standard **UEFI** (**Unified Extensible Firmware Interface**) définit une interface entre le *firmware* et le système d'exploitation (OS) d'un ordinateur. Cette interface succède sur certaines cartes mères au BIOS. L'UEFI offre de nombreux avantages sur le BIOS : 

- fonctionnalités réseau en standard
- interface graphique de bonne résolution
- gestion intégrée d'installations multiples de systèmes d'exploitation et affranchissement de la limite des disques à 2,2 To.

Le BIOS, écrit en assembleur, limitait les modifications et/ou remplacements, gage de sûreté de fonctionnement et de sécurité. L'UEFI est écrit en C, ce qui rend sa maintenance plus souple et reste acceptable en raison des coûts décroissants de la mémoire. L'UEFI a été développé pour assurer l'indépendance entre système d'exploitation et plate-forme matérielle sur laquelle il fonctionne.

## Qu'est ce que GRUB ?

**GNU GRUB** (***GR**and **U**nified [**B**](https://fr.wikipedia.org/wiki/Chargeur_d%27amor%C3%A7age)ootloader*) est un programme d'amorçage de micro-ordinateur. Il s'exécute au demarrage de l'ordinateur avant le système d'exploitation proprement dit, puisque son rôle est justement d'en organiser le chargement. Lorsque l'ordinateur héberge plusieurs systèmes (multi-amorçage), il permet à l'utilisateur de choisir quel système démarrer.

C'est un logiciel libre. Il permet l'amorçage de systèmes GNU/Linux ou Windows (ainsi que d'autres systèmes), la lecture de la configuration au démarrage (pas besoin de réinstaller  GRUB dans le secteur d'amorçage après un changement de configuration, contrairement à LILO), une ligne de commande permettant de changer la configuration au démarrage et surtout la reconnaissance en natif de divers systèmes de fichiers existants. Il possède également une sorte de langage de commande simple permettant de « rattraper » un amorçage qui se serait mal passé, à la suite du mauvais adressage d'une partition, par exemple.

Grub doit être capable de reconnaître *tous* les systèmes de fichiers sur lesquels il pourrait être amené à démarrer. Il est pour cette raison beaucoup plus volumineux que LILO. Il fait partie du projet GNU.

## Qu'est ce que le kernel ?

Le kernel (noyau) est un programme qui se trouve au cœur du système d'exploitation. Il est responsable d'éviter les conflits entre les différent process en cours. Il permet la communication entre les processus. Il assure la communication entre les logiciels et le matériel. Le kernel possède sa propre région au sein de la mémoire vive. L'autre partie de la mémoire vive est disponible pour l'utilisateur.

Il assure :

- la communication entre les logiciels et le matériel ;
- la gestion des divers logiciels d'une machine (lancement des programmes, ordonnancement…) ;
- la gestion du matériel (mémoire, processeur, stockage…).

## Qu'est ce que systemD ?

**systemd** est une suite logicielle (quelques dizqines de binaires) qui fournit une gamme de composants système pour les systèmes d'exploitation Linux. Il a été conçu pour unifier la configuration et le comportement des services entre les distributions Linux Son composant principal est un système d'initialisation (init) utilisé pour amorcer l'espace utilisateur et gérer les processus utilisateurs (démarrage, arrêt, dépendance,…). Elle fournit également des remplacements pour divers démons et utilitaires, notamment la gestion des périphériques, la gestion des connexions (login), la gestion des connexions réseau et la journalisation des événements. Le "d" de "*systemd"* fait référence au fait qu'il s'agit d'un daemon.

Depuis 2015, presque toutes les distributions Linux ont adopté systemd.

Les critiques de systemd soutiennent qu'il souffre d'une inflation fonctionnelle (*feature creep*) et qu'il a nui à l'interopérabilité entre les systèmes d'exploitation de type Unix (puisqu'il ne fonctionne pas sur des dérivés Unix non Linux comme BSD ou Solaris). De plus, ils estiment que l'ensemble étendu de fonctionnalités de systemd crée une surface d'attaque plus grande. Cela a conduit au développement de plusieurs distributions Linux mineures remplaçant systemd par d'autres systèmes d'initialisation, comme SysVinit.

Il s'exécute dans le processus ayant l'id 1. C'est un système d'initialisation appelé par le kernel. 

## Qu'est ce que udev ?

**udev** est un gestionnaire intégré à Linux depuis la version 2.6. Sa fonction principale est de gérer les périphériques dans le répertoire /dev. udev s'exécute en mode utilisateur et écoute le socket netlink pour communiquer avec le noyau. Contrairement au système traditionnel de gestion de périphériques sous Linux, qui utilisait un ensemble statique de nœuds de périphériques, udev fournit dynamiquement des nœuds seulement pour les périphériques réellement présents sur le système.

Lors d'un démarrage normal d'un système Linux, le noyau monte automatiquement le système de fichiers `devtmpfs` dans le répertoire `/dev` et crée des nœuds de périphériques sur que système de fichiers virtuel pendant le processus de démarrage ou lorsqu'un périphérique est détecté ou qu'on tente d'y pour la première fois (par exemple lorsque l'on branche une clé USB). Le démon udev permet de modifier le propriétaire, de gérer les permissions des nœuds de périphériques créés par le noyau, d'en créer de nouveaux ou de créer des liens symboliques afin de faciliter la tâche de maintenance de distribution ou d'administration système.

## Qu'est ce qu'une chaîne de compilation ?

La majorité des programmes actuels sont écrits dans des langages de haut niveau  (C, le Java, …). Mais ces le processeur,  ne comprend que le langage machine. Les codes sources écrits dans des langages de 
haut niveau doivent donc être traduit en langage machine par la **chaîne de compilation**. À l'heure actuelle, la majorité des compilateurs ne traduit pas directement un langage de haut niveau en langage machine, mais passe par un langage intermédiaire : l'**assembleur**. Il va de soit que cet assembleur doit être traduit en langage machine pour être exécuté par le processeur. Tout ce qui se passe entre la compilation et l'exécution du programme est pris en charge par **trois programmes** qui forment ce qu'on appelle la **chaîne d'assemblage :**

1. Cette chaîne d'assemblage commence par le **logiciel d'assemblage** qui traduit le code assembleur en  code machine. Ce code machine est alors mémorisé dans un fichier objet.
2. Ensuite, l'**éditeur de liens** (ou linker) combine plusieurs fichiers objets en un fichier exécutable.
3. Enfin, le **chargeur de programme** (ou loader), charge les programmes en mémoire.

L'ensemble regroupant compilateur et chaîne d'assemblage, avec éventuellement des interpréteurs, est appelé la **chaîne de compilation**.

## Notions de Bash

### LC_ALL

La commande suivante permet d'avoir la sortie de `command` en français.

```bash
LC_ALL=fr_FR command
```

### Rappel commande cat

La commande suivante revient très souvent dans LFS. Soyez au clair avec son fonctionnement.

```bash
cat <nom_du_fichier> << EOF
Hello World !
EOF
```

cat va écrire dans le fichier tout le texte qu'il trouve ligne après ligne jusqu'à rencontrer EOF.

### su VS sudo

Pour suivre LFS, il est très important de faire la distinction entre l'utilisation de su et de sudo. Voici un tableau récapitulatif :

| Commande | But | Environnement de départ |
| --- | --- | --- |
| `su <user>` | changer d'utilisateur | conserve l'environnement courant |
| `su - <user>` | changer d'utilisateur en **shell de connexion** | charge l'environnement de l'utilisateur cible |
| `sudo <commande>` | exécuter une commande en tant que root (ou autre) | conserve l'environnement |
| `sudo -s` | ouvrir un shell root | conserve l'environnement courant |
| `sudo -i` | ouvrir un shell root en **shell de connexion** | charge l'environnement root |

Qu'est-ce qu shell de connexion ?

Un shell de connexion simule une connexion en affectant aux variables d'environnement des valeurs différentes. Par exemple la variable HOME sera modifié pour contenir le chemin vers le répertoire `home/<user>` qui correspond à l'utilisateur "connecté".

## Qu'est ce qu'un fichier .vdi ?

Un fchier ".vdi" et une image disque conçu pour faire tourner des machines virtuelles sur virtual box. Virtual Box est en mesure de créer une machine virtuelle sur la base de ce ".vdi". Le fichier contient le kernel, le nécessaire pour faire fonctionner la distribution et les fichiers créé par l'utilisateur. Une fois que notre LFS est terminée, il est possible de faire foncitonner notre distribution sur n'importe quel ordinateur sur lequel est installé Virtual Box.
