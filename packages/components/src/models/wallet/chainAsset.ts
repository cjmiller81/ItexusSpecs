import { Asset } from "./asset"
import { TokenDetails } from "./tokenDetails"

export interface ChainAsset {
  chainId: number
  chainName: string
  walletAssets: Asset[]
  tokenDetails: TokenDetails[]
}
