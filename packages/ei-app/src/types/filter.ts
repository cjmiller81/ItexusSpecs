export enum PrefilterTabs {
  ALL_DEFI = "All DeFi",
  LENDING = "Lending",
  STAKING_YIELD = "Staking & Yield",
  TRADING_EXCHANGES = "Trading & Exchanges",
  STABLECOINS = "Stablecoins",
  INFRASTRUCTURE_SERVICES = "Infrastructure & Services",
};

export enum PrefilterCategories {
  // ALL_STABLECOINS_CATEGORIES
  ALGO_STABLES = "Algo-Stables",
  DUAL_TOKEN_STABLECOIN = "Dual-Token Stablecoin",
  PARTIALLY_ALGORITHMIC_STABLECOIN = "Partially Algorithmic Stablecoin",
  RESERVE_CURRENCY = "Reserve Currency",

  // ALL_LENDING_CATEGORIES
  LENDING = "Lending",
  CDP = "CDP",
  NFT_LENDING = "NFT Lending",
  RWA_LENDING = "RWA Lending",
  ONCHAIN_CAPITAL_ALLOCATOR = "Onchain Capital Allocator",
  UNCOLLATERALIZED_LENDING = "Uncollateralized Lending",

  // ALL_STAKING_YIELD_CATEGORIES
  FARM = "Farm",
  LEVERAGED_FARMING = "Leveraged Farming",
  LIQUID_RESTAKING = "Liquid Restaking",
  LIQUID_STAKING = "Liquid Staking",
  RESTAKING = "Restaking",
  STAKING_POOL = "Staking Pool",
  YIELD = "Yield",
  YIELD_AGGREGATOR = "Yield Aggregator",

  // ALL_TRADING_EXCHANGE_CATEGORIES
  BASIS_TRADING = "Basis Trading",
  DERIVATIVES = "Derivatives",
  DEX_AGGREGATOR = "DEX Aggregator",
  DEXS = "Dexs",
  LIQUIDITY_MANAGER = "Liquidity manager",
  OPTIONS = "Options",
  OPTIONS_VAULTS = "Options Vaults",
  PREDICTION_MARKET = "Prediction Market",
  SYNTHETICS = "Synthetics",

  // ALL_INFRASTRUCTURE_SERVICES_CATEGORIES
  BRIDGE = "Bridge",
  CROSS_CHAIN_BRIDGE = "Cross Chain Bridge",
  CHAIN = "Chain",
  SERVICES = "Services",
  INDEXES = "Indexes",
  INSURANCE = "Insurances",
  PAYMENTS = "Payments",
  DOR = "DOR",
  NFT_MARKETPLACE = "NFT Marketplace",
  RWA = "RWA",
}

export type CategoryFilterType = {
  tab: `${PrefilterTabs}` | undefined;
  category: `${PrefilterCategories}` | string | undefined; // is it okay to leave string?
};
