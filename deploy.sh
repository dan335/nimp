# 1) Log in
docker login registry.gitlab.com -u danphi

# 2) Use buildx (ensures the manifest is correct for the target platform)
docker buildx create --use --name nimpbuilder || docker buildx use nimpbuilder

# 3) Build and push amd64 image
docker buildx build \
  --platform linux/x86_64 \
  -t registry.gitlab.com/danphi/nimp:latest \
  --push .

ssh dan@104.236.39.83 "cd ~/server; docker compose pull; docker compose up -d"
