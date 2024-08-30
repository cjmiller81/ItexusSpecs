import { Asset, ChainAsset, Wallet } from "../models/wallet"


export interface WalletTokensTableModel extends Asset {
  price?: number
  usdAmount?: number
  chainName: string
}

export const toTableTokensModels = (chainAssets: ChainAsset[]): WalletTokensTableModel[] => {
  return chainAssets.flatMap(chainAsset => toTableTokensModel(chainAsset))
}

export const toTableTokensModel = (chainAsset: ChainAsset): WalletTokensTableModel[] => {
  const tokenDetailsMap = new Map(chainAsset.tokenDetails.map(details => [details.sym, details]))
  const tableAssets = chainAsset.walletAssets.map<WalletTokensTableModel>(asset => {
    const details = tokenDetailsMap.get(asset.tokenName.toLowerCase())
    return details
      ? {
          ...asset,
          price: details.price,
          usdAmount: details.price * asset.balance,
          chainName: chainAsset.chainName,
        }
      : { ...asset, chainName: chainAsset.chainName }
  })

  return tableAssets
}

//eslint-disable-next-line no-undef
export const toTotalTokensBalances = (wallets: Wallet[] | null): { symbol: string; qty: number }[] => {
  const allChainsAssets = (wallets || [])
    .flatMap(x => x.chainAssets)
    .map(x => toTableTokensModel(x))
    .flat()

  const groupedSymbols = new Map<string, { totalBalance: number }>()
  for (const e of allChainsAssets) {
    const key = e.tokenAddress!
    let value = groupedSymbols.get(key)
    if (!value) {
      groupedSymbols.set(key, { totalBalance: e.balance })
    } else {
      value.totalBalance += e.balance
    }
  }

  return Array.from(groupedSymbols, ([key, value]) => ({ symbol: key, qty: parseFloat(value.totalBalance.toFixed(4)) }))
}
