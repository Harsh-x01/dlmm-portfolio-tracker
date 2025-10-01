# DLMM Portfolio Tracker

A React TypeScript application for tracking and managing DLMM (Dynamic Liquidity Market Maker) positions on Solana, powered by Saros Finance.

## Features

### 🔐 Wallet Connection
- Seamless integration with Phantom and Solflare wallets
- Auto-connect functionality
- Wallet address display with shortened format

### 📊 Portfolio Dashboard
- Real-time portfolio overview with key metrics:
  - Total Portfolio Value (USD)
  - Total Fees Earned
  - Active Positions Count
  - Average APY across positions
- Grid view of all positions
- Interactive position cards with status indicators

### 📈 Position Details
- Comprehensive position information:
  - Liquidity distribution chart (bar chart of bins)
  - Current price marker
  - Position price range (min/max)
  - Total liquidity value breakdown
  - Unclaimed fees per token
  - Position creation date
  - Estimated APY calculation
- **Claim Fees** - Execute on-chain transaction to claim fees
- **Refresh Data** - Real-time position data updates

### 📉 Pool Statistics
- Pool total liquidity
- 24-hour trading volume
- Current price
- Fee tier
- Active bins count

### 🎨 User Experience
- Loading states with skeletons
- Empty state messages
- Smooth transitions and animations
- Responsive design for mobile and desktop
- Dark mode UI

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **@saros-finance/dlmm-sdk** - DLMM protocol integration
- **@solana/web3.js** - Solana blockchain interaction
- **@solana/wallet-adapter** - Wallet connection
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Installation

```bash
# Clone the repository
cd dlmm-portfolio-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main portfolio view with summary cards
│   ├── PositionCard.tsx       # Individual position card component
│   ├── PositionDetail.tsx     # Detailed position modal view
│   ├── PoolStats.tsx          # Pool information display
│   ├── WalletButton.tsx       # Wallet connection button
│   └── LiquidityChart.tsx     # Bin distribution chart
├── services/
│   └── dlmmService.ts         # DLMM SDK integration layer
├── hooks/
│   ├── usePositions.ts        # Custom hook for positions data
│   └── usePoolData.ts         # Custom hook for pool data
├── utils/
│   ├── formatting.ts          # Number, date, address formatting
│   ├── calculations.ts        # APY and portfolio calculations
│   └── cn.ts                  # Tailwind class merging utility
├── types/
│   └── index.ts               # TypeScript type definitions
└── App.tsx                    # Main app with wallet providers
```

## Key Features Implementation

### DLMM SDK Integration

The application uses the Saros DLMM SDK for all blockchain interactions:

- **initializeDLMM()** - Initialize SDK connection to Solana mainnet
- **getUserPositions()** - Fetch all positions for a wallet
- **getPositionDetails()** - Get detailed position information
- **getPoolInfo()** - Retrieve pool statistics
- **getClaimableFees()** - Calculate unclaimed fees
- **claimFees()** - Execute claim transaction
- **getLiquidityDistribution()** - Get bin distribution data
- **isPositionInRange()** - Check if position is earning fees

### Position States

Positions are classified as:
- **In Range** (🟢) - Currently earning fees
- **Out of Range** (🔴) - Not earning fees, needs rebalancing

### APY Calculation

APY is estimated based on:
- Total fees earned since position creation
- Current liquidity value
- Time elapsed since position creation
- Annualized to 365 days

### Real-time Updates

- Positions refresh on wallet connection
- Manual refresh button available
- Auto-refresh after claiming fees
- Loading states during data fetches

## Environment Setup

The app connects to Solana mainnet by default. To use devnet or testnet:

```typescript
// In App.tsx, change:
const network = WalletAdapterNetwork.Mainnet;
// To:
const network = WalletAdapterNetwork.Devnet;
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

## Requirements

- Node.js 16+
- npm or yarn
- Solana wallet (Phantom or Solflare)
- Active DLMM positions on Saros Finance

## Future Enhancements

- [ ] Historical performance charts
- [ ] Position comparison tools
- [ ] Impermanent loss calculator
- [ ] Price alerts and notifications
- [ ] CSV export for tax reporting
- [ ] Multi-chain support
- [ ] Advanced filtering and sorting
- [ ] Position creation interface

## License

MIT

## Contest Submission

Built for the Solana DeFi Contest as a comprehensive DLMM portfolio management tool.
