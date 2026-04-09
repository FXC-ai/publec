# ft_linux

# Avant propos

Bienvenue dans ce mini-tutoriel, écrit pour vous aider — du moins je l'espère — à aller au bout du projet **ft_linux** de l'école 42. Avant de commencer, voici quelques remarques importantes.

1. **Ne prenez pas tout au pied de la lettre.** Malgré le soin apporté à la rédaction, ce document peut contenir des erreurs ou des imprécisions. Si vous repérez un problème, n'hésitez pas à **ouvrir une issue** (ou à proposer une correction).
2. Ce tutoriel s'appuie sur la version française du livre **Linux From Scratch 12.4-systemd**.
3. En pratique, le cœur du projet consiste à **suivre Linux From Scratch** (LFS) pas à pas. Le sujet **ft_linux** demande seulement de respecter quelques contraintes supplémentaires mais le guide LFS suffit presque entièrement.
    
    Voici les points sur lesquels il faut être particulièrement attentif :
    
    1. **Partitionnement** : LFS évoque une partition `/boot` mais ne l'impose pas toujours selon les choix du lecteur. Le sujet **ft_linux**, lui, exige **au moins trois partitions**, dont une **`/boot` séparée** (en plus de `/` et du swap).
    2. **Nom d'hôte (hostname)** : il doit être **votre login étudiant**.
    3. **Version du noyau** : la chaîne renvoyée par le noyau doit inclure **votre login étudiant** (ex. `Linux kernel X.Y.Z-<login>`).
    4. **Nom du binaire du noyau dans `/boot`** : il doit suivre la forme `vmlinuz-<linux_version>-<login_étudiant>`
    5. **Emplacement des sources du noyau** : elles doivent se trouver dans `/usr/src/kernel-$(version)`.
