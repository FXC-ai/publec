### Instructions générales

- Ce projet sera corrigé uniquement par des humains. Vous êtes autorisé à organiser et nommer vos fichiers comme vous le souhaitez, mais vous devez respecter les règles suivantes :
- La bibliothèque doit être nommée **libft_malloc_$HOSTTYPE.so**.
- Un **Makefile** ou équivalent doit compiler le projet et contenir les règles habituelles. Il doit recompiler et re-lier le programme uniquement si nécessaire.
- Votre Makefile devra vérifier l’existence de la variable d’environnement **$HOSTTYPE**. Si elle est vide ou inexistante, il faudra lui assigner la valeur suivante :`uname -m`_`uname -s`
    
    ```bash
    ifeq ($(HOSTTYPE),)
    HOSTTYPE := $(shell uname -m)_$(shell uname -s)
    endif
    ```
    

Votre Makefile devra créer un lien symbolique **libft_malloc.so** pointant vers **libft_malloc_$HOSTTYPE.so**. Par exemple :

```bash
libft_malloc.so -> libft_malloc_intel-mac.so
```

- Si vous êtes malin, vous utiliserez votre bibliothèque pour votre malloc.
- Vous devez également soumettre votre dossier **libft** incluant son propre Makefile à la racine de votre dépôt. Votre Makefile devra compiler la bibliothèque, puis compiler votre projet.
- Vous êtes autorisé à utiliser **une variable globale** pour gérer vos allocations et **une variable globale** pour la gestion du thread-safe.
- Votre projet doit être du **code propre** : même sans norme stricte, si c’est moche vous aurez **0**.
- Vous devez gérer les erreurs avec soin. En aucun cas vos fonctions ne doivent provoquer de **comportement indéfini** ou de **segfault**.
- Dans la partie obligatoire, vous êtes autorisé à utiliser uniquement les fonctions suivantes :
    - `mmap(2)`
    - `munmap(2)`
    - `getpagesize` sous OSX ou `sysconf(_SC_PAGESIZE)` sous Linux
    - `getrlimit(2)`
    - Les fonctions autorisées dans votre **libft** (exemple : `write(2)`)
    - Les fonctions de **libpthread**
- Vous êtes autorisé à utiliser d’autres fonctions pour la partie bonus, tant que leur utilisation est justifiée lors de votre soutenance. Soyez intelligents !
- Vous pouvez poser vos questions sur le forum, sur Slack, etc.

### Partie obligatoire

Ce mini-projet consiste à écrire une bibliothèque de gestion de la mémoire dynamique.

Afin que vous puissiez l’utiliser avec des programmes déjà existants sans les modifier ni les recompiler, vous devez réécrire les fonctions de la libc suivantes : **malloc(3)**, **free(3)** et **realloc(3)**.

Vos fonctions devront être prototypées comme les fonctions système :

```c
#include <stdlib.h>
void free(void *ptr);
void *malloc(size_t size);
void *realloc(void *ptr, size_t size);
```

- La fonction **malloc()** alloue `size` octets de mémoire et retourne un pointeur vers cette mémoire allouée.
- La fonction **realloc()** tente de changer la taille de l’allocation pointée par `ptr` à `size`, et retourne `ptr`.
    
    Si l’espace n’est pas suffisant pour agrandir l’allocation, `realloc()` crée une nouvelle allocation, copie autant de données que possible depuis `ptr` vers la nouvelle zone, libère l’ancienne allocation, et retourne un pointeur vers la mémoire nouvellement allouée.
    
- La fonction **free()** désalloue la mémoire pointée par `ptr`. Si `ptr` est `NULL`, aucune opération n’est effectuée.
- En cas d’erreur, **malloc()** et **realloc()** doivent retourner un pointeur `NULL`.
- Vous devez utiliser uniquement les appels systèmes **mmap(2)** et **munmap(2)** pour réclamer ou libérer de la mémoire au système.
- Vous devez gérer vos propres allocations internes sans utiliser le **malloc** de la libc.
- Pour des raisons de performances, vous devez limiter le nombre d’appels à **mmap()** et **munmap()**. Vous devez donc **pré-allouer** certaines zones mémoire pour stocker vos allocations **petites** et **moyennes**.
- La taille de ces zones doit être un multiple de `getpagesize()` sous OSX ou `sysconf(_SC_PAGESIZE)` sous Linux.
- Chaque zone doit contenir au minimum **100 allocations** :
    - Les allocations **TINY** (de 1 à *n* octets) seront stockées dans des zones de *N* octets.
    - Les allocations **SMALL** (de *n+1* à *m* octets) seront stockées dans des zones de *M* octets.
    - Les allocations **LARGE** (*m+1* octets et plus) seront allouées hors des zones, c’est-à-dire directement avec **mmap()**, chacune dans sa propre zone.
    
- C’est à vous de définir les valeurs de **n, m, N, M** pour trouver un bon compromis entre **vitesse** (réduction des appels système) et **économie de mémoire**.

Vous devez également écrire une fonction permettant de visualiser l’état des zones mémoire allouées. Elle doit être prototypée ainsi :

```c
void show_alloc_mem();
```

L’affichage doit être trié par adresses croissantes, avec le format suivant :

```c
TINY : 0xA0000
0xA0020 - 0xA004A : 42 bytes
0xA006A - 0xA00BE : 84 bytes
SMALL : 0xAD000
0xAD020 - 0xADEAD : 3725 bytes
LARGE : 0xB0000
0xB0020 - 0xBBEEF : 48847 bytes
Total : 52698 bytes
```

Vous devez également **aligner la mémoire** donnée par votre malloc.

### Partie Bonus

Voici le premier bonus de ce sujet :

- Gérez l'utilisation de votre malloc dans un programme multithread (afin d'être « thread safe » en utilisant la bibliothèque pthread).

Afin d'obtenir le score maximum, vous devez implémenter certaines fonctions supplémentaires (liste non exhaustive) telles que :

- Gérez les variables d'environnement de débogage malloc. Vous pouvez imiter celles du système malloc ou inventer les vôtres.
- Créer une fonction show_alloc_mem_ex() qui affiche plus de détails, par exemple, un historique des allocations ou un vidage hexadécimal des zones allouées.
- « Défragmenter » la mémoire libérée.