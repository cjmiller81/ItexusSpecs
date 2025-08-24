export const NETWORK_CONFIGS: Record<string, string> = {
  ETHEREUM_MAINNET: "Ethereum",
  POLYGON_MAINNET: "Polygon",
  BSC_MAINNET: "BNBChain",
  ARBITRUM_MAINNET: "Arbitrum",
  OPTIMISM_MAINNET: "Optimism",
  BASE_MAINNET: "Base",
  GNOSIS_MAINNET: "Gnosis",
  FANTOM_MAINNET: "Fantom",
  AVALANCHE_MAINNET: "Avalanche",
  ZKSYNC_MAINNET: "zkSync",
} as const;

export const getNetworkConfig = (network: string): string => {
  return NETWORK_CONFIGS[network] || "Неизвестно";
};
