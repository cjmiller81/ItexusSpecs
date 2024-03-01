import { Chain } from "../Chain/Chain"
import { Asset } from "./asset"
import { TokenDetails } from "./TokenDetails"

export interface ChainAsset {
  chain: Chain
  walletAssets: Asset[]
  tokenDetails: TokenDetails[]
}
