# À propos de Kubernetes

Kubernetes (aussi appelé **K8s**) est un outil d'**orchestration de conteneurs** : il permet de déployer, exécuter et maintenir des applications conteneurisées de manière automatisée.

> 🧠 **Concrètement, ça veut dire quoi ?**
Imaginez que vous avez une application soigneusement packagée dans une image Docker. Si cette application doit devenir un service populaire et supporter une forte charge, vous allez avoir besoin de bien plus que d'un simple `docker run`. C'est là que Kubernetes entre en jeu.
> 

Voici ce qu'il vous offre :

- **Déploiement automatisé** — lancer l'application sur un ou plusieurs serveurs
- **Auto-restart** — relancer l'application automatiquement après une mise à jour ou un crash
- **Exposition réseau** — attribuer une adresse IP ou un nom de domaine pour que les utilisateurs puissent y accéder
- **Scalabilité** — augmenter ou réduire le nombre d'instances selon le trafic

Il existe plusieurs **distributions de Kubernetes**, chacune adaptée à un contexte différent :

| Distribution | Cas d'usage |
| --- | --- |
| [`k3s`](https://k3s.io/) | Environnements légers, IoT, Raspberry Pi |
| [`k3d`](https://k3d.io/) | Développement local, clusters K3s dans Docker |
| [`kind`](https://kind.sigs.k8s.io/) | Tests Kubernetes, chaque node dans un container Docker |
| [`minikube`](https://minikube.sigs.k8s.io/docs/) | Démo et apprentissage local, supporte VM, container et bare-metal |

## k3s

**k3s** est une distribution Kubernetes **simplifiée et légère**, conçue pour fonctionner dans des environnements avec peu de ressources : Raspberry Pi, systèmes IoT, ou simplement en local sur votre machine.

> 💡 Si Kubernetes classique est un camion semi-remorque capable de tout transporter, k3s est une camionnette — elle fait le même travail essentiel, mais elle est bien plus maniable et consomme moins.
> 

**Ce qui a été retiré ou remplacé :**

k3s ne conserve que les fonctionnalités essentielles de Kubernetes. Pour rester léger :

- Les fonctionnalités **legacy** (obsolètes) ont été **supprimées**
- Certains composants lourds ont été **remplacés par des équivalents plus légers** : networking, load balancing, stockage, serveur DNS…

**Dans le cadre de ce projet**, k3s est utilisé pour créer des **clusters qui simulent un environnement Kubernetes standard** (k8s), en s'appuyant sur des machines virtuelles.

📚 Sources : [k3s.io](https://k3s.io/) — [blog.stephane-robert.info](https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/k3s/)

## k3d

Si k3s est une version allégée de Kubernetes, **k3d est une surcouche de k3s** qui permet de faire tourner des clusters k3s… directement dans des **containers Docker**.

> 💡 **En pratique** : au lieu de démarrer des machines virtuelles pour simuler vos nodes, k3d crée des **containers Docker** qui jouent ce rôle. C'est encore plus rapide à lancer et ça consomme encore moins de ressources.
> 

**Les avantages de k3d :**

- ⚡ **Création ultra-rapide** de clusters à un ou plusieurs nœuds
- 🖥️ **Idéal pour le développement local** — pas besoin d'infra dédiée
- 🔁 **Facile à détruire et recréer** — parfait pour tester des configurations

> 📚 Source : [k3d.io](https://k3d.io/stable/)
> 

## Architecture d’un cluster Kubernetes

> ⚠️ **Note de lecture** : cette section est dense. Si c'est votre première lecture, vous pouvez la **survoler ou la sauter** et y revenir une fois que vous avez mis les mains dans le projet. Elle est surtout utile comme **référence**.
> 

### Vue d'ensemble

Un cluster Kubernetes est composé de deux grandes familles de machines, appelées **nodes** :

![img](/projets/InceptionOfThings/tutoriel/assets/Kubernetes-Architecture-Diagram.webp)


### Les Worker Nodes — là où vivent vos apps

Chaque **worker node** contient un ou plusieurs **pods**. Un pod, c'est la plus petite unité Kubernetes — il contient un ou plusieurs **containers**.

> 🧠 **Exemple concret** : prenons une application web classique avec 3 containers :
> 
> - `django` (backend)
> - `nginx` (frontend)
> - `postgresql` (base de données)
> 
> Avec Kubernetes, on pourrait découper ça en **2 worker nodes** :
> 
> - **Node 1** — `django` + `nginx` → peut être dupliqué en plusieurs pods si le trafic augmente
> - **Node 2** — `postgresql` seul → isolé pour protéger les données (un pod DB ne se scale pas horizontalement sans précautions)

### La Control Plane — le cerveau du cluster

La **control plane** tourne sur le ou les **master nodes**. Elle contient 4 composants clés :

| Composant | Rôle |
| --- | --- |
| `kube-apiserver` | Point d'entrée central — expose l'API Kubernetes (REST), utilisé par tous les autres composants |
| `etcd` | Base de données clé-valeur — stocke l'état complet du cluster (pods, services, configs…) |
| `scheduler` | Assigne les nouveaux pods à un node disponible, selon les ressources disponibles |
| `controller manager` | Surveille en permanence l'état du cluster et agit si ça dévie du *desired state* défini dans vos manifests |

### Composants présents sur **tous** les nodes (master et worker)

Trois composants sont présents partout dans le cluster :

**`kubelet`** — le gardien du node
C'est lui qui s'assure que les containers définis dans les pods tournent correctement. Il gère :

- le démarrage et l'arrêt des pods
- la surveillance de leur état de santé (et remonte les alertes à la control plane)
- l'allocation CPU / mémoire pour chaque pod
- le montage des volumes de stockage

> ⚙️ `kubelet` tourne comme un **daemon** géré par `systemd` — il ne gère que les containers créés par Kubernetes, pas ceux lancés manuellement.
> 

**`kube-proxy`** — le gestionnaire réseau
Il gère la communication réseau entre tous les nodes du cluster (`master ↔ worker`, `worker ↔ worker`) et vers l'extérieur.

**`container runtime`** — le moteur d'exécution
C'est lui qui exécute concrètement les containers. Les runtimes compatibles Kubernetes respectent deux standards :

- **CRI** (Container Runtime Interface) — l'interface qu'utilise Kubernetes pour parler au runtime (`containerd`, `CRI-O`, Docker…)
- **OCI** (Open Container Initiative) — les standards de format et d'exécution des containers

### Les Addons

Des **addons** peuvent être ajoutés au cluster pour enrichir ses fonctionnalités : DNS interne, interface Web (Dashboard), plugins réseau (CNI), etc.

> 📚 Sources : [kubernetes.io](https://kubernetes.io/docs/reference/command-line-tools-reference/) — [Kubernetes in Action, Marko Luksa](https://github.com/anzhihe/Free-Docker-K8s-Books/blob/main/book/Kubernetes%20in%20Action.pdf) — [blog.stephane-robert.info](https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/kubernetes/)
> 

## Commandes du CLI Kubernetes : kubectl

`kubectl` est l'outil en ligne de commande pour interagir avec votre cluster Kubernetes. Voici les commandes les plus utiles, regroupées par usage.

### Inspecter l'état du cluster

```bash
# Afficher tous les nodes avec des infos détaillées (IP, OS, version...)
kubectl get nodes -o wide

# Afficher tous les services
kubectl get services

# Afficher les infos du master et des services du cluster
kubectl cluster-info

# Afficher les détails complets d'une ressource (très utile pour déboguer)
kubectl describe nodes
kubectl describe pods
kubectl describe pods [nom-du-pod]

# Voir la config d'un ingress
kubectl get ingress [nom-de-l-ingress]
kubectl describe ingress [nom-de-l-ingress]
```

### Déployer et mettre à jour

```bash
# Appliquer un manifest (crée ou met à jour la ressource décrite)
kubectl apply -f [chemin/vers/fichier-ou-dossier]

# Forcer le remplacement d'une ressource (⚠️ provoque une interruption de service)
kubectl replace --force -f ./pod.json

# Scaler un déploiement à N replicas
kubectl scale --replicas=[nombre] deployment/[nom]
```

### Supprimer des ressources

```bash
# Supprimer un pod (suit la stratégie définie dans le manifest, RollingUpdate par défaut)
kubectl delete [nom-du-pod]

# Supprimer toutes les ressources décrites dans un fichier
kubectl delete -f [fichier].yaml
```

> 📚 Référence complète : [kubernetes.io/docs/reference/kubectl/quick-reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
> 