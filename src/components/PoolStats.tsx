import { PoolInfo } from '../types';
import { formatUSD, formatNumber, formatCompactNumber } from '../utils/formatting';
import { BarChart3, TrendingUp, Droplets, Percent } from 'lucide-react';

interface PoolStatsProps {
  pool: PoolInfo;
}

export function PoolStats({ pool }: PoolStatsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        Pool Statistics
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Total Liquidity</span>
          </div>
          <span className="text-white font-medium">
            {formatUSD(pool.totalLiquidity)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">24h Volume</span>
          </div>
          <span className="text-white font-medium">
            {formatUSD(pool.volume24h)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Current Price</span>
          </div>
          <span className="text-white font-medium">
            {formatNumber(pool.currentPrice, 4)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Percent className="w-4 h-4" />
            <span className="text-sm">Fee Tier</span>
          </div>
          <span className="text-white font-medium">
            {pool.feeTier}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Active Bins</span>
          </div>
          <span className="text-white font-medium">
            {formatNumber(pool.activeBins, 0)}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Pool Pair</span>
          <span className="text-white font-medium">
            {pool.tokenX.symbol} / {pool.tokenY.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}
