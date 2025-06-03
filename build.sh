#!/bin/bash

# Step 1: Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Step 2: Move frontend to backend/static
echo "Copying build to backend..."
rm -rf backend/app/static
mkdir -p backend/app/static
cp -r frontend/dist/* backend/app/static/

echo "Build complete ✅"
