import { ChainAsset } from "./ChainAsset"

export interface Wallet {
  address: string
  walletId: string
  isValid: boolean
  name?: string,
  isPersonal: boolean,
  chainAssets: ChainAsset[]
}
