docker login registry.gitlab.com -u danphi
docker build -t registry.gitlab.com/danphi/nimp --platform linux/x86_64 .
docker push registry.gitlab.com/danphi/nimp
ssh dan@104.236.39.83 "cd ~/server; docker compose pull; docker compose up -d"
