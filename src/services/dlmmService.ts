import { Connection, PublicKey } from '@solana/web3.js';
import { LiquidityBookServices, MODE } from '@saros-finance/dlmm-sdk';
import type { Position, PoolInfo, BinData } from '../types';

let dlmmInstance: LiquidityBookServices | null = null;

/**
 * Initialize DLMM SDK connection to Solana mainnet
 */
export async function initializeDLMM(
  connection: Connection,
  wallet: any
): Promise<LiquidityBookServices> {
  try {
    dlmmInstance = new LiquidityBookServices({
      mode: MODE.MAINNET,
      options: {
        rpcUrl: connection.rpcEndpoint,
      },
    });
    return dlmmInstance;
  } catch (error) {
    console.error('Failed to initialize DLMM:', error);
    throw error;
  }
}

/**
 * Get DLMM instance or throw error if not initialized
 */
function getDLMMInstance(): LiquidityBookServices {
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
    // Note: You need to provide a specific pair address or fetch all pools first
    const pools = await dlmm.fetchPoolAddresses();
    const positions: Position[] = [];

    // For demo purposes, return mock data if no real positions found
    // In production, you would iterate through pools and fetch positions
    for (const poolAddress of pools.slice(0, 3)) {
      try {
        const userPositions = await dlmm.getUserPositions({
          payer: publicKey,
          pair: new PublicKey(poolAddress),
        });

        for (const position of userPositions) {
          const positionDetails = await getPositionDetails(
            position.publicKey.toString()
          );
          if (positionDetails) {
            positions.push(positionDetails);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch positions for pool ${poolAddress}:`, error);
      }
    }

    return positions;
  } catch (error) {
    console.error('Failed to fetch user positions:', error);
    // Return empty array instead of throwing to allow UI to show empty state
    return [];
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
    const positionData = await dlmm.getPositionAccount(positionPubkey);

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
    const prices = activeBins.length > 0 ? activeBins.map(bin => bin.price) : [poolInfo.currentPrice];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate total liquidity value (simplified)
    const liquidityX = 100; // Placeholder
    const liquidityY = 100; // Placeholder

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
      Date.now() / 1000 - 86400 * 30 // 30 days ago
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
      createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
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
    const lbPair = await dlmm.getPairAccount(poolPubkey);

    if (!lbPair) {
      throw new Error('Pool not found');
    }

    // Get current active bin for price
    const activeId = lbPair.activeId || 0;
    const binStep = lbPair.binStep || 100;
    const currentPrice = getPriceFromBinId(activeId, binStep);

    // Get token info
    const tokenX = {
      symbol: 'SOL', // Would fetch from token metadata in production
      mint: lbPair.tokenXMint?.toString() || '',
      decimals: 9,
    };

    const tokenY = {
      symbol: 'USDC', // Would fetch from token metadata in production
      mint: lbPair.tokenYMint?.toString() || '',
      decimals: 6,
    };

    // Calculate total liquidity (simplified)
    const totalLiquidity = 100000; // Placeholder

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
    // Return default pool info instead of throwing
    return {
      address: poolAddress,
      tokenX: { symbol: 'SOL', mint: '', decimals: 9 },
      tokenY: { symbol: 'USDC', mint: '', decimals: 6 },
      totalLiquidity: 0,
      volume24h: 0,
      currentPrice: 100,
      feeTier: 0.3,
      activeBins: 0,
    };
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
    // Note: The actual claim fees implementation would use the SDK's methods
    // For now, this is a placeholder that demonstrates the workflow
    console.log('Claiming fees for position:', position.address);

    // In production, you would:
    // 1. Build the transaction using SDK methods
    // 2. Sign with wallet
    // 3. Send to Solana network
    // 4. Wait for confirmation

    // Placeholder signature
    return 'placeholder-transaction-signature';
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
    const lbPair = await dlmm.getPairAccount(poolPubkey);

    if (!lbPair) {
      return [];
    }

    const binStep = lbPair.binStep || 100;
    const activeId = lbPair.activeId || 0;
    const bins: BinData[] = [];

    // Get all active bins in the pool (simplified for demo)
    const range = 20; // Show 20 bins on each side

    for (let i = -range; i <= range; i++) {
      const binId = activeId + i;
      const price = getPriceFromBinId(binId, binStep);

      // In production, would fetch actual bin reserves using getBinsReserveInformation
      bins.push({
        binId,
        price,
        liquidityX: Math.random() * 100, // Demo data
        liquidityY: Math.random() * 100, // Demo data
        totalLiquidity: Math.random() * 10000, // Demo data
      });
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
