# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository: `TrueStream-GHN25/truestream`
4. Vercel will auto-detect Vite settings
5. Click "Deploy"
6. Your site will be live in ~2 minutes!

**Your site will be available at:** `https://truestream-ghn25-truestream.vercel.app` (or custom domain)

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `TrueStream-GHN25/truestream`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
3. Update vite.config.js:
   ```js
   base: '/truestream/'
   ```
4. Run: `npm run deploy`

### Option 4: Local Testing

```bash
npm run build
npm run preview
```

Then visit: `http://localhost:4173`

## Environment Variables (Optional)

If you want to use Friendli.ai or Comet Opik, add these in your deployment platform:

- `VITE_FRIENDLI_API_URL`
- `VITE_FRIENDLI_API_KEY`
- `VITE_COMET_API_KEY`
- `VITE_COMET_WORKSPACE`
- `VITE_COMET_PROJECT`

## Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder contains all static files ready to deploy

3. Upload the `dist` folder contents to any static hosting service

