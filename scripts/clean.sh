#!/bin/bash

# Clean script to remove all build-related files and directories
# Use this script to get a fresh start or when switching branches

echo "🧹 Cleaning build-related files and directories..."

# Stop any running Next.js processes
echo "🛑 Stopping any running Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "next build" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true

# Remove Next.js build directories
echo "🗑️  Removing .next directory..."
rm -rf .next

echo "🗑️  Removing out directory..."
rm -rf out

# Remove dependency directories
echo "🗑️  Removing node_modules..."
rm -rf node_modules

# Remove lock files from other package managers (keep package-lock.json)
echo "🗑️  Removing lock files from other package managers..."
rm -f yarn.lock
rm -f pnpm-lock.yaml
# Note: Keeping package-lock.json as it should be committed

# Remove TypeScript build cache
echo "🗑️  Removing TypeScript build cache..."
rm -rf .tsbuildinfo
rm -rf tsconfig.tsbuildinfo

# Remove ESLint cache
echo "🗑️  Removing ESLint cache..."
rm -rf .eslintcache

# Remove any log files
echo "🗑️  Removing log files..."
rm -f *.log
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*

# Remove any temporary files
echo "🗑️  Removing temporary files..."
rm -rf .tmp
rm -rf temp
rm -rf tmp

# Remove OS generated files
echo "🗑️  Removing OS generated files..."
rm -f .DS_Store
rm -f Thumbs.db

# Remove editor temporary files
echo "🗑️  Removing editor temporary files..."
rm -f *~
rm -f *.swp
rm -f *.swo

echo ""
echo "✅ Clean completed! All build-related files have been removed."
echo ""
echo "To get back up and running:"
echo "1. npm install       # Reinstall dependencies"
echo "2. npm run build     # Build the project"
echo "3. npm run dev       # Start development server"
echo ""
