# BONUS : Rendre malloc thread-safe

Contrairement à des processus distincts (qui ont chacun leur propre espace mémoire), les threads d’un même processus partagent la même heap.
Cela signifie que si le thread A modifie la liste des blocs (par exemple en allouant un bloc),  et que thread B fait de même au même moment, leurs modifications risquent d’entrer en collision, ce qui peut entraîner une corruption totale du tas. Pour éviter ce problème, on entoure nos fonctions par un verrou (`pthread_mutex_t`). Ce verrou garantit qu’un seul thread à la fois peut manipuler la structure de la heap.

### Exemple de corruption du tas d’un malloc non thread-safe

Voici un exemple

Voici ce que l’on peut obtenir :

```c
#include <pthread.h>
#include "inc/malloc.h"

void *routine(void *value)
{    
	size_t v = *((size_t *)value);    
	void *ptr = malloc(12);    
	ft_putstr_fd("routine = ",1);    
	ft_putnb_hex((uintptr_t) ptr);    
	ft_putstr_fd(" ",1);    
	ft_putsize_t(v);    
	write(1, "\n", 1);    
	return ptr;
}
int main()
{    
	pthread_t   tid1;    
	pthread_t   tid2;
	
	size_t  thread_1;    
	size_t  thread_2;
	    
	thread_1 = 1;    
	thread_2 = 2;
	    
	pthread_create(&tid1, NULL, routine, &thread_1);    
	pthread_create(&tid2, NULL, routine, &thread_2);
	    
	pthread_join(tid1, NULL);    pthread_join(tid2, NULL);
	    
	show_alloc_mem();
	    
	return 0;
}
```

```bash
routine = routine = 0x0x7733447755996689f8005500  21

TINY : 0x734759698000
0x734759698050 - 0x734759698060 : 16 bytes (FALSE)
TINY : 0x73475968f000
0x73475968f050 - 0x73475968f060 : 16 bytes (FALSE)
Total : 32 bytes
```

On observe que 2 heap ont été créées ! Alors qu’une seule et même heap permettait de stocker les 2 blocks mémoires demandés. Les règles fixées au départ sont violées. 

### La solution

Pour régler ce problème nous allons utiliser la seconde variable globale autorisée par le sujet. Cette variable contient un mutex qui sera lock au début de l‘exécution des fonction malloc, free et show_alloc_mem. ou realloc. Pour l’initialisation de cette variable, j’utilise la macro PTHREAD_MUTEX_INITIALIZER. Ainsi, même si plusieurs threads appellent `malloc` simultanément, leurs exécutions seront **séquentielles** à l’intérieur de la section critique.

Voici la sécurisation de la fonction malloc dans le code :

```c
void *malloc (size_t size)
{    
		pthread_mutex_lock(&mt_protect);         // Lock du mutex
		void *ptr = execute_malloc(size);        // Execution de l'algorithme malloc
    pthread_mutex_unlock(&mt_protect);       // Unlock du mutex
		return ptr;                              // return du pointeur 
}
```

### Pourquoi utiliser PTHREAD_MUTEX_INITIALIZER au lieu de pthread_mutex_init ?

La macro `PTHREAD_MUTEX_INITIALIZER` permet d’initialiser **statiquement** un mutex global au moment du chargement du programme. Cela évite d’avoir à appeler explicitement `pthread_mutex_init()` lors du premier appel à `malloc`.

Cette méthode est :

- **plus simple** (aucune initialisation dynamique à gérer),
- **plus sûre** (pas de risque d’initialisation multiple par différents threads),
- et **immédiatement prête à l’emploi** dès le chargement de la bibliothèque `.so`.

### Pourquoi le mutex n’est jamais détruit ?

Dans un programme standard, on détruit un mutex avec `pthread_mutex_destroy()` à la fin. Cependant, dans une bibliothèque comme notre `malloc`, il est **dangereux** de le faire :

- Le système ou la libc peuvent encore appeler `malloc` pendant la phase de sortie du programme (via des destructeurs ou `atexit()`).
- Si le mutex est détruit trop tôt, tout appel ultérieur à `malloc` provoquerait un **comportement indéfini**.

C’est pourquoi notre implémentation **ne détruit jamais explicitement le mutex,** le système d’exploitation s’en charge automatiquement à la fin du processus.

### Pourquoi avoir recodé calloc() ?

Lors des tests en contexte **multithread**, j’ai constaté que certaines fonctions de la bibliothèque **pthread** (par exemple `pthread_create()`) utilisaient **`calloc()`** en interne, plutôt que `malloc()`.

Cela posait un problème même en chargeant notre bibliothèque via `export LD_LIBRARY_PATH=$PWD` et `export LD_PRELOAD=$PWD/libft_malloc.so` .

les appels à `calloc()` n’étaient **pas redirigés** vers notre implémentation, mais continuaient à utiliser **le `calloc` du système**.

En effet, la fonction `calloc()` de la libc ne fait pas toujours appel à `malloc()` en interne ou le fait autrement qu’avec le symbole `malloc(size)`. Sur certaines plateformes, elle peut utiliser des **mécanismes internes** de la libc, non interceptés par le `LD_PRELOAD`. Du coup les threads créés via `pthread_create()` appelaient le `calloc()` système au lieu du nôtre, contournant complètement notre gestion mémoire.
