# Compilation et utilisation de la bibliothèque

## Etape 1 : Compiler la librairie grâce au Makefile

Contrairement à la plupart des projet 42, le makefile ne doit pas produire un executable mais une librairie partageable en .so appelée `libft_malloc_$[HOSTTYPE.so](http://hosttype.so/)`

Pour la compilation des fichier “.o” :

```bash
gcc -Wall -Wextra -Werror -fPIC -c fichier1.c fichier2.c -o fichier1.o fichier2.o -I chemin_vers_fichier_h
```

Pour la compilation de la librairie :

```bash
gcc -Wall -Wextra -Werror -shared fichier1.o fichier2.o -o nom_de_la_librairie
```

… ainsi qu’un lien symbolique vers cette librairie.

```bash
ln -s nom_de_la_librairie nom_du_lien_symbolique
```

## Etape 2 : Compiler un exécutable de test

Pour tester notre `malloc`, on compile un programme simple en **liant** notre bibliothèque :

```bash
gcc simple_test.c -I inc -L. -lft_malloc
```

`inc` : emplacement de malloc.h

## Etape 3 : Forcer l’utilisation de notre malloc

Par défaut, tous les programmes utilisent le **malloc de la libc**.

Pour rediriger les appels vers **notre implémentation**, on utilise deux variables d’environnement :

```bash
export LD_LIBRARY_PATH=$PWD
export LD_PRELOAD=$PWD/libft_malloc.so
```

- `LD_LIBRARY_PATH` indique où chercher les bibliothèques partagées.
- `LD_PRELOAD` force le chargement de notre bibliothèque avant toutes les autres (y compris la libc).

⚠️ **Attention :** ne pas exécuter ces commandes globalement dans ton terminal, car elles affecteraient toutes les commandes (et la plupart cesseraient de fonctionner).

Pour une exécution sécurisée, il esr possible d’utiliser un script dans un fichier sh, par exemple run.sh:

```bash
#!/bin/sh
export LD_LIBRARY_PATH=$PWD
export LD_PRELOAD=$PWD/libft_malloc.so
$@
```

Ainsi la commande suivante permet de bypass le malloc par défaut uniquement pour notre executable de test.

```bash
sh run.sh ./a.out
```

Ce script applique le `LD_PRELOAD` **uniquement** pour le programme donné

## Commande récapitulative

Pendant tout le projet je testais mon code avec la commande suivante qui effectue les 3 etapes précedentes en une seule fois :

```bash
 make && gcc simple_test.c -I inc -L. -lft_malloc && sh run.sh valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./a.out
```

## A propos des leaks

Il est possible d’utiliser Valgrind entant que chasseur de leaks. Pour cela il faut compiler l’executable de test avec les flags suivants :

```bash
gcc -g -O0 test.c
```

Et lancer l’exécutable avec cette commande :

```bash
 valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./main
```

Cependant, il faut noter que Valgrind utilise lui-même des appels à `malloc` et `calloc`. Si notre `malloc` est activé via `LD_PRELOAD`, Valgrind peut se retrouver à **analyser son propre fonctionnement**, ce qui entraîne souvent des faux positifs ou des comportements inattendus.

> 💡 Pour des tests précis, il est donc recommandé de :
> 
> - exécuter Valgrind **sans** `LD_PRELOAD` pour tester ton code utilisateur,
> - et avec `LD_PRELOAD` uniquement pour vérifier le comportement général du `malloc` (pas pour mesurer les leaks).

