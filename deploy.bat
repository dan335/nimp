docker login registry.gitlab.com -u danphi
docker build -t registry.gitlab.com/danphi/nimp .
docker push registry.gitlab.com/danphi/nimp
ssh dan@host.winston.net "cd ~/server; docker compose pull; docker compose up -d"