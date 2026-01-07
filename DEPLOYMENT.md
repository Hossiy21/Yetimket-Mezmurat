# 🚀 GitHub Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `orthodox-mezmur---bole-debre-salem`
3. Make it **Public** (required for GitHub Pages)
4. Don't initialize with README (we already have one)

## Step 2: Push to GitHub

```bash
# If you haven't set up Git yet
git init
git add .
git commit -m "Initial commit: Ethiopian Orthodox Mezmur Collection"

# Add your remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/orthodox-mezmur---bole-debre-salem.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under "Build and deployment", select **GitHub Actions** from the source dropdown
5. Save the settings

## Step 4: Deploy Automatically

The GitHub Actions workflow will automatically:
- Build your project
- Deploy to GitHub Pages
- Make it available at: `https://YOUR_USERNAME.github.io/orthodox-mezmur---bole-debre-salem/`

## Step 5: Manual Deployment (Optional)

If you want to deploy manually:

```bash
# Install dependencies
npm install

# Build and deploy
npm run deploy
```

## Important Notes

- **Repository Name**: Must match the `base` path in `vite.config.ts`
- **GitHub Pages**: Only works with public repositories
- **Build Time**: First deployment might take 2-3 minutes
- **Custom Domain**: You can add a custom domain in repository settings

## Troubleshooting

### 404 Errors
- Check that `base` in `vite.config.ts` matches your repository name
- Ensure GitHub Pages is enabled in settings
- Wait a few minutes for deployment to complete

### Build Failures
- Check the Actions tab in your GitHub repository
- Ensure all dependencies are installed
- Verify TypeScript compilation: `npm run type-check`

### Font/Asset Issues
- Ensure `public/` folder contains all fonts and images
- Check that paths in `index.html` are correct (use absolute paths starting with `/`)

## Next Steps

1. **Custom Domain**: Add a custom domain in GitHub Pages settings
2. **Analytics**: Add Google Analytics or similar
3. **SEO**: Update meta tags in `index.html`
4. **Performance**: Consider adding a service worker for PWA functionality

---

Your Ethiopian Orthodox Mezmur Collection is now live on GitHub Pages! 🎉
