# Inception Of Things - Sujet

# Sujet

## **Chapitre I - Préambule**

![img-003-005.png](/projets/InceptionOfThings/subject/img-003-005.png)

## Chapitre II - Introduction

Ce projet vise à approfondir vos connaissances en vous faisant utiliser K3d et K3s avec Vagrant.

Vous apprendrez à configurer une machine virtuelle personnelle avec Vagrant et la distribution de votre choix. Ensuite, vous apprendrez à utiliser K3s et son Ingress.

Enfin, vous découvrirez K3d, qui vous simplifiera la vie.Ces étapes vous permettront de débuter avec Kubernetes.

<aside>
ℹ️

Ce projet constitue une introduction minimale à Kubernetes. En effet, cet outil est trop complexe pour être maîtrisé en un seul sujet.

</aside>

## **Chapitre III - Consignes générales**

- L’ensemble du projet doit être réalisé dans une machine virtuelle.
- Vous devez placer tous les fichiers de configuration de votre projet dans des dossiers situés à la racine de votre dépôt (consultez la section *Soumission et évaluation par les pairs* pour plus d’informations).
    
    Les dossiers de la partie obligatoire seront nommés : **p1**, **p2** et **p3**, et celui de la partie bonus : **bonus**.
    
- Ce sujet vous demande d’appliquer des concepts qui, selon votre parcours, peuvent ne pas avoir encore été abordés. Nous vous conseillons donc de ne pas hésiter à lire beaucoup de documentation afin d’apprendre à utiliser K8s avec K3s, ainsi que K3d.

<aside>
ℹ️

Vous pouvez utiliser les outils de votre choix pour configurer votre machine virtuelle hôte, ainsi que le fournisseur utilisé dans Vagrant.

</aside>

## **Chapitre IV - Partie obligatoire**

Ce projet consistera à mettre en place plusieurs environnements en respectant des règles spécifiques.

Il est divisé en trois parties que vous devez réaliser dans l’ordre suivant :

- **Partie 1 :** K3s et Vagrant
- **Partie 2 :** K3s et trois applications simples
- **Partie 3 :** K3d et Argo CD

## **IV.1 Partie 1 : K3s et Vagrant**

Pour commencer, vous devez mettre en place **2 machines**.

Rédigez votre premier **Vagrantfile** en utilisant comme système d’exploitation **la dernière version stable** de la distribution de votre choix. Il est **FORTEMENT** conseillé de n’allouer que le strict minimum en termes de ressources : **1 CPU** et **512 Mo de RAM** (ou **1024 Mo**). Les machines doivent être lancées avec **Vagrant**.

Voici les spécifications attendues :

- Les noms des machines doivent correspondre au **login** de quelqu’un de votre équipe. Le **hostname** de la première machine doit se terminer par la lettre majuscule **S** (comme *Server*). Le hostname de la seconde machine doit se terminer par **SW** (comme *ServerWorker*).
- Avoir une **IP dédiée** sur l’interface réseau principale. L’IP de la première machine (*Server*) sera **192.168.56.110**, et l’IP de la seconde machine (*ServerWorker*) sera **192.168.56.111**.
- Pouvoir se connecter en **SSH** sur les deux machines **sans mot de passe**.

<aside>
⚠️

Vous configurerez votre **Vagrantfile** selon les pratiques modernes.

</aside>

Vous devez installer **K3s** sur les deux machines :

- Sur la première (*Server*), il sera installé en **mode contrôleur**.
- Sur la seconde (*ServerWorker*), en **mode agent**.

<aside>
ℹ️

Vous devrez utiliser **kubectl** (et donc l’installer également).

</aside>

Voici un exemple basique d’un Vagrantfile:

