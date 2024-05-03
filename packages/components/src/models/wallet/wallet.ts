import { ChainAsset } from "./chainAsset"

export interface Wallet {
  address: string
  walletId: string
  isValid: boolean
  walletName?: string,
  isPersonal: boolean,
  chainAssets: ChainAsset[]
}
