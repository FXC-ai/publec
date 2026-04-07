# PARTIE I : Résolution empirique

```python
import random
import string
import math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
%matplotlib inline
```

```python
#Commençons par ecrire un script Python qui simule nos tirages de billes aléatoire :

random.seed(4)
list_nbr_tirage = list()
int_nbr_collectionneurs = 10000

#Cette boucle a pour but de simuler un grand nombre d'experience
#Ici, il s'agit 1000 collectionneurs qui vont faire des courses jusqu'à ce qu'ils aient toutes les billes
for _ in range(int_nbr_collectionneurs):
    
    #Liste des différentes billes disponibles, chaque bille possède une lettre qui la différencie (de A à T)
    billes = list(string.ascii_uppercase)[0:20]
    
    #Liste des billes non tirées par le collectionneur :
    check = list(string.ascii_uppercase)[0:20]
    
    #Liste de l'historique des billes tirées par le collectionneur
    tirage = list()
    
    #Cette boucle simule les tirages d'un seul colectionneur
    while len(check) != 0 :
        
        new_bille = random.choice(billes)
        
        if new_bille in check :
            check.remove(new_bille)
        
        tirage.append(new_bille)
        
    #On sauvegarde dans cette liste le nombre de tirage nécessaire pour chaque collectionneur 
    list_nbr_tirage.append(len(tirage))
    df_nbr_tirage = pd.DataFrame(list_nbr_tirage, columns = ['nbr tirage'])
```

```python
df_nbr_tirage.head(10)
#En obervant les 10 premières expèriences, nous constatons :
#     - que le collectionneur le plus chanceux obtient toutes les billes pour 1000 CHf d'achât (50*20CHf)
#     - que le moins chaceux a dû debourser 2340 CHf (117 * 20CHf) 
#Sur les 10000 collectionneurs, il est nécesssaire d'effectuer en moyenne 72 tirages pour obtenir toutes les billes
#C'est à dire dépenser 72*20 = 1440 CHf en moyenne
meanEmp = df_nbr_tirage['nbr tirage'].mean()
meanEmp
```

Résultat :
```
72.0168
```

```python
#Voici les maximum et minimum sur les 1000 collectionneurs, il y a beaucoup de disparité entre les collectionneurs
maxi = df_nbr_tirage.max()
mini = df_nbr_tirage.min()

print(int(maxi), 'tirages')
print('Soit', int(maxi)*20, 'CHf dépensés')

print(int(mini), 'tirages')
print('Soit', int(mini)*20, 'CHf dépensés')
```
Résultats :
```
267 tirages
Soit 5340 CHf dépensés
25 tirages
Soit 500 CHf dépensés
```

```python
#La variance est très elevée, il y a beaucoup de dispersion autour de la moyenne.
varianceEmp = df_nbr_tirage['nbr tirage'].var()
print('Variance = ', math.ceil(varianceEmp))
ecartTypeEmp = math.sqrt(varianceEmp)
print('Ecart-Type = ', math.ceil(ecartTypeEmp))
```

Résultats :
```
Variance =  572
Ecart-Type =  24
```

```python
#Répartition des collectionneurs selon le nombre de tirages
df_nbr_tirage['nbr tirage'].hist(bins=60, figsize=(12,6))
plt.title('Répartition des collectionneurs selon le nombre de tirages')
```

![Répartition des collectionneurs selon le nombre de tirages](/projets/collectionneur_vignettes/assets/RepartitionCollectionneurNbrTirage.png)

```python
#Densité des collectionneurs selon le nombre de tirage
df_nbr_tirage['nbr tirage'].plot.density(figsize = (12,6))
plt.title('Densité des collectionneurs selon le nombre de tirages')
```

![Densité des collectionneurs selon le nombre de tirages](/projets/collectionneur_vignettes/assets/DensiteCollectionneurNbrTirage.png)
