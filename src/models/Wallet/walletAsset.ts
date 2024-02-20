import { Asset } from './asset'

export interface WalletAsset {
  address: string
  assets: Asset[]
}
