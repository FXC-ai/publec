# Grille de tests

| Test | Commande(s) | Explication |
| --- | --- | --- |
| Le noyau est-il un noyau Linux ? | `uname -s` | Affiche le nom du noyau.  |
| La version Linux est-elle supérieure à 4.x ? | `uname -r` | Affiche la version du noyau (release). Permet de vérifier qu'elle correspond aux contraintes (`>4`). |
| Les sources sont-elles dans `/usr/src/linux-x.x` ? | `ls /usr/src` | Liste le contenu de `/usr/src` pour vérifier la présence du répertoire des sources du noyau. |
| Vérifier la version du kernel dans les logs | `journalctl -k -b ou grep -m1 "Linux version" dmesg ou grep -m1 "Linux version"` | journalctl suffit, la première ligne |
| Y a-t-il au moins 3 partitions (root, `/boot`, swap) ? | `lsblk swapon --show` | `lsblk` affiche disques/partitions et points de montage (utile pour voir `/` et `/boot`). `swapon --show` affiche les espaces swap actifs. |
| Y a-t-il un chargeur de modules (type udev) ? | `systemctl status systemd-udevd` | Vérifie que le démon udev (gestion des périphériques) est présent et actif via systemd. |
| Y a-t-il un bootloader (LILO / GRUB / …) ? | `grub-install --version` | Affiche la version de `grub-install`. Si la commande existe, GRUB est installé. |
| Vérifier le nom du binaire du kernel dans `/boot` | `ls /boot` | Liste les fichiers de `/boot` pour vérifier la présence et le nom du noyau (`vmlinuz-<version>-<login>`). |
| Y a-t-il un gestionnaire de démons ? (SysV, systemd, …) | `ps -p 1` | Affiche le nom de la commande du PID 1 (init). Dans notre cas : `systemd` . |
| Un éditeur est-il présent ? | `vim ft_linux_basic.sh` | Ouvre un fichier avec Vim pour vérifier que l'éditeur est installé et fonctionnel. |
| Internet fonctionne-t-il ? | `ping -c 3 1.1.1.1 ping -c 3 google.com` | Ping vers une IP (teste réseau sans DNS) puis vers un nom de domaine (teste DNS + réseau). `-c 3` envoie 3 paquets. |
| Installer le paquet **screen** (source GNU) | `wget https://ftp.gnu.org/gnu/screen/screen-5.0.1.tar.gz PUIS tar -xf screen-5.0.1.tar.gzcd screen-5.0.1 .configure --prefix=/usr --disable-pam --enable-socket-dir=/run/screen --with-pty-group=5 PUIS make PUIS make install` | Télécharge l'archive, l'extrait, configure la compilation avec options (installation dans `/usr`, PAM désactivé, socket dans `/run/screen`, groupe pty), compile puis installe. |
