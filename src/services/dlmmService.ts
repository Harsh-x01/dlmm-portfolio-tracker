import { Connection, PublicKey } from '@solana/web3.js';
import DLMM from '@saros-finance/dlmm-sdk';
import { Position, PoolInfo, BinData } from '../types';

let dlmmInstance: DLMM | null = null;

/**
 * Initialize DLMM SDK connection to Solana mainnet
 */
export async function initializeDLMM(
  connection: Connection,
  wallet: any
): Promise<DLMM> {
  try {
    dlmmInstance = new DLMM(connection, wallet);
    return dlmmInstance;
  } catch (error) {
    console.error('Failed to initialize DLMM:', error);
    throw error;
  }
}

/**
 * Get DLMM instance or throw error if not initialized
 */
function getDLMMInstance(): DLMM {
  if (!dlmmInstance) {
    throw new Error('DLMM not initialized. Call initializeDLMM first.');
  }
  return dlmmInstance;
}

/**
 * Fetch all positions for a wallet address
 */
export async function getUserPositions(
  walletAddress: string
): Promise<Position[]> {
  try {
    const dlmm = getDLMMInstance();
    const publicKey = new PublicKey(walletAddress);

    // Fetch user positions from DLMM SDK
    const userPositions = await dlmm.getPositionsByUserAndLbPair(publicKey);

    const positions: Position[] = [];

    for (const position of userPositions) {
      try {
        const positionDetails = await getPositionDetails(
          position.publicKey.toString()
        );
        if (positionDetails) {
          positions.push(positionDetails);
        }
      } catch (error) {
        console.error(
          `Failed to fetch details for position ${position.publicKey.toString()}:`,
          error
        );
      }
    }

    return positions;
  } catch (error) {
    console.error('Failed to fetch user positions:', error);
    throw error;
  }
}

/**
 * Get detailed position information
 */
