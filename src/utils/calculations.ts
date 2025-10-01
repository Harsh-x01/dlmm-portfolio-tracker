import { Position, PortfolioSummary } from '../types';

/**
 * Calculate portfolio summary from positions
 */
export function calculatePortfolioSummary(
  positions: Position[]
): PortfolioSummary {
  const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0);
  const totalFeesEarned = positions.reduce(
    (sum, pos) => sum + pos.feesEarned,
    0
  );
  const activePositions = positions.filter((pos) => pos.isInRange).length;

  const totalApy = positions.reduce((sum, pos) => sum + pos.estimatedApy, 0);
  const averageApy = positions.length > 0 ? totalApy / positions.length : 0;

  return {
    totalValue,
    totalFeesEarned,
    activePositions,
    averageApy,
  };
}

/**
 * Calculate position health score (0-100)
 */
export function calculatePositionHealth(position: Position): number {
  let score = 50; // Base score

  // In range: +30 points
  if (position.isInRange) {
    score += 30;
  }

  // High APY: +10 points
  if (position.estimatedApy > 20) {
    score += 10;
  } else if (position.estimatedApy > 10) {
    score += 5;
  }

  // Good liquidity distribution: +10 points
  if (position.activeBins.length > 5) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate impermanent loss
 */
export function calculateImpermanentLoss(
  initialPrice: number,
  currentPrice: number
): number {
  if (initialPrice === 0) return 0;

  const priceRatio = currentPrice / initialPrice;
  const il = 2 * Math.sqrt(priceRatio) / (1 + priceRatio) - 1;

  return il * 100; // Return as percentage
}

/**
 * Estimate daily fees for a position
 */
export function estimateDailyFees(position: Position): number {
  const daysSinceCreation =
    (Date.now() - position.createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceCreation === 0) return 0;

  return position.feesEarned / daysSinceCreation;
}

/**
 * Calculate price impact percentage
 */
export function calculatePriceImpact(
  currentPrice: number,
  targetPrice: number
): number {
  if (currentPrice === 0) return 0;

  return ((targetPrice - currentPrice) / currentPrice) * 100;
}

/**
 * Determine position status
 */
export function getPositionStatus(position: Position): {
  status: 'active' | 'warning' | 'inactive';
  message: string;
} {
  if (!position.isInRange) {
    return {
      status: 'inactive',
      message: 'Out of range - not earning fees',
    };
  }

  if (position.estimatedApy < 5) {
    return {
      status: 'warning',
      message: 'Low APY - consider rebalancing',
    };
  }

  return {
    status: 'active',
    message: 'Earning fees',
  };
}

/**
 * Calculate liquidity concentration (Herfindahl index)
 */
export function calculateLiquidityConcentration(position: Position): number {
  if (position.activeBins.length === 0) return 0;

  const totalLiquidity = position.activeBins.reduce(
    (sum, bin) => sum + bin.totalLiquidity,
    0
  );

  if (totalLiquidity === 0) return 0;

  const herfindahl = position.activeBins.reduce((sum, bin) => {
    const share = bin.totalLiquidity / totalLiquidity;
    return sum + share * share;
  }, 0);

  return herfindahl * 100; // Return as percentage
}
