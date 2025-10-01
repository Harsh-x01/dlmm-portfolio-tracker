import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePositions } from '../hooks/usePositions';
import { Position } from '../types';
import { PositionCard } from './PositionCard';
import { PositionDetail } from './PositionDetail';
import { calculatePortfolioSummary } from '../utils/calculations';
import { formatUSD, formatPercent } from '../utils/formatting';
import { Wallet, TrendingUp, DollarSign, PieChart, RefreshCw, Loader2 } from 'lucide-react';

export function Dashboard() {
  const { connected } = useWallet();
  const { positions, loading, error, refreshPositions } = usePositions();
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Wallet className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-400 max-w-md">
          Connect your Solana wallet to view your DLMM liquidity positions and track your portfolio.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading your positions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={refreshPositions}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <PieChart className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          No Positions Found
        </h2>
        <p className="text-gray-400 max-w-md">
          You don't have any DLMM liquidity positions yet. Create a position on Saros to get started.
        </p>
      </div>
    );
  }

  const summary = calculatePortfolioSummary(positions);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Portfolio Value</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatUSD(summary.totalValue)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 border border-green-500">
          <div className="flex items-center gap-2 text-green-100 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total Fees Earned</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatUSD(summary.totalFeesEarned)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 border border-purple-500">
          <div className="flex items-center gap-2 text-purple-100 mb-2">
            <PieChart className="w-5 h-5" />
            <span className="text-sm font-medium">Active Positions</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {summary.activePositions} / {positions.length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 border border-orange-500">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Average APY</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatPercent(summary.averageApy, 1)}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Positions</h2>
        <button
          onClick={refreshPositions}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((position) => (
          <PositionCard
            key={position.address}
            position={position}
            onClick={() => setSelectedPosition(position)}
          />
        ))}
      </div>

      {/* Position Detail Modal */}
      {selectedPosition && (
        <PositionDetail
          position={selectedPosition}
          onClose={() => setSelectedPosition(null)}
          onRefresh={() => {
            refreshPositions();
            setSelectedPosition(null);
          }}
        />
      )}
    </div>
  );
}
