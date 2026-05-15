import type { WalletPortfolioResponse } from "../../../models/wallet/walletPortfolio";
import type { WalletsState } from "../../../slices/walletsSlice";

export const STORY_DEX_WALLET_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0";

const baseBreakdown: WalletPortfolioResponse["breakdown"] = {
  tokensPercentage: 55,
  deFiPercentage: 30,
  nftsPercentage: 15,
  networkDistribution: {},
  protocolDistribution: {},
  positionTypeDistribution: {},
};

function tokenRow(partial: {
  symbol: string;
  tokenName: string;
  network: string;
  balance: number;
  balanceUSD: number;
  price: number;
  chain?: string;
}) {
  return {
    tokenAddress: `0x${partial.symbol}000000000000000000000000000000000001`,
    symbol: partial.symbol,
    tokenName: partial.tokenName,
    name: partial.tokenName,
    balance: partial.balance,
    balanceUSD: partial.balanceUSD,
    price: partial.price,
    chain: partial.chain ?? partial.network,
    network: partial.network,
    logoUrl: "",
    decimals: 18,
    lifiChain: null as number | null,
  };
}

/** Portfolio row used by token / NFT / DeFi overview stories. */
export const storyRichDexWallet: WalletPortfolioResponse = {
  walletAddress: STORY_DEX_WALLET_ADDRESS,
  totalValueUSD: 50_000,
  lastUpdated: new Date().toISOString(),
  tokenHoldings: [
    tokenRow({
      symbol: "ETH",
      tokenName: "Ethereum",
      network: "ethereum",
      balance: 2.5,
      balanceUSD: 8_000,
      price: 3_200,
    }),
    tokenRow({
      symbol: "USDC",
      tokenName: "USD Coin",
      network: "ethereum",
      balance: 12_000,
      balanceUSD: 12_000,
      price: 1,
    }),
    tokenRow({
      symbol: "ARB",
      tokenName: "Arbitrum",
      network: "arbitrum",
      balance: 4_200,
      balanceUSD: 2_500,
      price: 0.6,
    }),
  ],
  deFiPositions: [
    {
      protocol: "Uniswap",
      positionType: "Pools",
      valueUSD: 12_500,
      network: "ethereum",
      metadata: { label: "ETH / USDC LP", appId: "uni", groupLabel: "" },
      underlyingTokens: [
        {
          tokenAddress: "0xeth",
          symbol: "ETH",
          balance: 2,
          balanceUSD: 6_000,
          price: 3_000,
          network: "ethereum",
          nestedTokens: [],
        },
        {
          tokenAddress: "0xusdc",
          symbol: "USDC",
          balance: 6_500,
          balanceUSD: 6_500,
          price: 1,
          network: "ethereum",
          nestedTokens: [],
        },
      ],
    },
    {
      protocol: "Lido",
      positionType: "SUPPLIED",
      valueUSD: 18_000,
      network: "ethereum",
      metadata: { label: "", appId: "lido", groupLabel: "stETH stake" },
      underlyingTokens: [
        {
          tokenAddress: "0xsteth",
          symbol: "stETH",
          balance: 5,
          balanceUSD: 18_000,
          price: 3_600,
          network: "ethereum",
          nestedTokens: [],
        },
      ],
    },
  ],
  nftHoldings: [
    {
      collectionName: "Storyboard Cats",
      collectionContractAddress: "0xcccccccccccccccccccccccccccccccccccccccc",
      tokenId: "42",
      estimatedValue: 1_800,
      imageUrl: { thumbnail: "https://picsum.photos/seed/story-overview-nft/128" },
      network: "ETHEREUM_MAINNET",
    },
    {
      collectionName: "Pixel Pods",
      collectionContractAddress: "0xdddddddddddddddddddddddddddddddddddddddd",
      tokenId: "7",
      estimatedValue: 950,
      imageUrl: { thumbnail: "https://picsum.photos/seed/story-overview-nft2/128" },
      network: "POLYGON_MAINNET",
    },
  ],
  breakdown: baseBreakdown,
};

export const storyEmptyTokensWallet: WalletPortfolioResponse = {
  ...storyRichDexWallet,
  tokenHoldings: [],
  totalValueUSD: 20_000,
};

export const storyNoDefiWallet: WalletPortfolioResponse = {
  ...storyRichDexWallet,
  deFiPositions: [],
};

export const storyNoNftWallet: WalletPortfolioResponse = {
  ...storyRichDexWallet,
  nftHoldings: [],
};

export function walletsStateWithPortfolio(portfolio: WalletPortfolioResponse[]): WalletsState {
  return {
    wallets: null,
    exchanges: null,
    statstatusCreatingWalletus: "idle",
    statusFetchingWallets: "idle",
    statusDeletingWallets: "idle",
    statusDeletingExchange: "idle",
    statusUpdatingWallets: "idle",
    statusFetchingExchanges: "idle",
    statusTotalWalletWorthFetching: "idle",
    statusFetchingPortfolio: "idle",
    selectedWallets: [],
    currentWalletsFilter: { isPersonal: false },
    portfolioWalletData: portfolio,
  };
}
