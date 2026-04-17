export interface WalletBalance {
  tokenName?: string,
  name?: string,
  chain?: string,
  chainId?: number,
  balance: number,
  tokenAddress?: string,
  decimals?: number,
  symbol?: string,
  logoUrl?: string,
}