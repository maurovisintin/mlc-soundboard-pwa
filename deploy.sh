#!/bin/bash

echo "MLC Soundboard - Simple Deploy"
echo "=============================="
echo ""
echo "Choose deployment method:"
echo "1) Surge.sh (simplest - just needs npm)"
echo "2) GitHub Pages (needs git repo)"
echo "3) Python local server (for testing)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Installing surge..."
        npm install -g surge
        echo "Deploying to surge.sh..."
        surge .
        ;;
    2)
        echo "For GitHub Pages:"
        echo "1. Create a new repo on GitHub"
        echo "2. Run these commands:"
        echo ""
        echo "git init"
        echo "git add ."
        echo "git commit -m 'Initial commit'"
        echo "git branch -M main"
        echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        echo "git push -u origin main"
        echo ""
        echo "3. Go to Settings > Pages on GitHub"
        echo "4. Select 'Deploy from branch' > main > root"
        ;;
    3)
        echo "Starting local server on http://localhost:8000"
        python3 -m http.server 8000
        ;;
    *)
        echo "Invalid choice"
        ;;
esac