# Remarques concernant le sujet

### Qu’est-ce qu’un fichier .so ?

Un fichier **`.so`** (pour *shared object*) contient du code et des données pouvant être partagés entre plusieurs programmes. Contrairement aux bibliothèques statiques **`.a`**, dont le contenu est copié directement dans chaque exécutable lors de la compilation, une bibliothèque **dynamique** (`.so`) est simplement **référencée** par le programme au moment de l’exécution. Cela permet d’économiser de la mémoire et de mettre à jour une bibliothèque sans recompiler les programmes qui l’utilisent.

### Pourquoi faut il utiliser des threads ?

L’utilisation des **threads** est requise pour le bonus, afin de rendre les fonctions `malloc`, `free` et `realloc` **thread-safe**.

En effet, la **heap** (le tas mémoire du processus) est **partagée entre tous les threads** d’un même processus. Si plusieurs threads appellent `malloc` ou `free` simultanément sans protection, ils peuvent modifier les structures internes de gestion mémoire en même temps, provoquant ainsi une **corruption de la mémoire**.

Pour éviter cela, on utilise un **mutex** (verrou) afin de garantir qu’un seul thread à la fois puisse manipuler la heap.

> 💡 Note : les threads partagent la même mémoire, contrairement aux processus qui ont chacun leur propre espace mémoire.
> 

### Pourquoi faut il utiliser une variable globale ?

Une variable globale est nécessaire pour mémoriser l’adresse de la heap principale et suivre son état entre plusieurs appels à malloc, free et realloc. Sans cette variable, chaque appel à malloc ignorerait les précédentes allocations, empêchant ainsi toute gestion cohérente de la mémoire. La variable globale agit donc comme un point d’entrée central vers la structure de données interne qui représente la heap.

### Pourquoi pré-allouer des heap TINY ou SMALL ?

Comme indiqué dans le sujet, les zones TINY et SMALL servent à réduire le nombre d’appels système (`mmap / munmap`), qui sont coûteux en temps.

En effet, mmap alloue la mémoire par pages, généralement de 4096 octets. Si chaque petit malloc (`malloc(4)` par exemple) appelait directement `mmap`, cela gaspillerait énormément de mémoire (4096 octets alloués pour seulement 4 utiles) et ralentirait fortement le programme.

En regroupant plusieurs petites allocations dans des zones pré-allouées (TINY ou SMALL), on diminue les appels système. Cela améliore les performances globales du malloc.