export async function getPositionDetails(
  positionAddress: string
): Promise<Position | null> {
  try {
    const dlmm = getDLMMInstance();
    const positionPubkey = new PublicKey(positionAddress);

    // Fetch position data from SDK
    const positionData = await dlmm.getPosition(positionPubkey);

    if (!positionData) {
      return null;
    }

    // Get pool info for current price
    const poolInfo = await getPoolInfo(positionData.lbPair.toString());

    // Calculate claimable fees
    const claimableFees = await getClaimableFees(positionData);

    // Get active bins for the position
    const activeBins = await getLiquidityDistribution(
      positionData.lbPair.toString(),
      positionData
    );

    // Calculate price range
    const prices = activeBins.map(bin => bin.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate total liquidity value
    const liquidityX = positionData.positionData.totalXAmount / Math.pow(10, poolInfo.tokenX.decimals);
    const liquidityY = positionData.positionData.totalYAmount / Math.pow(10, poolInfo.tokenY.decimals);

    // Estimate value in USD (simplified - would need price oracle in production)
    const totalValue = liquidityX * poolInfo.currentPrice + liquidityY;

    // Check if position is in range
    const inRange = isPositionInRange(
      { minPrice, maxPrice },
      poolInfo.currentPrice
    );

    // Calculate estimated APY (simplified calculation)
    const estimatedApy = calculateAPY(
      claimableFees.totalUsd,
      totalValue,
      positionData.positionData.lastUpdatedAt
    );

    return {
      address: positionAddress,
      poolAddress: positionData.lbPair.toString(),
      tokenX: poolInfo.tokenX,
      tokenY: poolInfo.tokenY,
      liquidityX,
      liquidityY,
      totalValue,
      feesEarned: claimableFees.totalUsd,
      unclaimedFees: claimableFees,
      activeBins,
      minPrice,
      maxPrice,
      currentPrice: poolInfo.currentPrice,
      isInRange: inRange,
      createdAt: new Date(positionData.positionData.lastUpdatedAt * 1000),
      estimatedApy,
    };
  } catch (error) {
    console.error('Failed to fetch position details:', error);
    return null;
  }
}

/**
 * Get pool information
 */
export async function getPoolInfo(poolAddress: string): Promise<PoolInfo> {
  try {
    const dlmm = getDLMMInstance();
    const poolPubkey = new PublicKey(poolAddress);

    // Fetch pool/LB pair data
    const lbPair = await dlmm.getLbPair(poolPubkey);

    if (!lbPair) {
      throw new Error('Pool not found');
    }

    // Get current active bin for price
    const activeId = lbPair.activeId;
    const binStep = lbPair.binStep;
    const currentPrice = getPriceFromBinId(activeId, binStep);

    // Get token info
    const tokenX = {
      symbol: 'SOL', // Would fetch from token metadata in production
      mint: lbPair.tokenXMint.toString(),
      decimals: 9,
    };

    const tokenY = {
      symbol: 'USDC', // Would fetch from token metadata in production
      mint: lbPair.tokenYMint.toString(),
      decimals: 6,
    };

    // Calculate total liquidity (simplified)
    const reserveX = lbPair.reserveX.toNumber() / Math.pow(10, tokenX.decimals);
    const reserveY = lbPair.reserveY.toNumber() / Math.pow(10, tokenY.decimals);
    const totalLiquidity = reserveX * currentPrice + reserveY;

    return {
      address: poolAddress,
      tokenX,
      tokenY,
      totalLiquidity,
      volume24h: 0, // Would need historical data API
      currentPrice,
      feeTier: binStep / 100, // Convert basis points to percentage
      activeBins: 1, // Would count from bin data
    };
  } catch (error) {
    console.error('Failed to fetch pool info:', error);
    throw error;
  }
}

/**
 * Calculate claimable fees for a position
 */
export async function getClaimableFees(position: any): Promise<{
  tokenX: number;
  tokenY: number;
  totalUsd: number;
}> {
  try {
    const dlmm = getDLMMInstance();

    // Get claimable fees from position
    const feeX = position.positionData.feeX?.toNumber() || 0;
    const feeY = position.positionData.feeY?.toNumber() || 0;

    // Convert from lamports to tokens
    const feeXTokens = feeX / Math.pow(10, 9); // Assuming 9 decimals
    const feeYTokens = feeY / Math.pow(10, 6); // Assuming 6 decimals

    // Estimate USD value (would need price oracle)
    const totalUsd = feeXTokens * 100 + feeYTokens; // Placeholder calculation

    return {
      tokenX: feeXTokens,
      tokenY: feeYTokens,
      totalUsd,
    };
  } catch (error) {
    console.error('Failed to calculate claimable fees:', error);
    return { tokenX: 0, tokenY: 0, totalUsd: 0 };
  }
}

/**
 * Execute claim fees transaction
 */
export async function claimFees(
  position: any,
  wallet: any
): Promise<string> {
  try {
    const dlmm = getDLMMInstance();

    // Create claim fees transaction
    const tx = await dlmm.claimFee({
      position: new PublicKey(position.address),
      owner: wallet.publicKey,
    });

    // Sign and send transaction
    const signature = await wallet.sendTransaction(tx, dlmm.program.provider.connection);

    // Wait for confirmation
    await dlmm.program.provider.connection.confirmTransaction(signature);

    return signature;
  } catch (error) {
    console.error('Failed to claim fees:', error);
    throw error;
  }
}

/**
 * Get liquidity distribution data for charts
 */
export async function getLiquidityDistribution(
  poolAddress: string,
  position?: any
): Promise<BinData[]> {
  try {
    const dlmm = getDLMMInstance();
    const poolPubkey = new PublicKey(poolAddress);

    // Get LB pair
    const lbPair = await dlmm.getLbPair(poolPubkey);

    if (!lbPair) {
      return [];
    }

    const binStep = lbPair.binStep;
    const bins: BinData[] = [];

    // If position provided, get only position's bins
    if (position?.positionData?.positionBinData) {
      for (const binData of position.positionData.positionBinData) {
        const binId = binData.binId;
        const price = getPriceFromBinId(binId, binStep);

        bins.push({
          binId,
          price,
          liquidityX: binData.liquidityX / Math.pow(10, 9),
          liquidityY: binData.liquidityY / Math.pow(10, 6),
          totalLiquidity: (binData.liquidityX / Math.pow(10, 9)) * price + (binData.liquidityY / Math.pow(10, 6)),
        });
      }
    } else {
      // Get all active bins in the pool
      const activeId = lbPair.activeId;
      const range = 20; // Show 20 bins on each side

      for (let i = -range; i <= range; i++) {
        const binId = activeId + i;
        const price = getPriceFromBinId(binId, binStep);

        // In production, would fetch actual bin reserves
        bins.push({
          binId,
          price,
          liquidityX: 0,
          liquidityY: 0,
          totalLiquidity: 0,
        });
      }
    }

    return bins.sort((a, b) => a.binId - b.binId);
  } catch (error) {
    console.error('Failed to get liquidity distribution:', error);
    return [];
  }
}

/**
 * Calculate position health (in range or not)
 */
export function isPositionInRange(
  position: { minPrice: number; maxPrice: number },
  currentPrice: number
): boolean {
  return currentPrice >= position.minPrice && currentPrice <= position.maxPrice;
}

/**
 * Helper: Convert bin ID to price
 */
function getPriceFromBinId(binId: number, binStep: number): number {
  const basisPoint = 10000;
  return Math.pow(1 + binStep / basisPoint, binId);
}

/**
 * Helper: Calculate APY from fees
 */
function calculateAPY(
  feesEarned: number,
  totalValue: number,
  startTimestamp: number
): number {
  if (totalValue === 0) return 0;

  const now = Date.now() / 1000;
  const daysElapsed = (now - startTimestamp) / 86400;

  if (daysElapsed === 0) return 0;

  const dailyReturn = feesEarned / totalValue / daysElapsed;
  const apy = dailyReturn * 365 * 100;

  return Math.max(0, Math.min(1000, apy)); // Cap between 0-1000%
}
