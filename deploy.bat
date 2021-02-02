docker login registry.gitlab.com -u danphi
docker build -t registry.gitlab.com/danphi/nimp .
docker push registry.gitlab.com/danphi/nimp
ssh root@nimp.app "cd /shipyard/compose; docker-compose pull; docker-compose stop nimp; docker-compose rm -f nimp; docker-compose up -d"