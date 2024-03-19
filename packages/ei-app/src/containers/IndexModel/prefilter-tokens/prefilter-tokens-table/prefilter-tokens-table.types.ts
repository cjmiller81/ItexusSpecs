import { ITokenSetAllocation, SetAllocationsType } from '../../IndexModel.types'
import { PrefilterTokensField } from './prefilter-tokens-table.constants'

export interface IPrefilterTokensTable {
  tabType: SetAllocationsType
  onUpdate: (filteredTokenData: ITokenSetAllocation[]) => void
}

export interface IPrefilterTokensDataRow {
  [PrefilterTokensField.Id]: string
  [PrefilterTokensField.Symbol]: string
  [PrefilterTokensField.Price]: number
  [PrefilterTokensField.MarketCap]: number
  [PrefilterTokensField.CirculatingSupply]: number
  [PrefilterTokensField.TotalSupply]: number
  [PrefilterTokensField.MaxSupply]: number
  [PrefilterTokensField.Tokenomics]: number
  [PrefilterTokensField.IsErc20]: boolean
  [PrefilterTokensField.Categories]: string[]
}
