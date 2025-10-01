# DLMM Portfolio Tracker - Setup Instructions

## Quick Start

Follow these steps to get the DLMM Portfolio Tracker running on your local machine.

### Prerequisites

- **Node.js** version 16 or higher
- **npm** (comes with Node.js) or **yarn**
- A **Solana wallet** (Phantom or Solflare browser extension)
- Active internet connection for blockchain interaction

### Step 1: Install Dependencies

```bash
cd dlmm-portfolio-tracker
npm install
```

If you encounter peer dependency issues, use:

```bash
npm install --force
```

### Step 2: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is in use).

### Step 3: Connect Your Wallet

1. Open the application in your browser
2. Click the "Connect Wallet" button in the top right
3. Select your wallet (Phantom or Solflare)
4. Approve the connection request in your wallet

### Step 4: View Your Positions

Once connected, the dashboard will automatically fetch and display your DLMM positions from Saros Finance.

## Features Available

✅ View all your DLMM positions
✅ See total portfolio value and fees earned
✅ Check position status (In Range / Out of Range)
✅ View detailed liquidity distribution charts
✅ Claim accumulated fees
✅ Refresh position data in real-time

## Configuration

### Network Selection

By default, the app connects to **Solana Mainnet**. To change networks:

**File:** `src/App.tsx`

```typescript
// Change from Mainnet to Devnet
const network = WalletAdapterNetwork.Devnet;

// Or to Testnet
const network = WalletAdapterNetwork.Testnet;
```

### RPC Endpoint

To use a custom RPC endpoint instead of the public one:

**File:** `src/App.tsx`

```typescript
// Replace this line:
const endpoint = useMemo(() => clusterApiUrl(network), [network]);

// With your custom RPC:
const endpoint = useMemo(() => 'https://your-rpc-endpoint.com', []);
```

## Building for Production

```bash
npm run build
```

The optimized production build will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

### Issue: Wallet won't connect

**Solution:**
- Ensure you have Phantom or Solflare wallet extension installed
- Make sure the wallet extension is unlocked
- Try refreshing the page and connecting again

### Issue: No positions showing up

**Solution:**
- Verify you're connected to the correct network (Mainnet/Devnet)
- Ensure you have active DLMM positions on Saros Finance
- Try clicking the "Refresh" button
- Check browser console for any error messages

### Issue: npm install fails

**Solution:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install --force`
- Ensure you're using Node.js version 16 or higher

### Issue: TypeScript errors

**Solution:**
- Run `npm install` again to ensure all dependencies are installed
- Clear the TypeScript cache: Delete `.tsbuildinfo` files
- Restart your IDE/editor

### Issue: Claim fees transaction fails

**Solution:**
- Ensure your wallet has enough SOL for transaction fees
- Check that you're connected to the correct network
- Verify that you have unclaimed fees available
- Try again after a few seconds

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check without building
npx tsc --noEmit

# Lint code
npm run lint
```

## Project Structure

```
dlmm-portfolio-tracker/
├── src/
│   ├── components/      # React components
│   ├── services/        # DLMM SDK integration
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind config
└── vite.config.ts       # Vite config
```

## Tech Stack Details

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@saros-finance/dlmm-sdk** - DLMM protocol interaction
- **@solana/web3.js** - Solana blockchain interaction
- **@solana/wallet-adapter** - Wallet connection
- **Recharts** - Charts and graphs
- **Lucide React** - Icons

## Environment Variables

Currently, the app doesn't require any environment variables. All configuration is done in the source code.

If you want to add environment variables in the future:

1. Create a `.env` file in the root directory
2. Add variables with `VITE_` prefix:
   ```
   VITE_RPC_ENDPOINT=https://your-rpc.com
   ```
3. Access in code:
   ```typescript
   const endpoint = import.meta.env.VITE_RPC_ENDPOINT;
   ```

## Testing the Application

### With Mock Data (if you don't have positions)

The app will display appropriate empty states when:
- Wallet is not connected: "Connect Your Wallet" message
- No positions found: "No Positions Found" message

### With Real Positions

1. Ensure you have created DLMM positions on Saros Finance
2. Connect your wallet
3. The dashboard will load your actual positions

## Performance Tips

- Use Chrome or Brave browser for best performance
- The app caches wallet connections for faster reconnection
- Position data refreshes automatically on wallet connection
- Use the manual refresh button to update data without reconnecting

## Security Notes

⚠️ **Important Security Considerations:**

- Never share your wallet's private keys or seed phrases
- Always verify transaction details before signing
- The app only requests wallet connection permissions (read-only data)
- Claiming fees is the only transaction that requires your approval
- Always use official wallet extensions from verified sources

## Support

For issues, questions, or suggestions:

1. Check this SETUP.md and README.md first
2. Review the Troubleshooting section above
3. Check browser console for error messages
4. Review Saros Finance documentation for DLMM specifics

## License

MIT License - See LICENSE file for details

---

**Built for Solana DeFi Contest**
Powered by Saros Finance DLMM SDK
