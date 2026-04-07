# Part 3: K3d and Argo CD

L'objectif de cette partie est de mettre en place un pipeline **CI/CD GitOps** : un repo GitHub sert de source de vérité, et à chaque nouveau commit, **Argo CD synchronise automatiquement** l'application déployée dans le cluster.

![part3-iot.png](/projets/InceptionOfThings/tutoriel/assets/part3-iot.png)

<aside>
💡

**Qu’est-ce-que GitOps ?**

GitOps est une approche DevOps de gestion d’infrastructure et d’applications où Git sert de “source unique de vérité”. L’état souhaité du système est défini via des fichiers de configuration (YAML) dans Git, et des outils automatisés (ex: Argo CD, Flux) synchronisent cet état avec l’infrastructure, garantissant des déploiements sécurisés, traçables et réversibles.

**Git est l'unique source de vérité** 🎯 : Tout l'état souhaité de votre système est défini dans Git. Si ce n'est pas dans Git, cela n'existe pas (ou ne devrait pas exister) sur votre cluster.

**Tout traiter comme du code (Everything as Code)** 💻 : Pas seulement l'application, mais aussi l'infrastructure, le réseau, les politiques de sécurité et les seuils d'alerte.

**Les opérations sont réalisées via des flux de travail Git (Workflows)** 🔄 : Pour modifier l'infrastructure, on ne tape pas une commande en direct ; on crée une *Pull Request* ou un *Merge Request*. L'approbation du code devient l'approbation du changement.

</aside>

Dans ce projet, l'application déployée est l'image Docker `wil42/playground`, pilotée par des fichiers YAML stockés dans votre repo Git.

### À propos d'Argo CD

Argo CD est un **contrôleur Kubernetes** qui surveille en permanence vos applications et les compare à leur état cible défini dans Git.

- Si l'état réel **correspond** à Git → tout va bien ✅
- Si l'état réel **diverge** de Git → Argo CD signale l'application comme `OutOfSync` ⚠️ et peut la resynchroniser automatiquement

> 📚 Sources : [argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/stable/)
> 

## Commandes du CLI d’argoCD

```bash
# installation
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# changing password
argocd account update-password

# list apps registered on argocd
argocd app list

# create app from manifest file
argocd app create [app-name] --file [path/to/manifest/file]

# get argocd app details
argocd app get [app name]

# sync app
argocd app sync [app name]

# options inherited by most commands:

# Enables gRPC-web protocol. Useful if Argo CD server is behind proxy which does not support HTTP2.
argocd [command] --grpc-web 
```

> Sources :
> 
> 
> https://argo-cd.readthedocs.io/en/stable/
> 
> https://www.youtube.com/watch?v=p-kAqxuJNik
> 
> https://www.youtube.com/watch?v=2pvGL0zqf9o
> 
> https://www.redhat.com/en/topics/devops/what-is-argocd
> 
> https://www.redhat.com/en/topics/devops/what-is-gitops
> 

## Explications du script de déploiement

Tout d’abord voici le script :

```bash
#!/usr/bin/bash

set -e

INGRESS_NGINX_DEPLOY_MANIFEST_URL="https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml"
ARGOCD_INSTALL_MANIFEST_URL="https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"

TIMEOUT_DURATION=120s

# * k3d cluster creation
k3d cluster create p3 \
    --servers 1 \
    --agents 1 \
    -p "8080:80@loadbalancer" \
    -p "8443:443@loadbalancer" \
    --wait

kubectl wait --for=condition=Ready nodes --all --timeout=$TIMEOUT_DURATION

# * Ingress-nginx installation
kubectl apply -f $INGRESS_NGINX_DEPLOY_MANIFEST_URL
kubectl wait -n ingress-nginx --for=condition=available deployment/ingress-nginx-controller --timeout=$TIMEOUT_DURATION

# * Argo CD installation
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f $ARGOCD_INSTALL_MANIFEST_URL
kubectl rollout status deployment/argocd-server -n argocd --timeout=$TIMEOUT_DURATION

# * Argo CD configuration
kubectl patch deployment argocd-server -n argocd --type=json \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--insecure"}]'
kubectl rollout restart deployment argocd-server -n argocd

kubectl rollout status deployment/argocd-server -n argocd --timeout=$TIMEOUT_DURATION
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
kubectl apply -f ./confs/ingress-argocd.yaml -n argocd

if ! grep -q "argocd.local" /etc/hosts; then echo "127.0.0.1 argocd.local" | sudo tee -a /etc/hosts fi

until kubectl get ingress argocd-server-ingress -n argocd \
  -o jsonpath='{.status.loadBalancer.ingress[0]}' 2>/dev/null | grep -q .; do
  sleep 2
done

PASSWORD_ARGOCD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d)

echo "y" | argocd login argocd.local:8080 --username admin --password $PASSWORD_ARGOCD --insecure --grpc-web

# * Creation of the app (wil42-playground) in Argo CD
kubectl create namespace dev
argocd app create wil42-playground --file ./confs/wil42-playground-app.yaml --grpc-web
kubectl apply -f ./confs/ingress-wil42.yaml -n dev

if ! grep -q "wil42.local" /etc/hosts; then
  echo "127.0.0.1 wil42.local" | sudo tee -a /etc/hosts
fi

until kubectl get ingress wil42-ingress -n dev \
  -o jsonpath='{.status.loadBalancer.ingress[0]}' 2>/dev/null | grep -q .; do
  sleep 2
done

echo -e $BLUE"Everything is configured !" $RESET
echo -e $BLUE "Connect to Argo CD Web at" $GREEN "http://argocd.local:8080" $RESET "with password" $GREEN $PASSWORD_ARGOCD $RESET
echo -e $BLUE "Access the deployed app (wil42-playground) at" $GREEN "http://wil42.local:8080" $RESET
```