```bash
$> cat Vagrantfile
Vagrant.configure(2) do |config|
[...]
config.vm.box = REDACTED
config.vm.box_url = REDACTED
config.vm.define "wilS" do |control|
control.vm.hostname = "wilS"
control.vm.network REDACTED, ip: "192.168.56.110"
control.vm.provider REDACTED do |v|
v.customize ["modifyvm", :id, "--name", "wilS"]
[...]
end
config.vm.provision :shell, :inline => SHELL
[...]
SHELL
control.vm.provision "shell", path: REDACTED
end
config.vm.define "wilSW" do |control|
control.vm.hostname = "wilSW"
control.vm.network REDACTED, ip: "192.168.56.111"
control.vm.provider REDACTED do |v|
v.customize ["modifyvm", :id, "--name", "wilSW"]
[...]
end
config.vm.provision "shell", inline: <<-SHELL
[..]
SHELL
control.vm.provision "shell", path: REDACTED
end
end
```

Voici un exemple lorsque les machines virtuelles sont chargées :

![img-009-012.png](/projets/InceptionOfThings/subject/img-009-012.png)

Voici un exemple quand la configuration n’est pas complete :

![img-009-013.png](/projets/InceptionOfThings/subject/img-009-013.png)

Voici un exemple quand les machines sont correctement configurees : 

![img-009-015.png](/projets/InceptionOfThings/subject/img-009-015.png)

<aside>
ℹ️

Les captures d’écran ci-dessus ne sont données qu’à titre d’exemple. Les distributions Linux modernes utilisent des noms d’interfaces réseau prévisibles (par ex. **enp0s8**, **enp0s9**) au lieu de **eth0/eth1**. Pour vérifier votre configuration réseau, utilisez :

- `ip a` pour lister toutes les interfaces, ou
- `ip a show <nom_interface>` pour une interface spécifique.

Sur macOS, utilisez `ifconfig`. Adaptez les commandes en fonction des noms réels des interfaces de votre système.

</aside>

## **IV.2 Partie 2 : K3s et trois applications simples**

Vous comprenez maintenant les bases de K3s. Il est temps d’aller plus loin ! Pour réaliser cette partie, vous n’aurez besoin que d’une seule machine virtuelle, avec la distribution de votre choix (dernière version stable), et K3s installé en **mode serveur**.

Vous mettrez en place **3 applications web** de votre choix qui tourneront dans votre instance K3s.

Vous devrez pouvoir y accéder en fonction du **HOST** utilisé lors d’une requête vers l’adresse IP **192.168.56.110**. Le nom de cette machine sera votre **login** suivi de **S** (par exemple, **wilS** si votre login est **wil**).

Voici un exemple simple de schéma :

![img-010-018.png](/projets/InceptionOfThings/subject/img-010-018.png)

Lorsque le client saisit l’adresse IP **192.168.56.110** dans son navigateur web avec le **HOST** `app1.com`, le serveur doit afficher **app1**. Lorsque le **HOST** `app2.com` est utilisé, le serveur doit afficher **app2**. Sinon, **app3** sera sélectionnée par défaut.

<aside>
ℹ️

Comme vous pouvez le voir, l’application numéro 2 possède **3 réplicas**. Adaptez votre configuration afin de créer ces réplicas.

</aside>

Tout d’abord, voici le résultat attendu lorsque la machine virtuelle n’est pas configurée :

![img-011-020.png](/projets/InceptionOfThings/subject/img-011-020.png)

Voici le résultat attendu lorsque la machine virtuelle est correctement configurée :

![img-012-023.png](/projets/InceptionOfThings/subject/img-012-023.png)

<aside>
⚠️

L’Ingress n’est volontairement pas affiché ici. Vous devrez le montrer à vos évaluateurs lors de votre soutenance.

</aside>

## **IV.3 Partie 3 : K3d et Argo CD**

Vous maîtrisez maintenant une version minimaliste de K3s ! Il est temps de mettre en place tout ce que vous venez d’apprendre (et bien plus encore !), mais **sans Vagrant** cette fois-ci. Pour commencer, installez **K3d** sur votre machine virtuelle.

