docker login registry.gitlab.com -u danphi
docker build -t registry.gitlab.com/danphi/nimp --platform linux/amd64 .
docker push registry.gitlab.com/danphi/nimp
ssh root@nimp.app "cd /shipyard/compose; docker-compose pull; docker-compose up -d"