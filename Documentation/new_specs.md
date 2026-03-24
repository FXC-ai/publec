# Portfolio laboratoire développeur publec.ch

Le but de ce projet est de pouvoir tester et partager rapidement n'importe quelle stack technique. L'idée générale est d'avoir un site qui permet de tester différents backends et éventuellement différents frontends. Un serveur NginX faisant office de Reverse proxy permet de router vers différents frontends

## Architecture DevOps avec Docker

L'architecture de la première version serait composée de containers :
* Un container NginX qui se charge de router vers les différents frontends
* Un container Next.js par défaut qui servira les pages du site
* Un container FastApi qui communiquera avec la base de données
* Un container Java avec SpringBoot qui se chargera de faire tourner le projet AvajLauncher


## Les pages du site V1

### Page d'accueil :
La page d'accueil serait une page de présentation du site basique et présenterait la liste des projets accessibles sous forme de cartes, ainsi qu'un lien vers la page contact.
Elle contiendrait un texte de type :
> Bienvenue dans mon laboratoire ! Ce site est espace d'expérimentations. Vous y trouverez pleins de mini projets dont le but est d'apprendre et de montrer le fonctionnement de différentes technologies. Le but est d'explorer afin de découvrir comment fonctionne quelques unes des milliers de technologies qui existent aujourd'hui.

Chaque carte contiendrait :
* une petite image,
* le titre du projet,
* une courte description du projet,
* un lien vers le repo github qui contient le code du projet,
* un lien vers une page tutoriel qui contiendrait un tuto pour aider les autres élèves à faire le projet,
* et parfois un lien qui mène à une page qui permet de tester le projet directement en ligne.

### Page tutoriels
Pour ce qui est des la page tuto, parfois les tutoriaux sont très très longs (20 à 40 pages) il faudrait donc présenter un seul chapitre à la fois avec un menu sur la gauche qui apparaîtrait et permettrait de naviguer à travers le tutoriel pour aller d'un chapitre à l'autre. En fait tout ce passerait comme si chaque chapitre etait un article de blog à part. En haut de la page tutoriel se trouve un lien "testez le projet en ligne" qui renvoit vers la page projet.

Les pages de tutoriels seront générées automatiquement : la seule action à faire de la part du développeur sera d'ajouter une entrée dans la table projet et d'ajouter un dossier dans l'arborescence qui contiendra tous les mdx pour créer le tuto.

### Page de tests des projets
C'est pour ces pages de test que je vais tester différentes stacks ! Et c'est pour ces pages de test que je vais avoir besoin de backends différents. Les différents projets seront wrappés par des frameworks différents à chaque fois.

### Contact :
Pour la page contact on y retrouvera mon CV. La page serait entièrement statique.


## Base de données

Table Projets :
- id : longint
- Nom du projet : String
- Ressource image : String
- Description du projet : String
- Lien vers la page de test : String
- Lien vers la page projet : String
- Lien vers le repo gitub : String
- ligne created_at : date
- updated_at : date


## Les améliorations à faire quand la V1 sera en ligne

### Ajouter les tutos de tous les projets 42 déjà écrits

Common core :
* libft : uniquement un tuto
* borntoberoot : tuto
* ft_printf : tuto
* get next line : tuto
* pipex : tuto
* fractol : tuto
* push_swap : tuto
* minishell : tuto
* philosopher : tuto
* cub3d : tuto
* piscine c++ partie 1 : tuto
* netpractice : tuto
* piscine c++ partie 2 : tuto
* Inception : tuto
* webserv : tuto
* ft_transcendance : tuto

Spécialisation :
* ft_malloc : tuto
* ft_linear_regression : tuto + page de test avec un jupyter notebook embarqué
* avajlauncher : tuto + page de test avec formulaire pour tester le projet

### Ajouter la possibilité de changer la langue du site

###  Page de connexion pour les utilisateurs

La page _se connecter_ permettrait aux utilisateurs de s'identifier selon 5 moyens :
* compte github,
* compte google,
* compte infomaniak
* compte ecole 42
* via un formulaire que je réserve aux amis à qui je ferai un compte spécial.

Les privilèges seront différents en fonction de la manière dont l'utilisateur se sera connecté :
* github, google, infomaniak, ecole 42 : Le fait de s'identifier permettra de pouvoir commenter les articles de blog.
* Pour les comptes de mes amis ils auront accès à certains articles de blog cachés que les autres utilisateurs ne verront pas.

### Ajout des formulaires pour commenter et liker

À la fin de chaque chapitre des tutos on trouverait un formulaire pour commenter le chapitre en cours d'affichage. Même chose à la fin de chaque article de blog.

### Projet de scraping du compendium :

techno en backend : flask et beautiful soup
La page de test permettra de sélectionner un médicament. Le site ira scraper sa monographie et la présentera dans une belle page react.

### Projet de comparaison des langages de programmation à travers des interviews tests

techno en backend : Piston API
Cela se présenterait comme un tuto. La table des matières répertorie tous les code interviews déjà en ligne. Pour chaque code interview il y aurait au minimum 2 solutions proposées dans 2 langages différents. Ces solutions seraient modifiables par l'utilisateur. Quand il envoie sa propre solution une batterie de tests est faite pour s'assurer que la solution est ok. Outre la solution qui serait donnée et exécutable des explications s'accompagneraient de la solution.

### Mettre le rustling en ligne

techno backend : axum
La page du projet posséderait en haut un classement des meilleurs speed runners. L'utilisateur pourrait cliquer sur "lancer rustling" il devrait faire et réussir tous les exercices du rustling jusqu'au bout. Si il y parvient il a son nom qui s'affiche dans le classement des meilleurs speedrunners


### Projet de recherche automatisée d'information pour préparer une sortie ski de rando :

techno en backend : Laravel (API REST)

L'utilisateur entre le nom d'une rando. Laravel lance les 5 appels en parallèle, assemble les résultats et les renvoie en JSON à Next.js. Mise en cache des réponses (Laravel Cache) pour éviter de re-scraper à chaque requête.

* CamptoCamp : topoguide de la rando (scraping)
* SkiTour : topoguide alternatif (scraping)
* MétéoSuisse : dernier BRA (Bulletin de Risque d'Avalanche) du secteur
* OpenMeteo : météo détaillée du secteur (API gratuite, pas de clé requise)
* YouTube Data API : vidéos présentant la rando

### Page de test pour ft_malloc

techno en backend : fast api avec subprocess et d3.js en front
L'idée est d'offrir la possibilité de tester malloc, realloc et free en renvoyant un schéma de la mémoire après la séquence de malloc, free et realloc qu'il a demandé

### DevOps

techno : github actions et watchover
À terme le but serait que le site se mette à jour automatiquement grâce à la surveillance d'un repo (ou un compte ??) github. Je n'ai plus qu'à ajouter du code et du contenu sur le repo et le site le met en ligne automatiquement en créant si nécessaire de nouveaux containers.

### Mettre en place des tests automatisés pour vérifier que le site fonctionne

## Todo list pour mener le projet

* Obtenir un VPS gratuit auprès d'infomaniak
* Préparer l'architecture de Docker avec docker compose
* Mettre en ligne une page d'accueil
* Apprendre le java
* Terminer et valider le projet AvajLauncher
* Apprendre SpringBoot
* Développer un frontend adapté à avajLauncher
* Mettre en ligne avajLauncher