Vous aurez besoin de **Docker** pour que K3d fonctionne, et probablement aussi d’autres logiciels. Vous devez donc écrire un **script** permettant d’installer tous les paquets et outils nécessaires, que vous exécuterez pendant votre **soutenance**.

Avant toute chose, vous devez comprendre la différence entre **K3s** et **K3d**.

Une fois que votre configuration fonctionne comme attendu, vous pourrez commencer à créer votre première **intégration continue** ! Pour cela, vous devez mettre en place une petite infrastructure en suivant la logique illustrée par le schéma ci-dessous :

![img-013-026.png](/projets/InceptionOfThings/subject/img-013-026.png)

Vous devez créer **deux namespaces** :

- Le premier sera dédié à **Argo CD**.
- Le second s’appellera **dev** et contiendra une application. Cette application sera déployée automatiquement par **Argo CD** en utilisant votre dépôt **GitHub** en ligne.

<aside>
ℹ️

Oui, en effet : vous devrez créer un dépôt public sur GitHub dans lequel vous pousserez vos fichiers de configuration. Vous êtes libre de l’organiser comme vous le souhaitez. La seule exigence obligatoire est d’inclure le **login** d’un membre du groupe dans le nom de votre dépôt.

</aside>

L’application à déployer doit exister en **deux versions différentes** (renseignez-vous sur les **tags** si ce n’est pas un sujet familier pour vous).

Vous avez deux options :

- Vous pouvez utiliser l’application préconçue créée par **Wil**, disponible sur **Docker Hub**.
- Ou vous pouvez coder et utiliser votre propre application. Créez alors un dépôt public sur **Docker Hub** afin d’y publier une image Docker de votre application. Vous devrez également taguer ses deux versions ainsi : **v1** et **v2**.

<aside>
ℹ️

Vous pouvez trouver l’application de Wil sur Docker Hub ici : https://hub.docker.com/r/wil42/playground
L’application utilise le **port 8888**.
Trouvez les deux versions dans la section **TAG** (*Tags*).

</aside>

<aside>
⚠️

Si vous décidez de créer votre propre application, elle doit être disponible via une **image Docker publique** publiée dans un dépôt **Docker Hub**. Les deux versions de votre application doivent également présenter **quelques différences**.

</aside>

Vous devez être capable de changer la version depuis votre dépôt public **GitHub**, puis vérifier que l’application a bien été mise à jour.

Voici un exemple montrant les deux namespaces et le **pod** situé dans le namespace **dev** :

```bash
$> k get ns
NAME STATUS AGE
[..]
argocd Active 19h
dev Active 19h
$> k get pods -n dev
NAME READY STATUS RESTARTS AGE
wil-playground-65f745fdf4-d2l2r 1/1 Running 0 8m9s
$>
```

Voici un exemple de lancement d’Argo CD une fois configuré :

![img-015-029.png](/projets/InceptionOfThings/subject/img-015-029.png)

On peut vérifier que notre application utilise bien la version attendue (dans ce cas, **v1**) :

```bash
$> cat deployment.yaml | grep v1
- image: wil42/playground:v1
$> curl http://localhost:8888/
{"status":"ok", "message": "v1"}
```

Voici une capture d’écran d’Argo CD avec notre application **v1** utilisant GitHub :

![img-015-031.png](/projets/InceptionOfThings/subject/img-015-031.png)

Ci-dessous, nous mettons à jour notre dépôt GitHub en changeant la version de notre application :

```bash
**$>sed -i 's/wil42\/playground\:v1/wil42\/playground\:v2/g' deployment.yaml
$>g up "v2" # git add+commit+push
[..]
a773f39..999b9fe master -> master
$> cat deployment.yaml | grep v2
- image: wil42/playground:v2**
```

L’application a été mise à jour avec succès :

![img-016-033.png](/projets/InceptionOfThings/subject/img-016-033.png)

L’application a été mise à jour avec succès :

