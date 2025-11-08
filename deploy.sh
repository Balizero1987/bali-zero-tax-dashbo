#!/bin/bash
set -e

echo "🚀 Deploying Nuzantara Backend..."

cd apps/backend-ts

echo "✓ Building..."
npm run build

echo "✓ Deploying to Fly.io..."
flyctl deploy --app nuzantara-backend

echo "✓ Checking health..."
sleep 10
curl https://nuzantara-backend.fly.dev/health

echo ""
echo "✅ Deploy complete!"
