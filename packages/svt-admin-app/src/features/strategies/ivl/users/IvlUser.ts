import { ITradeQuantity, ITimestamp } from "../../0dte-iron-flies/users/types";

export interface IIvlStrategiesResponse
{
  strategies: IvlUser[];
}

export interface IvlUser {
  accountNumber: string
  active: boolean
  botStatus: string
  capitalAllocationNext: ITradeQuantity
  userId: string
  exchangeUsername: string
  connectionStatus: boolean
  lastUpdatedAt: ITimestamp | null
  tradeQty: ITradeQuantity | null
  closingOnly: boolean
  entryOrderStatus: string
  hasEntryOrderStatus: boolean
  exchange: string
  masterSymbol: string
  nextEntryTimestamp: ITimestamp | null
  priceAverageFill: ITradeQuantity | null
  removed: boolean
  targetOrderStatus: string
  hasTargetOrderStatus: boolean
  userMessage: string
  hasUserMessage: boolean
}
