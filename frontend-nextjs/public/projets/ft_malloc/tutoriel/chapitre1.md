# Comment fonctionnent malloc, free et realloc?

## Malloc

```c
void *malloc (size_t size)
```

### La gestion des heap

La gestion de la heap repose sur l’utilisation de listes chaînées. Chaque heap (zone mémoire allouée via mmap) est reliée à la précédente et à la suivante par une liste doublement chaînée, décrite par la structure suivante :

```c
typedef struct s_heap
{
    struct s_heap   *prev;
		struct s_heap   *next;
    t_heap_group    group;
		size_t          total_size;    // Taille totale de la heap    
		size_t          free_size;     // Espace de la heap qui n'appartient à aucun block (free ou pas !)    
		size_t          block_count;   // Nombre de block dans la heap
}
```

Cette structure prend 48 octets en mémoire. Chaque structure `t_heap` est placée **au tout début de la zone mémoire** obtenue par `mmap`.

Juste après cette structure se trouvent les métadonnées du **premier block** :

```c
typedef struct s_block
{    
		struct s_block  *prev;    
		struct s_block  *next;
		size_t          data_size;     // Taille des données que dois pouvoir contenir le block
		t_bool          is_free;       // FALSE : block alloué / TRUE : block non alloué
}               t_block;
```

Chaque heap contient donc une **liste chaînée de blocks**, où chaque block représente une zone allouée ou libérée à l’intérieur de cette heap. Cette structure a une taille de 32 octets.

Voici un schéma représentatif de la structure de notre heap :

![schemaGeneral.png](/projets/ft_malloc/tutoriel/assets/schemaGeneral.png)

Chaque heap contient donc une **liste chaînée de blocks**, où chaque block représente une zone allouée ou libérée à l’intérieur de cette heap.

Les heaps sont classées en trois catégories, selon la taille des allocations qu’elles contiennent :

- TINY : pour les blocks de 1 à 128 octets
- SMALL : pour les blocks de 129 à 1024 octets
- LARGE : pour les blocks de plus de 1024 octets

Les heaps TINY et SMALL sont pré-allouées et peuvent contenir plusieurs blocks, tandis que chaque heap LARGE est allouée séparément, directement via mmap, pour une seule demande.

### Etapes du fonctionnement

Lorsqu’un appel à `malloc(size)` est effectué :

1. On détermine le **type de heap** (TINY, SMALL ou LARGE) en fonction de la taille demandée.
2. On recherche une heap existante correspondant à ce type.
3. Dans cette heap, on cherche un **block libre** suffisamment grand.
4. Si aucun block libre n’est trouvé mais qu’il reste de la place dans la heap, on crée un **nouveau block** à la fin.
5. Si la heap n’a plus d’espace disponible, on **crée une nouvelle heap** via `mmap` et on y place le block.

### Schéma du fonctionnement

![AlgoMallocJterraz.png](/projets/ft_malloc/tutoriel/assets/AlgoMallocJterraz.png)

### Structure du code

![ScemaMalloc.png](/projets/ft_malloc/tutoriel/assets/ScemaMalloc.png)

### Cas particulier : malloc(0)

Le comportement standard de malloc(0) dépend des implémentations, mais la plupart retournent un pointeur unique et non nul, qui ne peut pas être utilisé pour accéder à la mémoire. Dans notre implémentation, pour simplifier la gestion interne, malloc(0) retourne simplement NULL, indiquant qu’aucune allocation n’a été effectuée.

### Le cas particulier de l’allocation LARGE :

Lorsqu’une demande dépasse la borne SMALL (dans ton design, > 1024 octets), l’allocation est traitée comme LARGE. Dans ce cas :

- On crée une nouvelle heap dédiée via mmap (une zone indépendante, non partagée avec TINY/SMALL).
- La taille réellement mappée est arrondie au multiple de la taille de page (souvent 4096 octets), conformément à getpagesize()/sysconf(_SC_PAGESIZE).
- La zone contient, dans cet ordre :
    1. les métadonnées de heap (t_heap),
    2. les métadonnées de block (t_block),
    3. la zone utilisateur (taille demandée alignée au multiple de 16 supérieur)

Important : on demande à mmap la taille sizeof(t_heap) + sizeof(t_block) + align(size, 16), puis on arrondit à la page. On n’expose que size (alignée) à l’utilisateur ; le surplus dû à l’arrondi n’est pas de la mémoire utilisable par l’appelant (même si elle est mappée dans la heap).

Exemple (illustratif) :

- size = 1025 octets → align(1025, 16) = 1040 octets
- Les métadonnées : sizeof(t_heap) + sizeof(t_block) = 80 octets
- Taille brute demandée : 80 + 1040 = 1120 → arrondi à 4096 (si page = 4096)
- Mémoire utilisable par l’utilisateur : 1040 octets (pas 4096 − 80). Le reste de la page est du padding interne propre à cette heap LARGE.

Il reste pas 4016 octets dont 1040 sont pour l’utilisateur. L’utilisateur ne doit utiliser que la taille demandée (arrondie à l’alignement), ici 1040. Le surplus vient de l’arrondi par pages et reste interne (pas garanti stable ni réutilisé dans une LARGE).

Sécurité mémoire

- Accéder au-delà de data_size (alignée) est un comportement indéfini pour l’utilisateur, même si la page mappée est plus grande.
- Accéder au-delà de la zone mappée provoque typiquement une segmentation fault : le noyau interdit l’accès hors des limites mmap.

