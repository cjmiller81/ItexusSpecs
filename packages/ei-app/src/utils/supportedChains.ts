export const SUPPORTED_CHAINS = [
  'ethereum', 'bnb chain', 'optimism', 'polygon', 'avalanche', 
  'arbitrum', 'base', 'zksync', 'gnosis', 'linea', 'sonic', 'unichain'
] as const;

export const isSupportedChain = (chain: string): boolean => {
  return SUPPORTED_CHAINS.includes(chain.toLowerCase() as any);
};
