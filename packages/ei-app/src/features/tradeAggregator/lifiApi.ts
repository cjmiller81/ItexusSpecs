import appAxios from "@/libs/axios/axios";

const tokensCache: Record<number, LifiTokenResponse[]> = {};

export interface LifiTokenResponse {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD?: string;
  marketCapUSD?: number;
  volumeUSD24H?: number;
  tags?: string[];
}

export interface LifiRoutesRequest {
  fromChainId: number;
  toChainId: number;
  fromAmount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export async function postLifiRoutes(params: LifiRoutesRequest) {
  const resp = await appAxios.post(`/api/lifi/routes`, params);
  return resp.data;
}

/**
 * Fetch all tokens for a chain from LiFi API
 * @param chainId Chain ID
 */
export async function getLifiTokens(chainId: number): Promise<LifiTokenResponse[]> {
  if (chainId <= 0) {
    return [];
  }

  if (tokensCache[chainId]) {
    return tokensCache[chainId];
  }

  try {
    const resp = await appAxios.get(`/api/lifi/tokens`, {
      params: { chainId },
    });

    const tokensByChain = resp.data?.tokens || {};
    const tokens = tokensByChain[chainId] || tokensByChain[chainId.toString()] || [];
    tokensCache[chainId] = tokens;
    return tokens;
  } catch (e) {
    console.error(`Error fetching tokens for chain ${chainId}:`, e);
    return [];
  }
}

/**
 * Fetch token info from LiFi API list (cached)
 * @param chainId Source chain ID
 * @param tokenKey Ticker/symbol or address
 */
export async function getLifiToken(chainId: number, tokenKey: string): Promise<LifiTokenResponse | null> {
  if (!tokenKey) return null;

  // Search in cache only. No redundant individual requests per user requirements.
  const cachedTokens = await getLifiTokens(chainId);
  const found = cachedTokens.find(t => 
    t.symbol?.toLowerCase() === tokenKey.toLowerCase() || 
    t.address?.toLowerCase() === tokenKey.toLowerCase() ||
    t.name?.toLowerCase() === tokenKey.toLowerCase()
  );

  return found || null;
}