### Etape 1 : Création du cluster k3d

Dans cette section nous allons expliquer pas à pas la commande :

```bash
k3d cluster create p3 --servers 1 --agents 1 -p "8080:80@loadbalancer" -p "8443:443@loadbalancer" --wait
```

`k3d cluster create p3 —server1` : sert à créer un cluster appelé p3. Si nous lançons uniquement cette commande dans le terminal, nous obtenons un cluster comportant un seul node qui contient notre serveur. Ce node se trouve dans un container docker à part qui est sur le network créé par k3d. D’ailleurs, dans ce cas précis le flag `—server 1` est inutile. Même sans ce flag notre cluster contiendra un node server. Ainsi lorsqu’on lance un `docker ps` on obtient :

```bash
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                     NAMES
413255339bae   ghcr.io/k3d-io/k3d-tools:5.8.3   "/app/k3d-tools noop"    16 seconds ago   Up 15 seconds                             k3d-p3-tools
9555c9030882   ghcr.io/k3d-io/k3d-proxy:5.8.3   "/bin/sh -c nginx-pr…"   16 seconds ago   Up 12 seconds   0.0.0.0:43311->6443/tcp   k3d-p3-serverlb
**6f7cb308bde8   rancher/k3s:v1.31.5-k3s1         "/bin/k3d-entrypoint…"   16 seconds ago   Up 14 seconds                             k3d-p3-server-0**
```

Le container `k3d-p3-server-0` contient notre node server. la commande `kubectl cluster-info` nous indique les endpoints qui permettent d’interagir avec ce node :

```bash
Kubernetes control plane is running at https://0.0.0.0:37063
CoreDNS is running at https://0.0.0.0:37063/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://0.0.0.0:37063/api/v1/namespaces/kube-system/services/https:metrics-server:https/proxy
```

`k3d cluster create p3 --servers 1 --agents 1` : même chose que précédemment avec une différence majeure : cette fois ci nous ajoutons un agent au sein de notre cluster. Nous obtenons donc ceci : 

```bash
CONTAINER ID   IMAGE                            COMMAND                  CREATED              STATUS              PORTS                     NAMES
e55408e0736b   ghcr.io/k3d-io/k3d-tools:5.8.3   "/app/k3d-tools noop"    About a minute ago   Up About a minute                             k3d-p3-tools
df67f8c67675   ghcr.io/k3d-io/k3d-proxy:5.8.3   "/bin/sh -c nginx-pr…"   About a minute ago   Up About a minute   0.0.0.0:39101->6443/tcp   k3d-p3-serverlb
**3e29836fcdaa   rancher/k3s:v1.31.5-k3s1         "/bin/k3d-entrypoint…"   About a minute ago   Up About a minute                             k3d-p3-agent-0**
3fe7d4a693a1   rancher/k3s:v1.31.5-k3s1         "/bin/k3d-entrypoint…"   About a minute ago   Up About a minute                             k3d-p3-server-0
```

Nous constatons un container supplémentaire qui s’est ajouté à notre cluster. Comme son nom l’indique, ce container contient notre agent. 

 `-p "8080:80@loadbalancer"` : cette partie de la commande permet d’exposer le port 8080 du container loadbalancer vers le port 80 de la machine. Mais quel est ce conteneur loadbalancer ? Eh bien c’est celui-ci : `k3d-p3-serverlb` . D’où il sort ? A quoi il sert ? Pourquoi il est là ? C’est un container qui est créé par défaut au sein du cluster par la commande k3d cluster create. Il contient nginx et sert à la redirection des ports.

`-p "8443:443@loadbalancer”` : ici nous effectuons la même chose que précédemment mais pour les connexions sécurisées de type `https`.

`— wait` : permet d’attendre que tous les containers soient dans un état “ready” avant de continuer. 

Sources :

- https://k3d.io/v5.8.3/usage/commands/k3d_cluster_create/
- https://k3d.io/v5.1.0/design/defaults/

### Etape 2 : Installation de l’ingress nginx

