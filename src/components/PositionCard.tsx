import { Position } from '../types';
import { formatUSD, formatPercent, formatTokenAmount } from '../utils/formatting';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface PositionCardProps {
  position: Position;
  onClick: () => void;
}

export function PositionCard({ position, onClick }: PositionCardProps) {
  const statusConfig = {
    inRange: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      label: 'In Range',
    },
    outOfRange: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      label: 'Out of Range',
    },
  };

  const status = position.isInRange
    ? statusConfig.inRange
    : statusConfig.outOfRange;
  const StatusIcon = status.icon;

  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 text-left"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {position.tokenX.symbol} / {position.tokenY.symbol}
          </h3>
          <div className={cn('flex items-center gap-1.5 text-sm', status.color)}>
            <StatusIcon className="w-4 h-4" />
            <span>{status.label}</span>
          </div>
        </div>
        <div className={cn('p-2 rounded-lg', status.bg)}>
          <TrendingUp className={cn('w-5 h-5', status.color)} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Value</span>
          <span className="text-white font-medium">
            {formatUSD(position.totalValue)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Fees Earned</span>
          <span className="text-green-500 font-medium">
            {formatUSD(position.feesEarned)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Est. APY</span>
          <span className="text-blue-500 font-medium">
            {formatPercent(position.estimatedApy, 1)}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-500 mb-1">Liquidity X</div>
            <div className="text-gray-300 font-medium">
              {formatTokenAmount(position.liquidityX, position.tokenX.symbol, 2)}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Liquidity Y</div>
            <div className="text-gray-300 font-medium">
              {formatTokenAmount(position.liquidityY, position.tokenY.symbol, 2)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
