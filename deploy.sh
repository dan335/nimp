#!/bin/bash
# Registry-free deploy. The image tag still says registry.gitlab.com but nothing
# contacts GitLab — ~/server/docker-compose.yml runs this tag, and the image is
# streamed to the server over SSH (same pattern as EnnoGames/dominus).
set -e

SERVER=dan@104.236.39.83
IMAGE=registry.gitlab.com/danphi/nimp:latest
SERVICE=nimp
CONTAINER=server-nimp-1

docker build -t $IMAGE --platform linux/x86_64 .

echo "Streaming image to $SERVER (ssh -C compresses in transit)..."
docker save $IMAGE | ssh -C $SERVER "docker load"

# --force-recreate is required: the build produces a multi-arch manifest list,
# and compose's up-to-date check does not resolve through it. Without it compose
# reports the container as already running and keeps the old one even though
# docker load just replaced the image.
ssh $SERVER "cd ~/server && docker compose up -d --force-recreate $SERVICE"

# Verify the running container is actually on the image we just loaded. Both
# IDs are read ON THE SERVER — comparing against a local `docker image inspect`
# does not work (--platform makes buildx produce a multi-arch manifest list, so
# locally that returns the manifest-list digest, not the config digest the
# container reports).
echo "Verifying..."
sleep 5
EXPECTED=$(ssh $SERVER "docker inspect --format '{{.Id}}' $IMAGE")
LIVE=$(ssh $SERVER "docker inspect --format '{{.Image}}' $CONTAINER")
echo "  tag image id   : $EXPECTED"
echo "  container image: $LIVE"
if [ "$EXPECTED" != "$LIVE" ]; then
    echo "FAIL: the running container is NOT the image just deployed"
    exit 1
fi

echo -n "  https://nimp.app/ : "
if curl -sf https://nimp.app/ | grep -qi 'nimp'; then
    echo "OK"
    echo "OK: nimp.app is running the image just built"
else
    echo "FAIL (unexpected content)"
    exit 1
fi

# Prune only after a verified deploy, so a failed one leaves the old image
# recoverable. Note this clears dangling images for every project on the host.
ssh $SERVER "docker image prune -f"
