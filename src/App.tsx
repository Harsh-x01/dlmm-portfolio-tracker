import { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet, TrendingUp, DollarSign, PieChart, PlayCircle, XCircle } from 'lucide-react';

import '@solana/wallet-adapter-react-ui/styles.css';

// Demo data for presentation
const DEMO_POSITIONS = [
  {
    id: '1',
    pool: 'SOL/USDC',
    totalValue: 12450.50,
    feesEarned: 234.75,
    apy: 42.5,
    status: 'In Range',
    liquidityX: 50.25,
    liquidityY: 2100.00,
  },
  {
    id: '2',
    pool: 'USDT/USDC',
    totalValue: 8920.00,
    feesEarned: 156.30,
    apy: 28.3,
    status: 'In Range',
    liquidityX: 4460.00,
    liquidityY: 4460.00,
  },
  {
    id: '3',
    pool: 'mSOL/SOL',
    totalValue: 6230.80,
    feesEarned: 89.45,
    apy: 35.7,
    status: 'Out of Range',
    liquidityX: 25.10,
    liquidityY: 1.05,
  },
];

function AppContent() {
  const { connected, publicKey } = useWallet();
  const [demoMode, setDemoMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DLMM Portfolio Tracker</h1>
                <p className="text-xs text-gray-400">Powered by Saros Finance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Demo Mode Toggle */}
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  demoMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {demoMode ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Exit Demo</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Demo Mode</span>
                  </>
                )}
              </button>

              {connected && publicKey && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">
                    {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                  </span>
                </div>
              )}
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !px-6 !py-2 !text-sm !font-medium transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!connected && !demoMode ? (
          // Not Connected State
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <Wallet className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400 max-w-md mb-6">
              Connect your Solana wallet to view your DLMM liquidity positions and track your portfolio.
            </p>
            <button
              onClick={() => setDemoMode(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Try Demo Mode
            </button>
          </div>
        ) : (
          // Connected State - Demo Dashboard
          <div className="space-y-6">
            {demoMode && (
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400">
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-medium">Demo Mode Active</span>
                  <span className="text-gray-400 text-sm">- Showing sample portfolio data</span>
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500">
                <div className="flex items-center gap-2 text-blue-100 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Portfolio Value</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  ${demoMode ? '27,601.30' : '0.00'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 border border-green-500">
                <div className="flex items-center gap-2 text-green-100 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Fees Earned</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  ${demoMode ? '480.50' : '0.00'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 border border-purple-500">
                <div className="flex items-center gap-2 text-purple-100 mb-2">
                  <PieChart className="w-5 h-5" />
                  <span className="text-sm font-medium">Active Positions</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {demoMode ? '3' : '0'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 border border-orange-500">
                <div className="flex items-center gap-2 text-orange-100 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Average APY</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {demoMode ? '35.5%' : '0.00%'}
                </div>
              </div>
            </div>

            {/* Positions Grid */}
            {demoMode ? (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Your Positions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {DEMO_POSITIONS.map((position) => (
                    <div key={position.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{position.pool}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          position.status === 'In Range'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {position.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Value</span>
                          <span className="text-white font-semibold">${position.totalValue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Fees Earned</span>
                          <span className="text-green-400 font-semibold">${position.feesEarned.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">APY</span>
                          <span className="text-blue-400 font-semibold">{position.apy}%</span>
                        </div>

                        <div className="pt-3 border-t border-gray-700">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-500 mb-1">{position.pool.split('/')[0]}</div>
                              <div className="text-white font-medium">{position.liquidityX.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">{position.pool.split('/')[1]}</div>
                              <div className="text-white font-medium">{position.liquidityY.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>

                        <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                          Claim Fees
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // No Positions State
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
                <PieChart className="w-16 h-16 text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  No Positions Found
                </h2>
                <p className="text-gray-400 max-w-md mb-6">
                  You don't have any DLMM liquidity positions yet. Create a position on Saros Finance to get started.
                </p>
                <a
                  href="https://saros.finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Visit Saros Finance
                </a>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">About DLMM Portfolio Tracker</h3>
              <p className="text-gray-400 text-sm">
                This application tracks your Dynamic Liquidity Market Maker (DLMM) positions on Saros Finance.
                Connect your wallet to view positions, track fees, monitor APY, and manage your liquidity across multiple pools.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-blue-400 font-medium mb-1">✓ Real-time Tracking</div>
                  <div className="text-gray-500">Monitor your positions 24/7</div>
                </div>
                <div>
                  <div className="text-blue-400 font-medium mb-1">✓ Fee Management</div>
                  <div className="text-gray-500">Claim fees directly from the app</div>
                </div>
                <div>
                  <div className="text-blue-400 font-medium mb-1">✓ Analytics</div>
                  <div className="text-gray-500">View charts and performance metrics</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Built for Solana DeFi Contest</p>
            <p className="mt-1">Track and manage your DLMM liquidity positions</p>
            <p className="mt-2 text-xs text-gray-500">
              Note: This is a demo version. DLMM SDK integration requires additional configuration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
