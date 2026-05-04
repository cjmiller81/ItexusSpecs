import { Asset } from "../models/wallet"
import { WalletPortfolioResponse } from "../models/wallet/walletPortfolio"
import { filterDustTokens } from "../helpers/filterDustTokens"

export interface WalletTokensTableModel extends Asset {
  price?: number
  usdAmount?: number
  chainName: string
  chainId?: number
}

export const toTableTokensModelsFromPortfolio = (portfolioData: WalletPortfolioResponse[]): WalletTokensTableModel[] => {
  return portfolioData.flatMap(wallet => 
    wallet.tokenHoldings
      .filter(token => token.balance > 0)
      .map(token => ({
        tokenName: token.symbol,
        tokenAddress: token.tokenAddress,
        balance: token.balance,
        price: token.price,
        usdAmount: token.balanceUSD,
        chainName: token.chain,
        chainId: token.chainId,
        logoUrl: token.logoUrl,
        decimals: token.decimals,
        name: token.tokenName
      }))
  )
}

export const toTableTokensModelFromWallet = (wallet: WalletPortfolioResponse): WalletTokensTableModel[] => {
  return wallet.tokenHoldings
    .filter(token => token.balance > 0)
    .map(token => ({
      tokenName: token.symbol,
      tokenAddress: token.tokenAddress,
      balance: token.balance,
      price: token.price,
      usdAmount: token.balanceUSD,
      chainName: token.chain,
      logoUrl: token.logoUrl,
      decimals: token.decimals,
      name: token.tokenName,
      chainId: token.chainId
    }))
}

export const toTotalTokensBalancesFromPortfolio = (portfolioData: WalletPortfolioResponse[]): { symbol: string; qty: number; chain: string }[] => {
  const allTokens = portfolioData.flatMap(wallet => filterDustTokens(wallet.tokenHoldings))

  const groupedByAddressAndNetwork = new Map<string, { totalBalance: number; symbol: string; chain: string }>()
  for (const token of allTokens) {
    if (token.balance > 0) {
      const chain = token.network
      const key = `${token.tokenAddress}|${chain}`
      let value = groupedByAddressAndNetwork.get(key)
      if (!value) {
        groupedByAddressAndNetwork.set(key, { totalBalance: token.balance, symbol: token.tokenAddress, chain })
      } else {
        value.totalBalance += token.balance
      }
    }
  }

  return Array.from(groupedByAddressAndNetwork.values()).map(x => ({ symbol: x.symbol, qty: parseFloat(x.totalBalance.toFixed(4)), chain: x.chain }))
}