k3d n'installe pas Traefik par défaut (contrairement à k3s). On installe donc **ingress-nginx** manuellement :

```bash
kubectl apply -f "https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml"
```

Ce manifest officiel crée une vingtaine d'objets Kubernetes : un namespace dédié `ingress-nginx`, des ServiceAccounts, des Services, un Deployment pour le contrôleur, etc.

> 📚 Source : [kubernetes.io/ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
> 

### Étape 3 — Installation d'Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f $ARGOCD_INSTALL_MANIFEST_URL
```

Les deux flags importants :

- `-server-side` — certains CRD d'Argo CD dépassent la limite de taille des annotations côté client (262 Ko). Ce flag délègue l'opération au serveur pour contourner cette limite
- `-force-conflicts` — permet à cet `apply` de prendre en charge des champs déjà gérés par un autre outil (Helm, `apply` précédent…). Sans danger pour une nouvelle installation.

> 📚 Source : [argo-cd.readthedocs.io/getting-started](https://argo-cd.readthedocs.io/en/stable/getting_started/#1-install-argo-cd)
> 

La commande `kubectl rollout status deployment/argocd-server -n argocd --timeout=$TIMEOUT_DURATION` a pour rôle d’attendre que le déploiement soit terminé. `kubectl rollout status` montre le status du déploiement.

### Étape 4 — Configuration d'Argo CD

**Passer Argo CD en mode `--insecure`** (HTTP au lieu de HTTPS) :

```bash
kubectl patch deployment argocd-server -n argocd --type=json \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--insecure"}]'
```

Cette commande modifie directement le YAML du déploiement `argocd-server` en ajoutant l'argument `--insecure` au premier container. On redémarre ensuite le déploiement pour que le changement soit pris en compte.

**Supprimer le webhook de validation nginx** :

```bash
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
```

Cette ligne a été ajoutée suite à l'erreur `service "ingress-nginx-controller-admission" not found` qui apparaissait aléatoirement lors de l'application de l'Ingress Argo CD. La solution : supprimer la configuration de webhook de validation avant d'appliquer la ressource Ingress.

> 📚 Source : [stackoverflow.com](https://stackoverflow.com/questions/61365202/nginx-ingress-service-ingress-nginx-controller-admission-not-found)
> 

**Attendre que l'Ingress soit prêt** :

```bash
until kubectl get ingress argocd-server-ingress -n argocd \
  -o jsonpath='{.status.loadBalancer.ingress[0]}' 2>/dev/null | grep -q .; do
  sleep 2
done
```

Cette boucle attend que le champ `status.loadBalancer.ingress[0]` soit rempli dans la ressource Ingress — ce qui indique que le load balancer a bien pris en charge la ressource. Le filtre `-o jsonpath` correspond à cette structure JSON :

```json
"status": {
  "loadBalancer": {
    "ingress": [
      { "ip": "...", "hostname": "..." }
    ]
  }
}
```

> 📚 Source : [kubernetes.io/jsonpath](https://kubernetes.io/docs/reference/kubectl/jsonpath/)
> 

**Récupérer le mot de passe Argo CD et se connecter** :

```json
PASSWORD_ARGOCD=$(kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath='{.data.password}' | base64 -d)

echo "y" | argocd login argocd.local:8080 \
  --username admin --password $PASSWORD_ARGOCD --insecure --grpc-web
```

Le mot de passe initial est stocké dans un Secret Kubernetes, encodé en base64. On le décode à la volée avec `base64 -d`. L'option `--grpc-web` est nécessaire ici car Argo CD est derrière un proxy (l'Ingress nginx) qui ne supporte pas HTTP2 — sans elle, vous obtenez ce warning :
```
"msg":"Failed to invoke grpc call. Use flag --grpc-web in grpc calls."
```

### Création de l’application dans argo CD

```bash
kubectl create namespace dev
argocd app create wil42-playground --file ./confs/wil42-playground-app.yaml --grpc-web
kubectl apply -f ./confs/ingress-wil42.yaml -n dev

if ! grep -q "wil42.local" /etc/hosts; then
  echo "127.0.0.1 wil42.local" | sudo tee -a /etc/hosts
fi

until kubectl get ingress wil42-ingress -n dev \
  -o jsonpath='{.status.loadBalancer.ingress[0]}' 2>/dev/null | grep -q .; do
  sleep 2
done
```

On crée le namespace `dev`, on enregistre l'application `wil42-playground` dans Argo CD via un fichier de config, et on applique son Ingress. La même boucle d'attente que précédemment garantit que l'Ingress est bien actif avant de terminer le script.

Sans l’option `--grpc-web` pour les commandes `argocd login` et `argocd app create` on avait le warning suivant:

```json
{
    "level":"warning",
    "msg":"Failed to invoke grpc call. Use flag --grpc-web in grpc calls. To avoid this warning message, use flag --grpc-web.","time": ...
}
```