import { Asset } from "@/models/Wallet/asset"
import { ChainAsset } from "@/models/Wallet/ChainAsset"
import { Wallet } from "@/models/Wallet/Wallet"

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

export const getWalletsUsdTotal = (wallets: Wallet[]): number => {
  const total = wallets.reduce((acc, wallet) => {
    return acc + getWalletUsdTotal(wallet)
  }, 0)

  return total
}

export const getWalletUsdTotal = (wallet: Wallet) => {
  return wallet.chainAssets.reduce((chainAcc, chainAssets) => {
    const tokenDetailsMap = new Map(chainAssets.tokenDetails.map(details => [details.sym, details]))

    const assetsTotal = chainAssets.walletAssets.reduce((assetsAcc, asset) => {
      const details = tokenDetailsMap.get(asset.tokenName.toLocaleLowerCase())
      return details ? assetsAcc + asset.balance * details.price : 0
    }, 0)

    return chainAcc + assetsTotal
  }, 0)
}
