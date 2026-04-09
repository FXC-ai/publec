# Show_alloc_mem

La fonction show_alloc_mem() est un outil de diagnostic permettant de visualiser l’état actuel des zones mémoire gérées par notre malloc. Elle affiche toutes les allocations en cours, triées par adresses croissantes, et indique la taille de chaque bloc ainsi que le total alloué. Son prototype est :

```c
void show_alloc_mem(void);
```

L’objectif de `show_alloc_mem()` est de parcourir **toutes les heaps (TINY, SMALL, LARGE)** et d’afficher ceci dans le terminal :

```bash
TINY : 0xA0000
0xA0020 - 0xA004A : 42 bytes
0xA006A - 0xA00BE : 84 bytes
SMALL : 0xAD000
0xAD020 - 0xADEAD : 3725 bytes
LARGE : 0xB0000
0xB0020 - 0xBBEEF : 48847 bytes
Total : 52698 bytes
```

### Etapes du fonctionnement

1. La fonction commence par parcourir la **liste globale des heaps**, depuis la heap TINY jusqu’à la dernière heap LARGE.
2. Pour chaque heap :
    - On affiche son **type** et son **adresse de base**.
    - On parcourt la **liste chaînée de blocs** associée.
    - On affiche uniquement les **blocs non libres (`is_free == FALSE`)**.
3. Une variable interne maintient un **compteur global** de la mémoire utilisée.
4. À la fin, la somme totale est affichée à la ligne `Total : ... bytes`.

### Structure du code

![SchemaSAM.png](/projets/ft_malloc/tutoriel/assets/SchemaSAM.png)

