# GitHub Repository Setup Guide

## 📋 Quick Start

Follow these steps to get your project on GitHub and ready for the contest submission.

---

## 🌐 Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Easiest)

1. Go to [github.com/new](https://github.com/new)
2. Fill in repository details:
   - **Repository name**: `dlmm-portfolio-tracker`
   - **Description**: `Portfolio analytics dashboard for DLMM positions on Saros Finance - Built for Saros SDK Contest`
   - **Visibility**: ✅ Public (required for contest)
   - **Initialize**: ❌ Do NOT check "Add README" (we already have one)
3. Click "Create repository"

### Option B: Via GitHub CLI

```bash
# Install GitHub CLI if you haven't
# Download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create dlmm-portfolio-tracker --public --source=. --remote=origin --push
```

---

## 💻 Step 2: Connect Local Repository to GitHub

Once you've created the GitHub repository, you'll see instructions. Follow these:

```bash
# Navigate to your project
cd C:\Users\harsh\Desktop\DLLM_Demo\dlmm-portfolio-tracker

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

---

## ✅ Step 3: Verify Upload

Go to your GitHub repository URL:
```
https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker
```

You should see all your files including:
- README.md
- src/ folder
- package.json
- etc.

---

## 📝 Step 4: Add Repository Topics

Make your repo discoverable:

1. Go to your repository on GitHub
2. Click the ⚙️ gear icon next to "About"
3. Add topics (tags):
   - `solana`
   - `defi`
   - `dlmm`
   - `saros-finance`
   - `portfolio-tracker`
   - `liquidity-mining`
   - `typescript`
   - `react`
   - `vite`

---

## 🎨 Step 5: Customize Repository

### Add a Banner Image (Optional but impressive)

1. Create a banner image (1280x640px):
   - Include: "DLMM Portfolio Tracker"
   - Add screenshots of your app
   - Use tool like Canva or Figma

2. Upload to repository:
   ```bash
   # Create assets folder
   mkdir .github
   # Add banner.png to .github/
   ```

3. Add to README:
   ```markdown
   ![DLMM Portfolio Tracker](.github/banner.png)
   ```

### Add Repository Description

In repository settings:
- **Description**: "Portfolio analytics dashboard for tracking DLMM positions on Saros Finance with real-time metrics, fee management, and interactive charts"
- **Website**: Add your Vercel deployment URL once deployed
- **Topics**: Add all relevant tags

---

## 📄 Step 6: Create LICENSE File

Add MIT License (required for open-source):

```bash
# Create LICENSE file
echo "MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the \"Software\"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE." > LICENSE

git add LICENSE
git commit -m "Add MIT License"
git push
```

---

## 🏷️ Step 7: Create a Release (After Deployment)

Once your app is deployed and working:

1. Go to your repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: "DLMM Portfolio Tracker - Contest Submission"
5. Description:
   ```markdown
   ## 🎉 Saros DLMM SDK Contest Submission

   Portfolio analytics dashboard for DLMM positions on Saros Finance.

   ### Features
   - Real-time position tracking
   - Interactive liquidity charts
   - Fee claiming functionality
   - Comprehensive portfolio analytics

   ### Links
   - 🌐 Live Demo: [Your Vercel URL]
   - 📺 Demo Video: [Your Video URL]
   - 📚 Documentation: [README.md](README.md)

   Built with @saros-finance/dlmm-sdk
   ```
6. Click "Publish release"

---

## 📊 Step 8: Add GitHub Actions (Optional)

Automate build checks:

Create `.github/workflows/build.yml`:

```yaml
name: Build Check

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
```

---

## 🔗 Step 9: Update README with Links

After deployment, update README.md with live links:

```markdown
## 🚀 Live Demo

- **Application**: https://dlmm-portfolio-tracker.vercel.app
- **GitHub**: https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker
- **Demo Video**: https://youtu.be/YOUR_VIDEO_ID

## 🏆 Contest Submission

This project is submitted for the Saros DLMM SDK Contest.
[View Contest Details](https://earn.superteam.fun/listings/bounty/saros-dlmm-sdk-demo-contest/)
```

---

## ✨ Step 10: Polish Your Repository

### Create CONTRIBUTING.md (Shows professionalism)

```markdown
# Contributing to DLMM Portfolio Tracker

Thank you for your interest! This project welcomes contributions.

## How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Development Setup
See [SETUP.md](SETUP.md) for development instructions.

## Code Style
- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic
- Update documentation as needed
```

### Add Code of Conduct

GitHub provides templates. Go to:
- Repository Settings → Add file → Create new file
- Name it: `CODE_OF_CONDUCT.md`
- GitHub will offer templates - choose "Contributor Covenant"

---

## 📱 Step 11: Create Social Media Preview

1. Go to Repository Settings
2. Scroll to "Social Preview"
3. Upload an image (1280x640px recommended)
4. This appears when sharing your repo link

---

## 🎯 Final GitHub Checklist

Before submitting to contest:

- [ ] Repository is public
- [ ] README.md is complete with:
  - [ ] Project description
  - [ ] Features list
  - [ ] Installation instructions
  - [ ] Live demo link
  - [ ] Demo video link
  - [ ] Screenshots
- [ ] LICENSE file added (MIT)
- [ ] All code is pushed
- [ ] Repository description set
- [ ] Topics/tags added
- [ ] .gitignore properly configured
- [ ] No node_modules in repo
- [ ] Working GitHub Actions (optional)
- [ ] Release created
- [ ] Professional README formatting

---

## 🔍 Common Issues

### Problem: Large files won't upload
**Solution**: Make sure node_modules is in .gitignore
```bash
# Remove if accidentally committed
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

### Problem: Can't push to GitHub
**Solution**: Check remote URL
```bash
git remote -v
# If wrong, update:
git remote set-url origin https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker.git
```

### Problem: Authentication failed
**Solution**: Use Personal Access Token
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

---

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/book/en/v2
- GitHub CLI: https://cli.github.com/manual/

---

## 🎉 You're Done!

Your project is now:
- ✅ On GitHub
- ✅ Properly documented
- ✅ Ready for the contest
- ✅ Open for contributions

**Repository URL format**:
```
https://github.com/YOUR_USERNAME/dlmm-portfolio-tracker
```

Share this link in your contest submission! 🚀

---

**Pro Tip**: Star your own repository and share it on Twitter/Discord to get more visibility! 🌟
