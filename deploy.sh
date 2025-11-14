#!/bin/bash

# Deployment script for TrueStream
echo "🚀 Deploying TrueStream to Vercel..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Checking Vercel authentication..."
vercel whoami &> /dev/null || vercel login

# Deploy to production
echo "Building and deploying..."
vercel --prod --yes

echo "✅ Deployment complete!"
echo "Your site is now live!"

