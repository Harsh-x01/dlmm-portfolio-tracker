# Installation Instructions - DLMM Portfolio Tracker

## Prerequisites

- Node.js 16+ installed
- npm (comes with Node.js)
- A Solana wallet (Phantom or Solflare browser extension)

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd dlmm-portfolio-tracker
```

### Step 2: Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

**Note:** If you encounter peer dependency warnings, you can safely ignore them or use:

```bash
npm install --legacy-peer-deps
```

### Step 3: Verify Installation

Check that all dependencies are installed:

```bash
npm list --depth=0
```

You should see:
- @saros-finance/dlmm-sdk
- @solana/web3.js
- @solana/wallet-adapter-react
- @solana/wallet-adapter-react-ui
- @solana/wallet-adapter-wallets
- recharts
- lucide-react
- clsx
- tailwind-merge
- And more...

### Step 4: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Step 5: Open in Browser

Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Step 6: Connect Your Wallet

1. Click "Connect Wallet" in the top right
2. Select your wallet (Phantom or Solflare)
3. Approve the connection

### Step 7: View Your Positions

Your DLMM positions will automatically load and display on the dashboard.

## Troubleshooting

### Issue: npm install fails

**Solution 1:** Clear cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2:** Use legacy peer deps
```bash
npm install --legacy-peer-deps
```

**Solution 3:** Use force flag
```bash
npm install --force
```

### Issue: Port 5173 already in use

**Solution:** The dev server will automatically use the next available port. Check the terminal output for the actual port number.

Or specify a different port:
```bash
npm run dev -- --port 3000
```

### Issue: TypeScript errors

**Solution:**
```bash
# Delete TypeScript cache
rm -rf node_modules/.vite
# Restart dev server
npm run dev
```

### Issue: Tailwind styles not loading

**Solution:**
1. Verify `tailwind.config.js` and `postcss.config.js` exist
2. Restart the dev server
3. Clear browser cache

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Next Steps

After installation:

1. ✅ Connect your Solana wallet
2. ✅ View your DLMM positions
3. ✅ Check portfolio metrics
4. ✅ View position details
5. ✅ Claim fees

## Need Help?

- Check `SETUP.md` for detailed configuration options
- Check `README.md` for feature documentation
- Review browser console for error messages

## Quick Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Lint code
npm run lint
```

---

**Ready to go!** 🚀

Once `npm install` completes successfully, you can start the dev server and begin tracking your DLMM positions.
