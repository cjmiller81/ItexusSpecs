const CHAIN_IDS = {
  "Ethereum": 1,
  "BNB Chain": 56,
  "Optimism": 10,
  "Polygon": 137,
  "Avalanche": 43114,
  "Arbitrum": 42161,
  "Base": 8453,
  "zkSync": 324,
  "Gnosis": 100,
  "Linea": 59144,
  "Sonic": 146,
  "Unichain": 130
};

export const generateOneInchLink = ({
  chainName,
  srcTokenAddress,
  dstTokenAddress,
}: {
  chainName: string;
  srcTokenAddress: string;
  dstTokenAddress: string;
}) => {
  const normalizedChainName = chainName.charAt(0).toUpperCase() + chainName.slice(1).toLowerCase();
  
  const chainId = CHAIN_IDS[normalizedChainName as keyof typeof CHAIN_IDS];
  
  if (!chainId) {
    console.warn(`Unknown chain: ${chainName} (normalized: ${normalizedChainName})`);
    return null;
  }

  return `https://app.1inch.io/swap?src=${chainId}:${srcTokenAddress}&dst=${chainId}:${dstTokenAddress}`;
};
