#!/bin/bash

# Git and GitHub CLI setup script for devcontainer

echo "🔐 Setting up Git and GitHub CLI authentication..."

# Check if GitHub CLI is authenticated
echo "🔍 Checking GitHub CLI authentication..."
if gh auth status > /dev/null 2>&1; then
    echo "✅ GitHub CLI is already authenticated"
    gh auth status
else
    echo "⚠️  GitHub CLI not authenticated"
    echo "🔑 Please run: gh auth login"
    echo "   This will open a browser for GitHub authentication"
    echo "   Choose 'HTTPS' when prompted for protocol preference"
fi

# Check if Git user is configured
echo "� Checking Git configuration..."
if git config --global user.name > /dev/null && git config --global user.email > /dev/null; then
    echo "✅ Git user configured:"
    echo "   Name: $(git config --global user.name)"
    echo "   Email: $(git config --global user.email)"
else
    echo "⚠️  Git user not configured"
    echo "📝 Please set up Git user:"
    echo "   git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
fi

# Configure Git to use GitHub CLI as credential helper
echo "🔧 Configuring Git credential helper..."
git config --global credential.helper ""
git config --global credential.https://github.com.helper "!gh auth git-credential"
git config --global credential.https://gist.github.com.helper "!gh auth git-credential"

echo ""
echo "✅ Git and GitHub setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  gh auth login  - Authenticate with GitHub"
echo "  gh auth status - Check authentication status"
echo "  git status     - Check repository status"
echo "  git add .      - Stage changes"
echo "  git commit -m  - Commit changes"
echo "  git push       - Push to remote"
