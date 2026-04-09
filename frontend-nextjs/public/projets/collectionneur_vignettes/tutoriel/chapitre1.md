# PARTIE II : Résolution mathématique

## Quelques prérequis indispensables

### A propos des suites géométriques

Suite géométrique définie par relation de récurence :

$$\left\{\begin{array}{ll} u_{n+1}=q\times u_{n}, & n \in \mathbb{N}\\ u_{0}=a \end{array}\right.$$

Suite géométrique définie en fonction de n : $u_{n}=u_{0}\times q^n = a\times q^n$

#### Somme des termes d'une suite géométrique

Il est important d'avoir en tête, la formule suivante :
${\displaystyle S_{n}=\sum _{0\leq k\leq n}a\times q^{k}=a\,{\frac {1-q^{n+1}}{1-q}}}$.

##### Démonstration

Il existe plusieurs manières de démontrer ce résultat, en voici une. Considérons les 2 égalités suivantes :

- ${S}_n = a + aq + aq^2 + ... + aq^{n-1} + aq^n$
- $q{S}_n = aq + aq^2 + ... + aq^{n-1} + aq^n + aq^{n+1}$

On les soustrait l'une avec l'autre :

${S}_n - q{S}_n = a - (aq - aq) - (aq^2 - aq^2) - ... - (aq^{n-1} - aq^{n-1}) - (aq^n - aq^n) - aq^{n+1}$

On obtient donc : ${\displaystyle \left(1-q\right)S_{n}=a\left(1-q^{n+1}\right)}$, c'est à dire ${\displaystyle S_{n}=a\,{\cfrac {1-q^{n+1}}{1-q}}}$

## A propos de la loi géométrique

C'est une loi de probabilité discrète définie telle que : ${\displaystyle {P} (X=k)=q^{k-1}p}$

La probabilité que X = k correspond à la probabilité d'obtenir k-1 echecs et 1 succès sur un ensemble de k épreuves de Bernoulli indépendantes avec :

- $k \in \mathbb{N}$
- q : probabilité d'obtenir un echec
- p : probabilité d'obtenir un succès tel que $p = 1- q$

### Espérance de la loi géométrique

L'espérance de la loi géométrique est donnée par la formule : ${\displaystyle{E} [X]= \frac {1}{p}}$.

#### Démonstration

Nous avons démontré plus haut que ${\displaystyle \sum _{k=0}^{k=n}q^{k}=\,{\frac {1-q^{n+1}}{1-q}}}$ or pour ${\displaystyle 0<q<1}$, ${\displaystyle \lim_{n \to +\infty} \frac {1-q^{n+1}}{1-q} = \frac {1}{1-q}}$, ainsi ${\displaystyle \sum _{k=0}^{+\infty }q^{k} = \frac {1}{1-q}}$.

Soit ${\displaystyle f(k) = \sum _{k=0}^{+\infty }q^{k} = \frac {1}{1-q}}$.
La dérivée de f est ${\displaystyle f'(k) = \sum _{k=1}^{+\infty }kq^{k-1} = \frac {1}{(1-q)^2}}$.

Soit X, une variable aléatoire discrète suivant une loi géométrique tel que : ${\displaystyle {P} (X=k)=q^{k-1}p}$

Nous avons donc ${\displaystyle{E} (X)=\sum _{k=1}^{+\infty }kq^{k-1}p = f'(k)\times p = \frac {p}{(1-q)^2} = \frac {p}{p^2} = \frac {1}{p}}$.

### Variance de la loi géométrique

La variance de la loi géométrique est donnée par la formule : ${\displaystyle Var(X) = \frac{q}{p^2}}$

#### Démonstration

Tout d'abord reprenons la dérivée de la fonction f définie plus haut : ${\displaystyle f'(k) = \sum _{k=1}^{+\infty }kq^{k-1} = \frac {1}{(1-q)^2}}$

Nous dérivons f une seconde fois : ${\displaystyle f''(k) = \sum_{k=2}^{+\infty}k(k-1) \times q^{k-2}}$

Soit l'égalité A définie telle que : ${\displaystyle A = q \times f''(k) + f'(k) = \frac{2q}{(1-q)^3} + \frac{1}{(1-q)^2}}$

$$A = q \sum_{k=2}^{+\infty} k(k-1)q^{k-2} + \sum _{k=1}^{+\infty }kq^{k-1}$$

$$A = 2q + 6q^{2} + 12q^{3} + ... +q \times k(k-1)q^{k-2} + ... + q^{0} + 2q + 3q^{2}+4q^{3} + ... + kq^{k-1} + ...$$

$$A = 1 + 4q + 9q^{2} + 16q^{3} + ... + (k(k-1)q^{k-1} + kq^{k-1}) + ...$$

$$A = 1^2q^{1-1} + 2^2q^{2-1} + 3^2q^{3-1} + 4^2q^{4-1} + ... + (k^2 - k + k)\times q^{k-1} + ...$$

$$A = \sum_{k=1}^{+\infty} k^2q^{k-1}$$

On obtient donc ${\displaystyle A = \sum_{k=1}^{+\infty} k^2q^{k-1} = \frac{2q}{(1-q)^3} + \frac{1}{(1-q)^2} = \frac{2}{(1-q)^3} - \frac{1}{(1-q)^2}}$

Selon le théorême de König-Huygens : ${\displaystyle Var(X) = {E}(X^2) - {E}(X)^2}$

Dans notre cas nous avons :

- ${\displaystyle {E}(X^2) = p\times \sum_{k=1}^{+\infty}k^2q^{k-1} = \frac{2p}{(1-q)^3} - \frac{p}{(1-q)^2} = \frac{2p}{p^3} - \frac{p}{p^2} = \frac{2}{p^2} - \frac{1}{p}}$
- ${\displaystyle {E}(X)^2 = \frac{1}{p^2}}$

On a donc ${\displaystyle Var(X) = \frac{2}{p^2} - \frac{1}{p} - \frac{1}{p^2}= \frac{1-p}{p^2} = \frac{q}{p^2}}$

### Fonction de répartition d'une loi géométrique

X suit la loi géométrique de paramètre p. Soit F la fonction de répartition de la variable X. On a alors : ${\displaystyle F(n) = P(X \leq n) = 1 - q^{n}}$

#### Démonstration

Nous savons que ${\displaystyle {P} (X=n)=q^{n-1}p}$, par conséquent :

$$F(n) = {P} (X \leq n)=p \times \sum_{k=1}^{k=n} q^{k-1} = p \times \sum_{k=0}^{k=n-1} q^{k} = p \times \frac {1-q^{n}}{1-q}$$

On sait que ${\displaystyle p = 1-q}$, donc $F(n) = 1-q^{n}$.

```python
class LoiGeometric :
    
    def __init__(self, p):
        self.q = 1 - p
        self.p = p        
    
    def calcEsperance(self):
        self.esperance = 1/self.p
        return self.esperance
    
    def calcVariance(self):
        self.variance = self.q/self.p**2
        return self.variance
    
    def calcEcartType(self):
        self.ecartType = sqrt(self.q)/self.p
        return self.ecartType
        
    def calcProbability(self, k):
        return (self.q**(k-1))*self.p
    
    def calcFctRepartition(self, k):
        return 1 - self.q**k
    
    def calcFctRepartitionReverse(self, pct):
       r= 0
       while self.q**r >= 1-pct :
           r+=0.0001
       return r+1
   
    def reprLoiGeometric (self, kmax):
        x = np.arange(1,kmax)
        y = self.calcProbability(x)
        fig = plt.figure(figsize = (12,6))
        axes1 = fig.add_axes([0.1,0.1,0.9,0.9])
        axes1.scatter(x,y)
        axes1.grid()
        axes1.set_ylabel('Probabilité d\'obtenir une nouvelle bille avec X tirages')
        axes1.set_xlabel('Nbr de tirage')
        axes1.set_title('Loi géométrique avec probabilité {} de succés'.format(self.p))
        
    def reprFctRepartition (self, kmax):
        x = np.arange(1,kmax)
        y = self.calcFctRepartition(x)
        fig = plt.figure(figsize = (12,6))
        axes2 = fig.add_axes([0.1,0.1,0.9,0.9])
        axes2.scatter(x,y)
        axes2.grid()
        axes2.set_ylabel('Probabilité d\'obtenir une nouvelle bille')
        axes2.set_xlabel('Nbr de tirage')
        axes2.set_title('Fct de répartition d\'une loi géométrique avec probabilité {} de succés'.format(self.p))
```

```python
#Exemple de loi géométrique avec p = 2/20. Cela représente le cas où notre collectionneur possède déjà 18 billes
#différentes et essaie d'en obtenir une 19ème.
newLaw = LoiGeometric (2/20)
newLaw.reprLoiGeometric(25)
newLaw.reprFctRepartition(25)
```

![Loi géométrique avec p = 2/20](/projets/collectionneur_vignettes/tutoriel/assets/loigeometrique1.png)

![Fonction de répartition avec p = 2/20](/projets/collectionneur_vignettes/tutoriel/assets/loigeometrique2.png)

## Revenons au problème de notre collection de bille

Soit la variable aléatoire T suivante : ${\displaystyle T_{n}=\sum _{i=1}^{n}t_{i}}$

- **T** : le nombre de tirage avec remise nécessaire pour obtenir toutes les billes. On peut considérer T comme le temps nécessaire pour obtenir toutes les billes en supposant que à chaque pas de temps, on tire une nouvelle bille.
- **n** : le nombre de billes différentes à collectionner. Ici n = 20.
- **$t_{i}$** : temps supplémentaire pour obtenir une i-ème bille sachant que le collectionneur en a déjà i-1. Cela signifie que si le collectionneur possède déjà i-1 billes sur les 20 billes à collectionner alors la probabilité d'en obtenir une nouvelle au tirage suivant est : ${\displaystyle p = \frac {n-(i-1)}{n}}$

$t_{i}$ suit une loi géométrique de paramètre ${\displaystyle p = \frac {n-(i-1)}{n}}$, ainsi nous savons que ${\displaystyle E(t_{i}) = \frac{1}{p}}$

Par linéarité de l'espérance : ${\displaystyle {E} (T_{n})= {E} (t_{1})+ {E} (t_{2})+\cdots + {E} (t_{n}) = \sum_{i = 1}^{n}{E} (t_{i})}$

La solution à notre problème est le résultat du calcul : ${\displaystyle \sum_{i = 1}^{i=20}{E} (t_{i}) = \sum_{i = 1}^{i=20}\frac {n}{n-(i-1)}}$

```python
#La classe collection permet de calculer le nombre de tirage à faire en moyenne pour obtenir toutes les billes
#Elle permet également de calculer la variance sur ce nombre de tirage
class Collection :
    def __init__(self, nbr_billes):
        self.nbr_billes = nbr_billes # le seul parametre de la classe est le nombre de billes à collectionner
        self.list_esperance = list()
        self.list_variance = list()
        self.list_geometricLaws = [LoiGeometric(b/nbr_billes) for b in range(1, nbr_billes + 1)]
    
    def calculEsperance (self):
        esperanceTot = 0
        for law in self.list_geometricLaws :
            e = law.calcEsperance() #objets LoiGeometric stockés dans une liste pour calculer l'esperance
            self.list_esperance.append(e)
            esperanceTot += e            
        
        return esperanceTot
    
    def calculVariance (self):
        varianceTot = 0
        for law in self.list_geometricLaws :
            v = law.calcVariance()
            self.list_variance.append(v)
            varianceTot += v
            
        return varianceTot
```

```python
collection = Collection(20)
mean20 = collection.calculEsperance()
print('Le nombre de tirage moyen nécessaire pour obtenir toutes les billes est {}.'.format(mean20))
print('Empiriquement, nous avions calculés {} tirages pour obtenir les 20 billes.'.format(meanEmp))
```

```
Le nombre de tirage moyen nécessaire pour obtenir toutes les billes est 71.95479314287363.
Empiriquement, nous avions calculés 72.0168 tirages pour obtenir les 20 billes.
```

```python
Var20 = collection.calculVariance()
EcarT20 = math.sqrt(Var20)
print('La variance pour 20 billes est {}, experimentalement nous avions obtenus {}.'.format(Var20,varianceEmp))
print('Pour l\'ecart-type, nous avions obtenus {} experimentalement et nous avonss {} par calcul.'.format(EcarT20, 
                                                                                                    ecartTypeEmp))
```

```
La variance pour 20 billes est 566.5105044223355, experimentalement nous avions obtenus 571.5000677667767.
Pour l'ecart-type, nous avions obtenus 23.801481139255504 experimentalement et nous avonss 23.906067593119047 par calcul.
```

```python
#Pour le plaisir voici le graphique montrant l'évolution du nombre de tirage et de la variance en fonction
# du nombre de billes à collectionner
list_e = list()
list_v = list()
for c in range(1,30) :
    newCollection = Collection(c)
    list_e.append(newCollection.calculEsperance())
    list_v.append(newCollection.calculVariance())

    
df_study = pd.DataFrame(list_e, columns = ['esperance'], index = [_ for _ in range(1,30)])
df_study['variance'] = list_v
df_study.plot(figsize = (16,8), title = 'Variance et Esperance selon le nombre de bille à collectionner')
```

![Variance et Esperance selon le nombre de bille à collectionner](26c5ff3f9eb57106fc46c68343baf79f81dffcfb.png)

```python
#Tableau du nombre de tirage et de la variance selon le nombre de bille à collectionner
df_study
```
