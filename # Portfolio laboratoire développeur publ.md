# Portfolio laboratoire développeur publec.ch

Le but de ce projet est de pouvoir tester et partager rapidement n'importe quelle stack technique. L'idée général est d'avoir un site / blog qui possede des pages de test pour différentes stacks. 

Navigateur
  ↓  POST vers Next.js (via Nginx)
[Next.js server]
  ↓  fetch("http://avaj-backend:8080/run")  ← réseau interne Docker
[SpringBoot]
  ↓  { result: "..." }
[Next.js server]  ← construit le HTML avec le résultat
  ↓  HTML final
Navigateur


## Architecture DevOps avec Docker

L'architecture de la premiere versions serait composées de containers :

           [Container 1 nginx qui sert de reverse proxy]
                             ↓ 
                [Container 2 next.js server]
                    ↓                                     ↓                              ↓
[Container 3 fast api pour les pages du blog]   [container 4 spring boot]   [container JupyterHub] [...] [...]
                     ↓ 
[Container 5 postgres qui contient les bases de données relatives au blog]

## Les fonctionnalités du frontend

### Le menu 

L’idée est d’avoir une application single page avec un menu en haut. Ce menu contiendrait les items suivants : 
* Accueil
* Blog
* Projets Ecole 42
* Projets Personnels
* Contact

### Page d'accueil :
La page d’accueil serait une page de présentation du site basique et possederai une liste des dernières update du site

### Page Blog :
La page blog listerait les derniers articles de blog que j’ecrirais du plus récent au plus ancien. Cette page contiendrait une pagination pour permettre de remonter jusqu’aux articles les plus anciens. En bas de la page on aurait donc des liens du type : < 1 2 3 4 ... > pour pouvoir charger les articles plus anciens ou plus récents.

Les articles s'afficheraient sous forme de cartes qui contiendraient : 
* le titre de l'article, 
* le théme de l'article (math, programmation, IA, ...), 
* une petite image, 
* la date de mise en ligne et la date de dernière mise à jour 
* le nombre de like 
* le nombre de commentaires. 
En cliquant sur la carte on va à la page de l'article.

#### Page Article
En haut de chaque page on aurait une photo le titre, la date de mise a jour et la date de mise en ligne de l'article puis le contenu de l'article.

### Page Projet 42
Si l’utilisateur clique sur l’onglet Projet 42 il arrive sur une page similaire à la page de la liste des blogs mais cette fois ci sans pagination. Il se retrouverait face à des cartes triées en 3 sections : piscine, tronc commun et Spécialisations.

Chaque carte contiendrait : 
* une petite image, 
* le titre du projet,
* une courte description du projet,
* un lien vers le repo github qui contient le code du projet,
* un lien vers une page tutoriel qui contiendrait un tuto pour aider les autres élèves à faire le projet,
* un lien pour télécharger le tuto au format pdf 
* et parfois un lien qui mene a une page qui permet de tester le projet directement en ligne.

#### Page de tests des projets
C’est pour ces pages de test que je vais tester différentes stack ! Et c’est pour ces pages de test que je vais avoir besoin de backend differents. Les différent projets seront wrappés par des framework différents à chaque fois. 

#### Page tutoriels 
Pour ce qui est des la page tuto, parfois les tutoriaux sont trés très longs (20 à 40 pages) il faudrait donc présenter un seul chapitre à la fois avec un menu sur la gauche qui apparaitrait et permettrait de naviguer à travers le tutoriel pour aller d’un chapitre à l’autre. En fait tout ce passerait comme si chaque chapitre etait un article de blog à part. 

### Page Projet Personnels 
La page des projet personnel aurait un fonctionnement complêtement similaire à projet 42. En fait ce serait la même chose mais avec mes projets personnels. Au départ il n'y aura qu'une seule carte pour le projet de resolution du collectionneur de tickets. La page de test sera un jupiter notebook qui permettra à l'utilisateur de lancer le projet.

### Contact :
Pour l’onglet contact on y retrouvera mon CV et un formulaire pour m’envoyer un message et mes réseaux sociaux.

## Contenu de la v1 :

### Accueil

Un texte de type :
> Bienvenue dans mon laboratoire ! Ce site est espace d'expérimentations. Vous y trouverez pleins de mini projets dont le but est d'apprendre et de montrer le fonctionnement de différentes technologies. Le but est d'explorer afin de découvrir comment fonctionne quelques unes des milliers de technologies qui existent aujourd'hui.
> La liste des améliorations. Par exemple : 13.03.2026 : ajout d'un test de code interview au projet de comparaison des différents langages

