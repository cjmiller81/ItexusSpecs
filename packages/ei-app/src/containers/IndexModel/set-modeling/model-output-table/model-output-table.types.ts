
import { ITokenSetAllocation, SetAllocationsType } from '../../IndexModel.types'
import { ModelOutputField } from './model-output-table.constants'

export interface IModelOutputTable {
  prefilteredTokenData: ITokenSetAllocation[]
  tabType: SetAllocationsType
  onModelSetModelingUpdate: (weightedSetModelingTable:ITokenSetAllocation[]) =>void
  tokenCount: number
  startPrice: number
}

export interface IModelOutputDataRow {
  [ModelOutputField.Id]: string
  [ModelOutputField.Symbol]: string
  [ModelOutputField.Price]: number
  [ModelOutputField.MarketCap]: number
  [ModelOutputField.Weight]: number
  [ModelOutputField.Qty]: number
}
