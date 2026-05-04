export interface LifiChain {
  id: number;
  key: string;
  name: string;
  logoURI: string;
  coin: string;
  mainnet: boolean;
}


export interface UniversalTokenPosition {
  tokenName?: string;
  name?: string;
  symbol?: string;
  tokenAddress?: string;
  balance: number;
  balanceRaw?: string;
  decimals?: number;
  imgUrlV2?: string | null;
  logoUrl?: string | null;
  chain?: string;
  chainId?: number;
  // ...other fields
}


export interface EnrichedTokenPosition extends UniversalTokenPosition {
  chainId: number;
  lifiChain: LifiChain | null;
  isBridgeable: boolean;
}

function resolveChainId(token: UniversalTokenPosition, lifiChainMap: Map<number, LifiChain>): number | undefined {
  if (typeof token.chainId === 'number') return token.chainId;
  let networkName = '';
  let networkSlug = '';
  let networkChainId: number | undefined = undefined;
  if (typeof token.chain === 'string') {
    networkName = token.chain;
  }
  if (typeof networkChainId === 'number') return networkChainId;
  let foundId: number | undefined = undefined;
  Array.from(lifiChainMap.entries()).forEach(([id, chain]) => {
    if (
      chain.name.toLowerCase() === networkName.toLowerCase() ||
      chain.key.toLowerCase() === networkName.toLowerCase() ||
      (networkSlug && chain.key.toLowerCase() === networkSlug.toLowerCase())
    ) {
      foundId = id;
    }
  });
  if (foundId !== undefined) return foundId;
  return undefined;
}


export function enrichTokenPositions(
  tokens: UniversalTokenPosition[],
  lifiChainMap: Map<number, LifiChain>
): EnrichedTokenPosition[] {
  return tokens.map(token => {
    const chainId = resolveChainId(token, lifiChainMap);
    const lifiChain = chainId ? lifiChainMap.get(chainId) ?? null : null;
    return {
      ...token,
      chainId: chainId ?? -1,
      lifiChain,
      isBridgeable: lifiChain !== null,
    };
  });
}
