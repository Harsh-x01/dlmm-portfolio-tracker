import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BinData } from '../types';
import { formatNumber, formatUSD } from '../utils/formatting';

interface LiquidityChartProps {
  bins: BinData[];
  currentPrice: number;
}

export function LiquidityChart({ bins, currentPrice }: LiquidityChartProps) {
  if (bins.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No liquidity data available
      </div>
    );
  }

  const chartData = bins.map((bin) => ({
    binId: bin.binId,
    price: bin.price,
    liquidity: bin.totalLiquidity,
    priceLabel: formatNumber(bin.price, 4),
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="priceLabel"
            stroke="#9CA3AF"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => formatNumber(value, 0)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#F3F4F6'
            }}
            formatter={(value: number) => [formatUSD(value), 'Liquidity']}
            labelFormatter={(label) => `Price: ${label}`}
          />
          <ReferenceLine
            x={formatNumber(currentPrice, 4)}
            stroke="#EF4444"
            strokeWidth={2}
            label={{ value: 'Current', position: 'top', fill: '#EF4444', fontSize: 12 }}
          />
          <Bar
            dataKey="liquidity"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
