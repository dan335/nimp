#!/bin/bash
# Registry-free deploy (deploy.bat is a thin wrapper around this). The image
# tag still says registry.gitlab.com but nothing contacts GitLab —
# ~/server/docker-compose.yml runs this tag, and the image is streamed to the
# server over SSH (same pattern as EnnoGames/dominus).
set -e

SERVER=dan@104.236.39.83
IMAGE=registry.gitlab.com/danphi/nimp:latest
SERVICE=nimp
CONTAINER=server-nimp-1

docker build -t $IMAGE --platform linux/x86_64 .

# The whole remote side runs in ONE SSH session: the server rate-limits SSH
# connections, and several in quick succession trip the block mid-deploy.
#
# --force-recreate is required: the build produces a multi-arch manifest list,
# and compose's up-to-date check does not resolve through it. Without it compose
# reports the container as already running and keeps the old one even though
# docker load just replaced the image.
#
# The image-ID check runs ON THE SERVER — a local `docker image inspect`
# returns the manifest-list digest, not the config digest the container
# reports.
echo "Streaming image to $SERVER and deploying (single SSH session)..."
docker save $IMAGE | ssh -C $SERVER "
    set -e
    docker load
    cd ~/server
    docker compose up -d --force-recreate $SERVICE
    sleep 5
    EXPECTED=\$(docker image inspect -f '{{.Id}}' $IMAGE)
    LIVE=\$(docker inspect -f '{{.Image}}' $CONTAINER)
    echo \"  tag image id   : \$EXPECTED\"
    echo \"  container image: \$LIVE\"
    if [ \"\$EXPECTED\" != \"\$LIVE\" ]; then
        echo 'FAIL: the running container is NOT the image just deployed' >&2
        exit 1
    fi
    # Prune only after the image-ID check, so a failed deploy leaves the old
    # image recoverable. Clears dangling images for every project on the host.
    docker image prune -f
"

echo -n "  https://nimp.app/ : "
if curl -sf https://nimp.app/ | grep -qi 'nimp'; then
    echo "OK"
    echo "OK: nimp.app is running the image just built"
else
    echo "FAIL (unexpected content)"
    exit 1
fi
