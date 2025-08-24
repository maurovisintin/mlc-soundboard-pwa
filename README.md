# MLC Soundboard SPA

A simple web-based soundboard for Mountain Lair Camp sounds.

## Hosting Options

### Option 1: GitHub Pages (Simplest & Free)
1. Push this folder to a GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main → /mlc-soundboard-spa
4. Your site will be available at: `https://[username].github.io/[repo-name]/`

### Option 2: Netlify Drop (No Git Required)
1. Visit https://app.netlify.com/drop
2. Drag and drop the `mlc-soundboard-spa` folder
3. Get instant URL (free with Netlify subdomain)

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the mlc-soundboard-spa directory
3. Follow prompts for instant deployment

### Option 4: Surge.sh (Simplest CLI)
```bash
npm install -g surge
cd mlc-soundboard-spa
surge
```

## Local Testing
Simply open `index.html` in a web browser.

## Features
- Loads sounds from Azure Blob Storage
- Caches sound list locally
- Play/pause functionality
- Mobile responsive design