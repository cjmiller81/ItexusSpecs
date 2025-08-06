export interface WalletPortfolioResponse {
  walletAddress: string;
  totalValueUSD: number;
  lastUpdated: string;
  tokenHoldings: TokenHolding[];
  deFiPositions: DeFiPosition[];
  nftHoldings: NftHolding[];
  breakdown: Breakdown;
}

export interface TokenHolding {
  tokenAddress: string;
  symbol: string;
  name: string;
  balance: number;
  balanceUSD: number;
  price: number;
  network: string;
  logoUrl: string;
  decimals: number;
}

export interface DeFiPosition {
  protocol: string;
  positionType: string;
  valueUSD: number;
  network: string;
  underlyingTokens: UnderlyingToken[];
  metadata: Metadata;
}

export interface UnderlyingToken {
  tokenAddress: string;
  symbol: string;
  balance: number;
  balanceUSD: number;
  price: number;
  network: string;
  nestedTokens: string[];
}

export interface Metadata {
  label: string;
  appId: string;
  groupLabel: string;
}

export interface NftHolding {
  collectionName: string;
  collectionContractAddress: string;
  tokenId: string;
  estimatedValue: number;
  imageUrl: {
    [key: string]: string;
  };
  network: string;
}

export interface Breakdown {
  tokensPercentage: number;
  deFiPercentage: number;
  nftsPercentage: number;
  networkDistribution: {
    [key: string]: number;
  };
  protocolDistribution: {
    [key: string]: number;
  };
  positionTypeDistribution: {
    [key: string]: number;
  };
}
