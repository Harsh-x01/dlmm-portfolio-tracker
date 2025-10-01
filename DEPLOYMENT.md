# Deployment Guide - DLMM Portfolio Tracker

## 🚀 Quick Deployment Options

Choose your preferred platform:

1. **Vercel** (Recommended) - Easiest, automatic deployments
2. **Netlify** - Great alternative with similar features
3. **GitHub Pages** - Free option for static sites

---

## 🔷 Option 1: Deploy to Vercel (Recommended)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### Step 2: Push Code to GitHub
```bash
# In your project directory
cd dlmm-portfolio-tracker

# Make initial commit
git add .
git commit -m "Initial commit: DLMM Portfolio Tracker for Saros Contest"

# Create GitHub repository (via GitHub website or CLI)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your `dlmm-portfolio-tracker` repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

**That's it!** Vercel will:
- Install dependencies
- Build your project
- Deploy to a live URL
- Provide you with: `https://your-project.vercel.app`

### Step 4: Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Vercel Environment Variables (if needed)
If you add environment variables later:
```
Settings → Environment Variables → Add
```

---

## 🟢 Option 2: Deploy to Netlify

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### Step 2: Deploy
1. Click "Add new site" → "Import an existing project"
2. Connect to GitHub and select repository
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click "Deploy site"

**Live URL**: `https://your-project.netlify.app`

### Netlify Configuration File
Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📘 Option 3: GitHub Pages

### Step 1: Update vite.config.ts
Add base path:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/dlmm-portfolio-tracker/',
})
```

### Step 2: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Script to package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Deploy
```bash
npm run deploy
```

**Live URL**: `https://YOUR_USERNAME.github.io/dlmm-portfolio-tracker/`

---

## 🏗️ Build for Production Manually

If you want to build and host elsewhere:

```bash
# Build the project
npm run build

# Output will be in /dist folder
# Upload contents of /dist to any static hosting provider
```

### Build Checklist
- [ ] Run `npm run build`
- [ ] Check `dist/` folder is created
- [ ] Test production build locally: `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Test wallet connection
- [ ] Verify routing works

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Blank Page After Deployment
- Check browser console for errors
- Verify `base` path in vite.config.ts
- Check if all assets are loading (Network tab)

### Wallet Connection Not Working
- Ensure you're on HTTPS (required for wallet adapters)
- Check browser console for CSP errors
- Verify wallet extension is installed

### Large Bundle Size
```bash
# Analyze bundle
npm run build -- --mode production
```

---

## 📊 Post-Deployment Checklist

After successful deployment:

- [ ] Test live URL in different browsers
- [ ] Test wallet connection (Phantom & Solflare)
- [ ] Verify all pages/routes work
- [ ] Test on mobile devices
- [ ] Check loading times
- [ ] Verify all images/assets load
- [ ] Test with actual wallet/positions
- [ ] Take screenshots for documentation
- [ ] Record demo video

---

## 🎯 For Contest Submission

### URLs to Include:

1. **Live Application URL**:
   - Vercel: `https://dlmm-portfolio-tracker.vercel.app`
   - Netlify: `https://dlmm-portfolio-tracker.netlify.app`
   - GitHub Pages: `https://username.github.io/dlmm-portfolio-tracker`

2. **GitHub Repository**:
   - `https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker`

3. **Demo Video** (optional but recommended):
   - YouTube: `https://youtu.be/YOUR_VIDEO_ID`
   - Loom: `https://www.loom.com/share/YOUR_VIDEO_ID`

---

## 🌐 Update README with Live Links

After deployment, update your README.md:

```markdown
## 🚀 Live Demo

**Application**: https://your-app.vercel.app
**GitHub**: https://github.com/username/dlmm-portfolio-tracker
**Demo Video**: https://youtu.be/your-video-id
```

---

## ⚡ Continuous Deployment

With Vercel/Netlify connected to GitHub:

1. Make code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```
3. Automatic deployment triggered!
4. Check deployment status on platform dashboard

---

## 🔐 Security Best Practices

- ✅ Never commit `.env` files with sensitive data
- ✅ Use environment variables for API keys
- ✅ Enable HTTPS (automatic on Vercel/Netlify)
- ✅ Keep dependencies updated
- ✅ Review Vercel/Netlify security headers

---

## 📈 Analytics (Optional)

Add analytics to track usage:

### Vercel Analytics
```bash
npm install @vercel/analytics
```

In `src/main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// Add to your app
<Analytics />
```

---

## 🎉 You're Ready!

Your DLMM Portfolio Tracker is now live and accessible worldwide!

**Next Steps**:
1. ✅ Share live URL with friends for feedback
2. ✅ Submit to Saros contest with all URLs
3. ✅ Record demo video showcasing features
4. ✅ Monitor deployment logs for any issues
5. ✅ Celebrate! 🎊

---

## 💡 Quick Deploy Commands Reference

```bash
# Vercel
npm i -g vercel
vercel

# Netlify
npm i -g netlify-cli
netlify deploy --prod

# GitHub Pages
npm run deploy

# Build only
npm run build

# Preview production build
npm run preview
```

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Deployment: https://vitejs.dev/guide/static-deploy

---

**Happy Deploying! 🚀**
