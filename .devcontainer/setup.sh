#!/bin/bash

# Script to set up the Recipe Book project for development

echo "🚀 Setting up Recipe Book project..."

# Set up Git and SSH first
echo "🔐 Setting up Git and SSH..."
chmod +x .devcontainer/git-setup.sh
.devcontainer/git-setup.sh

# Set up recipe images
echo "🖼️  Setting up recipe images..."
npm run setup-images

# Optimize images
echo "⚡ Optimizing images..."
npm run optimize-images

# Convert images
echo "🔄 Converting images..."
npm run convert-images

# Convert recipes
echo "📄 Converting recipes..."
npm run convert

echo "✅ Recipe Book setup complete!"
echo ""
echo "🎯 Quick commands:"
echo "  npm run dev    - Start development server"
echo "  npm run build  - Build for production"
echo "  npm run start  - Start production server"
echo ""
echo "🌐 The dev server will be available at http://localhost:3000"
