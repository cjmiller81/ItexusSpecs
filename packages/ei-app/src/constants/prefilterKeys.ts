import { PrefilterCategories, PrefilterTabs } from "@/types/filter";

export const LIQUIDITY_POOL = 'liquidity-pool';

export const PREFILTER_TAB_KEYS: { [key in PrefilterTabs]: string } = {
  [PrefilterTabs.ALL_DEFI]: "all-defi",
  [PrefilterTabs.LENDING]: "lending",
  [PrefilterTabs.STAKING_YIELD]: "staking-yield",
  [PrefilterTabs.TRADING_EXCHANGES]: "trading-exchanges",
  [PrefilterTabs.STABLECOINS]: "stablecoins",
  [PrefilterTabs.INFRASTRUCTURE_SERVICES]: "infrastructure-services",
};
export const PREFILTER_ALL_CATEGORIES_MAP: {[key in Exclude<PrefilterTabs, PrefilterTabs.ALL_DEFI>]?: string} = {
  [PrefilterTabs.STABLECOINS]: 'All Stablecoins',
  [PrefilterTabs.LENDING]: 'All Lending',
  [PrefilterTabs.STAKING_YIELD]: 'All Staking & Yield',
  [PrefilterTabs.TRADING_EXCHANGES]: 'All Trading & Exchanges',
  [PrefilterTabs.INFRASTRUCTURE_SERVICES]: 'All Infrastructure & Services',
};

export const PREFILTER_CATEGORIES_MAP: { [key in Exclude<PrefilterTabs, PrefilterTabs.ALL_DEFI>]: { [key in PrefilterCategories]?: string } } = {
  [PrefilterTabs.STABLECOINS]: {
    [PrefilterCategories.ALGO_STABLES]: 'algo-stables',
    [PrefilterCategories.DUAL_TOKEN_STABLECOIN]: 'dual-token-stablecoin',
    [PrefilterCategories.PARTIALLY_ALGORITHMIC_STABLECOIN]: 'partially-algorithmic-stablecoin',
    [PrefilterCategories.RESERVE_CURRENCY]: 'reserve-currency',
  },
  [PrefilterTabs.LENDING]: {
    [PrefilterCategories.LENDING]: 'lending',
    [PrefilterCategories.CDP]: 'cdp',
    [PrefilterCategories.NFT_LENDING]: 'nft-lending',
    [PrefilterCategories.RWA_LENDING]: 'rwa-lending',
    [PrefilterCategories.ONCHAIN_CAPITAL_ALLOCATOR]: 'onchain-capital-allocator',
    [PrefilterCategories.UNCOLLATERALIZED_LENDING]: 'uncollateralized-lending'
  },
  [PrefilterTabs.STAKING_YIELD]: {
    [PrefilterCategories.FARM]: 'farm',
    [PrefilterCategories.LEVERAGED_FARMING]: 'leveraged-farming',
    [PrefilterCategories.LIQUID_RESTAKING]: 'liquid-restaking',
    [PrefilterCategories.LIQUID_STAKING]: 'liquid-staking',
    [PrefilterCategories.RESTAKING]: 'restaking',
    [PrefilterCategories.STAKING_POOL]: 'staking-pool',
    [PrefilterCategories.YIELD]: 'yield',
    [PrefilterCategories.YIELD_AGGREGATOR]: 'yield-aggregator',
  },
  [PrefilterTabs.TRADING_EXCHANGES]: {
    [PrefilterCategories.BASIS_TRADING]: 'basis-trading',
    [PrefilterCategories.DERIVATIVES]: 'derivatives',
    [PrefilterCategories.DEX_AGGREGATOR]: 'dex-aggregator',
    [PrefilterCategories.DEXS]: 'dexs',
    [PrefilterCategories.LIQUIDITY_MANAGER]: 'liquidity-manager',
    [PrefilterCategories.OPTIONS]: 'options',
    [PrefilterCategories.OPTIONS_VAULTS]: 'options-vault',
    [PrefilterCategories.PREDICTION_MARKET]: 'prediction-market',
    [PrefilterCategories.SYNTHETICS]: 'synthetics',
  },
  [PrefilterTabs.INFRASTRUCTURE_SERVICES]: {
    [PrefilterCategories.BRIDGE]: 'bridge',
    [PrefilterCategories.CROSS_CHAIN_BRIDGE]: 'cross-chain-bridge',
    [PrefilterCategories.CHAIN]: 'chain',
    [PrefilterCategories.SERVICES]: 'services',
    [PrefilterCategories.INDEXES]: 'indexes',
    [PrefilterCategories.INSURANCE]: 'insurance',
    [PrefilterCategories.PAYMENTS]: 'payments',
    [PrefilterCategories.DOR]: 'dor',
    [PrefilterCategories.NFT_MARKETPLACE]: 'nft-marketplace',
    [PrefilterCategories.RWA]: 'rwa',
  },
};

export const CATEGORY_NAME_MAPPING: Record<string, string> = {
  "Options Vaults": "Options Vault",
  "Onchain Capital Allocation": "Onchain Capital Allocator",
  "Insurances": "Insurance",
  "Liquidity Manager": "Liquidity manager",
};
