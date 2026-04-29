/**
 * Fetch all tokens for a chain from LiFi API
 * @param chainId Chain ID
 */
export async function getLifiTokens(chainId: number): Promise<LifiTokenResponse[]> {
  const resp = await appAxios.get(`/api/lifi/tokens`, {
    params: { chainId },
  });

  return resp.data?.tokens?.[chainId] || [];
}
// LiFi API integration for Bridge feature
import appAxios from "@/libs/axios/axios";

export interface LifiRoutesRequest {
  fromChainId: number;
  toChainId: number;
  fromAmount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
}

export async function postLifiRoutes(params: LifiRoutesRequest) {
  const resp = await appAxios.post('/api/lifi/routes', params);
  return resp.data;
}

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

/**
 * Fetch token info from LiFi API
 * @param chainId Source chain ID
 * @param tokenKey Тicker/key ('SOL', 'USDT', 'ETH')
 */
export async function getLifiToken(chainId: number, tokenKey: string): Promise<LifiTokenResponse> {
  const resp = await appAxios.get(`/api/lifi/token`, {
    params: { chainId, tokenAddress: tokenKey },
  });
  return resp.data;
}
