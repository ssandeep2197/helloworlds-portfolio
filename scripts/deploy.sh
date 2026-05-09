#!/usr/bin/env bash
# Build, ship to VPS, and roll out the portfolio on k3s.
set -euo pipefail

HOST="root@193.203.162.32"
REMOTE_DIR="/root/helloworlds-portfolio"
IMAGE_NAME="helloworlds-portfolio"
NAMESPACE="portfolio"
DEPLOYMENT="portfolio-web"

cd "$(dirname "$0")/.."

TAG="v$(date +%Y%m%d-%H%M%S)"
echo "==> tag: $TAG"

echo "==> [1/5] building dist/ locally"
npm run build

echo "==> [2/5] syncing build context to $HOST:$REMOTE_DIR"
ssh "$HOST" "mkdir -p $REMOTE_DIR"
rsync -az --delete \
  --exclude=node_modules --exclude=.git --exclude=.github \
  --exclude=src --exclude=public --exclude=scripts \
  --exclude='*.log' --exclude=.DS_Store --exclude=deploy/.tag \
  ./ "$HOST:$REMOTE_DIR/"

echo "==> [3/5] building image on server"
ssh "$HOST" "cd $REMOTE_DIR && docker build -t $IMAGE_NAME:$TAG -t $IMAGE_NAME:latest ."

echo "==> [4/5] importing image into k3s"
ssh "$HOST" "docker save $IMAGE_NAME:$TAG $IMAGE_NAME:latest | k3s ctr images import -"

echo "==> [5/5] applying manifests + waiting for rollout"
sed "s/__TAG__/$TAG/g" deploy/k8s.yaml | ssh "$HOST" "kubectl apply -f -"
ssh "$HOST" "kubectl -n $NAMESPACE rollout status deploy/$DEPLOYMENT --timeout=120s"

echo "==> live at https://helloworlds.co.in"