![img-016-035.png](/projets/InceptionOfThings/subject/img-016-035.png)

Nous vérifions que la nouvelle version est disponible :

```bash
$> curl http://localhost:8888/
{"status":"ok", "message": "v2"}
```

<aside>
ℹ️

Lors du processus d’évaluation, vous devrez effectuer cette opération avec l’application que vous avez choisie : celle de **Wil** ou la vôtre.

</aside>

## **Chapitre V - Partie bonus**

La tâche bonus suivante a pour objectif d’être utile : ajouter **GitLab** au lab que vous avez réalisé dans la **Partie 3**.

<aside>
⚠️

Attention : ce bonus est complexe. La **dernière version disponible de GitLab** depuis le site officiel est attendue.

</aside>

Vous êtes autorisé à utiliser tout ce dont vous avez besoin pour réaliser cet extra. Par exemple, **Helm** pourrait être utile ici.

- Votre instance GitLab doit s’exécuter **localement**.
- Configurez GitLab pour qu’il fonctionne avec votre cluster.
- Créez un namespace dédié nommé **gitlab**.
- Tout ce que vous avez fait dans la Partie 3 doit fonctionner avec votre GitLab local.

Rendez ce travail supplémentaire dans un nouveau dossier nommé **bonus**, situé à la racine de votre dépôt. Vous pouvez ajouter tout ce qui est nécessaire pour que l’ensemble de votre cluster fonctionne.

<aside>
⚠️

La partie bonus ne sera évaluée que si la partie obligatoire est **irréprochable**. *Irréprochable* signifie que la partie obligatoire a été entièrement réalisée et fonctionne sans problème. Si vous n’avez pas validé **toutes** les exigences obligatoires, votre partie bonus ne sera **pas** évaluée du tout.

</aside>

## **Chapitre VI - Soumission et évaluation par les pairs**

Rendez votre devoir dans votre dépôt Git, comme d’habitude. Seul le travail présent dans votre dépôt sera évalué lors de la soutenance. N’hésitez pas à revérifier les noms de vos dossiers et fichiers afin de vous assurer qu’ils sont corrects.

Rappel :

- Rendez la partie obligatoire dans trois dossiers situés à la racine de votre dépôt : **p1**, **p2** et **p3**.
- Optionnel : rendez la partie bonus dans un dossier situé à la racine de votre dépôt : **bonus**.

Ci-dessous, un exemple de l’arborescence attendue :

```bash
$> find -maxdepth 2 -ls
424242 4 drwxr-xr-x 6 wandre wil42 4096 sept. 17 23:42 .
424242 4 drwxr-xr-x 3 wandre wil42 4096 sept. 17 23:42 ./p1
424242 4 -rw-r--r-- 1 wandre wil42 XXXX sept. 17 23:42 ./p1/Vagrantfile
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./p1/scripts
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./p1/confs
424242 4 drwxr-xr-x 3 wandre wil42 4096 sept. 17 23:42 ./p2
424242 4 -rw-r--r-- 1 wandre wil42 XXXX sept. 17 23:42 ./p2/Vagrantfile
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./p2/scripts
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./p1/confs
424242 4 drwxr-xr-x 3 wandre wil42 4096 sept. 17 23:42 ./p3
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./p3/scripts
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./p3/confs
424242 4 drwxr-xr-x 3 wandre wil42 4096 sept. 17 23:42 ./bonus
424242 4 -rw-r--r-- 1 wandre wil42 XXXX sept. 17 23:42 ./bonus/Vagrantfile
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./bonus/scripts
424242 4 drwxr-xr-x 2 wandre wil42 4096 sept. 17 23:42 ./bonus/confs
```

<aside>
💡

Any scripts you need will be added in a scripts folder. The
configuration files will be in a confs folder.

</aside>

<aside>
ℹ️

Le processus d’évaluation se déroulera sur l’ordinateur du groupe évalué.

</aside>

#