### L’alignement mémoire

L’alignement mémoire est un aspect essentiel de toute implémentation de malloc, car il garantit que les adresses retournées sont compatibles avec l’architecture du processeur et les types de données manipulés.

Pourquoi aligner la mémoire ?

Sur la plupart des architectures modernes, certaines instructions exigent que les données soient alignées sur une frontière spécifique (par exemple, 8 ou 16 octets). Une adresse mal alignée peut provoquer un ralentissement matériel, voire un crash sur certaines plateformes.

Principe appliqué

Dans notre implémentation, toute allocation est arrondie au multiple de 16 supérieur à la taille demandée.
Cela signifie que si un utilisateur demande 37 octets, le bloc alloué fera en réalité :

```c
# define BLOCK_MIN_SIZE 16
size_alloc = round_nearest_multiple(size, BLOCK_MIN_SIZE);
```

Ainsi, **tous les blocs** renvoyés par `malloc` commencent sur une **adresse multiple de 16**, ce qui garantit un alignement correct pour tout type de donnée

Exemple concret :

| Taille demandée | Taille alignée | Adresse retournée (exemple) |
| --- | --- | --- |
| 4 octets | 16 octets | 0x1000 |
| 37 octets | 48 octets | 0x1030 |
| 129 octets | 144 octets | 0x10C0 |

Cet arrondi a deux avantages :

1. Il **simplifie** la gestion des blocs en garantissant que chaque structure commence à une adresse alignée.
2. Il **évite les fautes d’alignement** (undefined behavior) lorsque l’utilisateur cast un pointeur `void*` vers n’importe quel autre type.

L’inconvénient est un léger **gaspillage mémoire** pour les petites allocations, mais il est largement compensé par la sécurité et la stabilité du système.

## Free

La fonction free() est chargée de libérer un bloc de mémoire précédemment alloué par malloc() ou realloc(). Son rôle est de marquer ce bloc comme disponible à la réutilisation, et, si possible, de fusionner les zones libres adjacentes pour éviter la fragmentation. Voici son prototype :

```c
void free(void *ptr)
```

### Etapes du fonctionnement

1. **Cas particulier : `free(NULL)`  :** Si le pointeur passé à `free()` est `NULL`, la fonction ne fait rien. Ce comportement simplifie l’usage de `free`.
2. **Vérification du pointeur :** On s’assure que le pointeur correspond bien à un bloc appartenant à l’une de nos heaps internes. Si ce n’est pas le cas (pointeur corrompu ou double free), aucune opération n’est effectuée.
3. **Libération du bloc :** Le champ `is_free` du bloc est mis à `TRUE`, indiquant qu’il est désormais libre.
4. **Fusion des blocs adjacents libres :** Si les blocs voisins (précédent ou suivant) sont également libres, ils sont **fusionnés** en un seul bloc plus grand. Cette étape limite la **fragmentation interne**, c’est-à-dire la perte d’espace due à de multiples petits blocs libres.
5. **Nettoyage de la heap**
    - Si le bloc libéré est le **dernier de sa heap**, il est supprimé.
    - Si la heap devient complètement vide (tous ses blocs sont libres), elle est **désallouée intégralement** via `munmap()`.

> ATTENTION !!! Dans le code, la heap n’est PAS supprimée lorsqu’elle est vide ! Il ne faut supprimer les heaps que lorsque getrlimit est atteint ! J’ai négligé ce point lors du projet. C’est une erreur à ne pas reproduire !
> 

### Schéma du fonctionnement

### Structure du code

## Realloc :

La fonction realloc() permet de modifier la taille d’un bloc de mémoire déjà alloué. Dans cette implémentation, son comportement est volontairement simplifié, tout en restant conforme à la spécification standard. Elle ne tente pas de redimensionner le bloc « en place » : lorsqu’une nouvelle taille est demandée, elle effectue une nouvelle allocation, copie les données, puis libère l’ancienne zone.

Son prototype est :

```c
void *realloc(void *ptr, size_t size);
```

### Étapes du fonctionnement

- **Cas `ptr == NULL`** : Si le pointeur est nul, l’appel est équivalent à : `malloc(size)`;
- **Cas `size == 0` et `ptr != NUL`**: Dans ce cas, le bloc est libéré. L’appel est équivalent à `free(ptr)`;
- **Cas général (redimensionnement)**
    - Si la nouvelle taille est **identique** à l’ancienne, aucune opération n’est effectuée : la fonction renvoie simplement le **même pointeur**.
    - Si la nouvelle taille est **différente** (plus grande ou plus petite) :
        - Un **nouveau bloc** est alloué avec `malloc(size)`
        - Le contenu de l’ancien bloc est **copié** dans la nouvelle zone (jusqu’à la plus petite des deux tailles)
        - L’ancien bloc est **libéré** avec `free(ptr)`
        - Le **nouveau pointeur** est retourné

### Avantages et limites

✅ **Avantages :**

- Implémentation claire et robuste
- Respect du comportement attendu de `realloc()`
- Réduit les risques d’erreurs complexes sur la heap

⚠️ **Limites :**

- Ne tente pas d’agrandir ou de réduire le bloc « en place »
- Entraîne une **nouvelle allocation** et une **copie mémoire** à chaque redimensionnement
- Moins efficace pour des réallocations fréquentes ou sur de gros volumes de données

### Schéma du fonctionnement

### Structure du code
