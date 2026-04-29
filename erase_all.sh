sudo docker images
sudo docker volume ls
echo ""
sudo docker system prune -a
sudo docker system prune --volumes
sudo rm -rf frontend-nextjs/.next
sudo rm -rf frontend-nextjs/node_modules
sudo rm -f package-lock.json
sudo docker images
sudo docker volume ls