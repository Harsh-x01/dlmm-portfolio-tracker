export interface Position {
  address: string;
  poolAddress: string;
  tokenX: TokenInfo;
  tokenY: TokenInfo;
  liquidityX: number;
  liquidityY: number;
  totalValue: number;
  feesEarned: number;
  unclaimedFees: {
    tokenX: number;
    tokenY: number;
    totalUsd: number;
  };
  activeBins: BinData[];
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  isInRange: boolean;
  createdAt: Date;
  estimatedApy: number;
}

export interface TokenInfo {
  symbol: string;
  mint: string;
  decimals: number;
  logoUri?: string;
}

export interface BinData {
  binId: number;
  price: number;
  liquidityX: number;
  liquidityY: number;
  totalLiquidity: number;
}

export interface PoolInfo {
  address: string;
  tokenX: TokenInfo;
  tokenY: TokenInfo;
  totalLiquidity: number;
  volume24h: number;
  currentPrice: number;
  feeTier: number;
  activeBins: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalFeesEarned: number;
  activePositions: number;
  averageApy: number;
}

export interface DLMMPool {
  pubkey: string;
  account: any;
}

export interface UserPosition {
  publicKey: string;
  positionData: any;
}
