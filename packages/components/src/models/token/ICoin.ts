export interface ICoin {
  id: string
  addr: string | null
  cats: string[]
  chainId: string | null
  cirSup: number
  chains: string[]
  decs: number
  sym: string
  erc20: boolean
  mSup: number
  mCap: number
  name: string
  fulDilVal: number
  api_symbol?: string
  market_cap_rank?: number
  lURI?: string
  price: number
  tNom: number
  tSup: number
  tVol: number
}
