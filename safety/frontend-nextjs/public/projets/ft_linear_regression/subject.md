# Partie obligatoire

Vous allez mettre en œuvre une régression linéaire simple avec une seule caractéristique - dans ce cas, le kilométrage de la voiture.

Pour ce faire, vous devez créer deux programmes :

- Le premier programme sera utilisé pour prédire le prix d'une voiture pour un kilométrage donné. Lorsque vous lancez le programme, il doit vous demander un kilométrage, puis vous donner le prix estimé pour ce kilométrage. Le programme utilisera l'hypothèse suivante pour prédire le prix :

$$
estimatePrice(mileage) = \theta_0 + (\theta_1 * mileage)
$$

Avant l'exécution du programme d'entraînement, theta0 et theta1 seront mis à 0.

- Le second programme sera utilisé pour entraîner votre modèle. Il lira votre fichier de données et effectue une régression linéaire sur les données. Une fois la régression linéaire terminée, vous enregistrerez les variables theta0 et theta1 pour les utiliser dans le premier programme.
Vous utiliserez les formules suivantes :

$$
tmp\theta_0 = learningRate * \frac{1}{m} * \sum\limits_{i=0}^{m-1}estimate(mileage[i]) - price[i]
$$

$$
tmp\theta_1 = learningRate * \frac{1}{m} * \sum\limits_{i=0}^{m-1}(estimate(mileage[i]) - price[i]) * mileage[i]
$$

Je vous laisse deviner la valeur de m :) Notez que l'estimatePrice est la même que dans notre premier programme, mais ici elle utilise votre theta0 et theta1 temporaires, calculés en dernier. N'oubliez pas non plus de mettre à jour simultanément theta0 et theta1.

# Bonus

Voici quelques bonus qui pourraient s'avérer très utiles :

- Tracer les données sur un graphique pour voir leur répartition.
- Tracer la droite résultant de votre régression linéaire sur le même graphique, pour voir le résultat de votre travail !
- Un programme qui calcule la précision de votre algorithme.
