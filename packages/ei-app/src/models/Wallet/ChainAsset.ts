import { Asset } from "./asset"
import { TokenDetails } from "./TokenDetails"

export interface ChainAsset {
  chainId: number
  chainName: string
  walletAssets: Asset[]
  tokenDetails: TokenDetails[]
}
