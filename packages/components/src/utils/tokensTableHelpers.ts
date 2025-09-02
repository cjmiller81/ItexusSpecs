import { Asset } from "../models/wallet"
import { WalletPortfolioResponse } from "../models/wallet/walletPortfolio"

export interface WalletTokensTableModel extends Asset {
  price?: number
  usdAmount?: number
  chainName: string
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
        chainName: token.network,
        logoUrl: token.logoUrl,
        decimals: token.decimals,
        name: token.name
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
      chainName: token.network,
      logoUrl: token.logoUrl,
      decimals: token.decimals,
      name: token.name
    }))
}

export const toTotalTokensBalancesFromPortfolio = (portfolioData: WalletPortfolioResponse[]): { symbol: string; qty: number }[] => {
  const allTokens = portfolioData.flatMap(wallet => wallet.tokenHoldings)

  const groupedSymbols = new Map<string, { totalBalance: number }>()
  for (const token of allTokens) {
    if (token.balance > 0) {
      const key = token.tokenAddress
      let value = groupedSymbols.get(key)
      if (!value) {
        groupedSymbols.set(key, { totalBalance: token.balance })
      } else {
        value.totalBalance += token.balance
      }
    }
  }

  return Array.from(groupedSymbols, ([key, value]) => ({ symbol: key, qty: parseFloat(value.totalBalance.toFixed(4)) }));
}