### Projet 42
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

### Projets personnels
Un seul : la resolution du probleme du collectionneur de ticket : tuto + un page avec un jupiter notebook embarqué pour tester le projet

## Base de donnees pour le blog

Table tutoriels :
- id
- Titre du tuto : title
- slug : pour savoir quels fichiers mdx correspondent à ce tuto
- project_id
- date de mise en ligne created_at
- date de derniere update updated_at

Table articles :
- id
- Titre du tuto : title
- theme : string
- slug : pour savoir quels fichiers mdx correspondent à cet article
- date de mise en ligne created_at
- date de derniere update updated_at

## Les améliorations à faire quand la V1 sera en ligne

### update 1 (fonctionnalité): Page de connexion pour les utilisateurs

La page _se connecter_ permettrait aux utilisateurs de s’identifier selon 5 moyens : 
* compte github, 
* compte google,
* compte infomaniak
* compte ecole 42
* via un formulaire que je reserve à les amis a qui je ferai un compte special.

Les privilèges seront différents en fonction de la maniére dont l'utilisateur se sera connecté :
* github, google, infomaniak, ecole 42 : Le fait de s’identifier permettra de pouvoir commenter les articles de blog.
* Pour les comptes de mes amis ils auront accés à certains articles de blog cachés que les autres utilisateurs ne verront pas.

### update 1.1 : ajout des formulaires pour commenter de like

A la fin de chaque chapitre des tutos on trouverait un formulaire pour commenter le chapitre en cours d'affichage. Même chose à la fin de chaque article de blog.

### update 2 (contenu) : Projet de scrapping du compendium :

techno en backend : flask et beautiful soup
La page de test permettra de selectionner un médicament. Le site ira scrapper sa monographie et la présentera dans un belle page react.

### update 3 : Projet de comparaision des langages de programmation à travers des interviews tests

techno en backend : Piston API
Cela se présenterais comme un tuto. La table des matière repertorie tous les code interview déjà en ligne. Pour chaque code interview il y aurait au minimum 2 solution proposée dans 2 langage différents. Ces solutions seraient modifiables par l'utilisateur. Quand il envoie sa propre solution une batterie de test est faite por s'assurer que la solution est ok. Outre la solution qui serait donnée et executable des explications s'accompagnerait de la solution.

### update 4 : mettre le rustling en ligne

techo backend : axum
La page du projet possederait en haut un classement des meilleurs speed runners. L'utilisateur pourrait cliquer sur "lancer rustling" il devrait faire et reussir tous les exercices du rustling jusqu'au bout. Si il y parvient il a son nom qui s'affiche dans le classement des meilleurs speedrunners


### update 5 : Projet de recherche automatisée d'information pour préparer une sortie ski de rando :

techno en backend : Laravel (API REST)

L'utilisateur entre le nom d'une rando. Laravel lance les 5 appels en parallèle, assemble les résultats et les renvoie en JSON à Next.js. Mise en cache des réponses (Laravel Cache) pour éviter de re-scraper à chaque requête.

* CamptoCamp : topoguide de la rando (scraping)
* SkiTour : topoguide alternatif (scraping)
* MétéoSuisse : dernier BRA (Bulletin de Risque d'Avalanche) du secteur
* OpenMeteo : météo détaillée du secteur (API gratuite, pas de clé requise)
* YouTube Data API : vidéos présentant la rando

### update 6 : page de test pour ft_malloc

techno en backend : fast api avec subprocess et d3.js en front
L'idée est d'offrir la possibilité de tester malloc, realloc et free en renvoyant un schema de la mémoire apres la sequence de malloc, free et realloc qu'il a demandé

### update 7 :

techno : github actions et watchover
A terme le but serait que le site se mette a jour automatiquement grace à la surveillance d'un repo (ou un compte ??) github. Je n'ai plus qu a ajouter du code et du contenu sur le repo et le site le met en ligne automatiquement en créeant si nécessaire de nouveaux containers.

## Liste des technologies embarqués pour chaque container

### NginX
### Flask
### FastAPI
### SpringBoot
### JupyterHub
### PostgreSQL

## Todo list pour mener le projet

### Obtenir un VPS gratuit au pres d'infomaniak
### Preparer L'arcitecture de Dockers avec docker compose
### Mettre en ligne un page d'accueil avec le texte d'accueil
### Apprendre le java
### Terminer et valider le projet AvajLauncher
### Apprendre SpringBoot
### Developper un frontend adapte a avajLauncher
### Mettre en ligne avajLauncher

