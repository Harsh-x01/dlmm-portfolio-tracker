import { useState } from 'react';
import { Position } from '../types';
import { formatUSD, formatDate, formatPercent, formatNumber, formatTokenAmount } from '../utils/formatting';
import { X, RefreshCw, DollarSign, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { LiquidityChart } from './LiquidityChart';
import { PoolStats } from './PoolStats';
import { usePoolData } from '../hooks/usePoolData';
import { claimFees } from '../services/dlmmService';
import { useWallet } from '@solana/wallet-adapter-react';
import { cn } from '../utils/cn';

interface PositionDetailProps {
  position: Position;
  onClose: () => void;
  onRefresh: () => void;
}

export function PositionDetail({ position, onClose, onRefresh }: PositionDetailProps) {
  const { poolData, loading: poolLoading } = usePoolData(position.poolAddress);
  const wallet = useWallet();
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleClaimFees = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setClaimError('Please connect your wallet');
      return;
    }

    setClaiming(true);
    setClaimError(null);
    setClaimSuccess(false);

    try {
      const signature = await claimFees(position, wallet);
      console.log('Claim fees transaction:', signature);
      setClaimSuccess(true);
      setTimeout(() => {
        onRefresh();
      }, 2000);
    } catch (error) {
      console.error('Failed to claim fees:', error);
      setClaimError(error instanceof Error ? error.message : 'Failed to claim fees');
    } finally {
      setClaiming(false);
    }
  };

  const StatusIcon = position.isInRange ? CheckCircle : AlertCircle;
  const statusColor = position.isInRange ? 'text-green-500' : 'text-red-500';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {position.tokenX.symbol} / {position.tokenY.symbol}
            </h2>
            <div className={cn('flex items-center gap-2', statusColor)}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium">
                {position.isInRange ? 'In Range - Earning Fees' : 'Out of Range'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Total Value</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatUSD(position.totalValue)}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Fees Earned</span>
              </div>
              <div className="text-2xl font-bold text-green-500">
                {formatUSD(position.feesEarned)}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Est. APY</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {formatPercent(position.estimatedApy, 1)}
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Position Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Liquidity {position.tokenX.symbol}</div>
                <div className="text-white font-medium">
                  {formatTokenAmount(position.liquidityX, position.tokenX.symbol)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Liquidity {position.tokenY.symbol}</div>
                <div className="text-white font-medium">
                  {formatTokenAmount(position.liquidityY, position.tokenY.symbol)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Min Price</div>
                <div className="text-white font-medium">{formatNumber(position.minPrice, 4)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Max Price</div>
                <div className="text-white font-medium">{formatNumber(position.maxPrice, 4)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-white font-medium">{formatNumber(position.currentPrice, 4)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created
                </div>
                <div className="text-white font-medium">{formatDate(position.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Unclaimed Fees */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Unclaimed Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">{position.tokenX.symbol} Fees</div>
                <div className="text-white font-medium">
                  {formatTokenAmount(position.unclaimedFees.tokenX, position.tokenX.symbol)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">{position.tokenY.symbol} Fees</div>
                <div className="text-white font-medium">
                  {formatTokenAmount(position.unclaimedFees.tokenY, position.tokenY.symbol)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Total USD</div>
                <div className="text-green-500 font-medium text-lg">
                  {formatUSD(position.unclaimedFees.totalUsd)}
                </div>
              </div>
            </div>

            {claimSuccess && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                Fees claimed successfully!
              </div>
            )}

            {claimError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {claimError}
              </div>
            )}

            <button
              onClick={handleClaimFees}
              disabled={claiming || position.unclaimedFees.totalUsd === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              {claiming ? 'Claiming...' : 'Claim Fees'}
            </button>
          </div>

          {/* Liquidity Distribution Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Liquidity Distribution</h3>
            <LiquidityChart bins={position.activeBins} currentPrice={position.currentPrice} />
          </div>

          {/* Pool Statistics */}
          {poolData && !poolLoading && <PoolStats pool={poolData} />}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onRefresh}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
