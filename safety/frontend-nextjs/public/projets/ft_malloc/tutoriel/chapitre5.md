# Pour aller plus loin…

## malloc de Doug Lea

 Parmi les nombreuses implémentations existantes de `malloc`, celle de **Doug Lea** (aussi connue sous le nom de **dlmalloc**) est l’une des plus célèbres.

Elle repose sur un système de **chunks** (blocs mémoire) organisés en listes chaînées distinctes selon leur état :

- une liste pour les blocs **libres :**
    
    ![Screenshot 2024-07-12 at 14-31-07 Microsoft PowerPoint - 04 Dynamic Memory v6.ppt Compatibility Mode - 04_dynamic_memory_v6.pdf.png](/projets/ft_malloc/tutoriel/tutoriel/assets/e13e6898-a8e1-48eb-8bb3-7de137866517.png)
    
- une autre pour les blocs **occupés :**
    
    ![Screenshot 2024-07-12 at 14-30-06 Microsoft PowerPoint - 04 Dynamic Memory v6.ppt Compatibility Mode - 04_dynamic_memory_v6.pdf.png](/projets/ft_malloc/tutoriel/tutoriel/assets/b820f102-1eba-443a-836a-f9775bc038bf.png)
    

Ce modèle permet une recherche de bloc libre **plus rapide** grâce à des structures adaptées (bins triés par taille, par exemple). C’est une source précieuse pour comprendre comment la gestion mémoire est optimisée dans les implémentations réelles du `malloc` système.

## vmap

Pour observer concrètement comment un programme utilise la mémoire, la commande `vmmap` (ou `cat /proc/<pid>/maps` sous Linux) est extrêmement utile.

Considérons le code suivant :

```c
#include <stdio.h>
#include <sys/mman.h>

int main()
{
	printf("PID = %d\n", getpid());
	while (1)
	{}
	return 0;
}
```

Si je lance la commande `vmap <PID>`, voilà le résultat :

Il y plusieurs sections qui permettent de résumer l’utilisation de la mémoire par notre exécutable a.out :

```bash
Process:         a.out [15905]
Path:            /Users/USER/Documents/*/a.out
**Load Address:    0x103be5000**
Identifier:      a.out
Version:         ???
Code Type:       X86-64
Platform:        macOS
Parent Process:  zsh [5305]

Date/Time:       2024-07-06 15:09:07.340 +0200
Launch Time:     2024-07-06 15:08:56.432 +0200
OS Version:      macOS 12.7.2 (21G1974)
Report Version:  7
Analysis Tool:   /usr/bin/vmmap

Physical footprint:         316K
Physical footprint (peak):  316K
```

- `Load Address` correspond à l’adresse de l’espace virtuel à partir de laquelle se charge le processus. Le reste est assez explicit.
- La section `==== Non-writable regions for process 15905` est utilisée par l’OS pour l’execution du code.
- Le segement __TEXT contient les instructions machines compilées exécutées par le CPU. Ces données peuvent être lues et éxécutées.
- Le segment __DATA_CONST : c’est ici que sont stockées les variables constantes développées dans le programme. Elle ne peuvent que lu, jamais éxécuté ni modifié.
- Le __LINKEDIT segment : ces information sont utilisés par le linker (?)
