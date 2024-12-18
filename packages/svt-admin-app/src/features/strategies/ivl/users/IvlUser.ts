import { ITradeQuantity, ITimestamp } from "../../dte/users/types";

export interface IIvlStrategiesResponse
{
  strategies: IvlUser[];
}

export interface IvlUser {
  userId: string
  exchangeUsername: string
  connectionStatus: string
  accountNumber: string
  botStatus: string
  lastUpdatedAt: ITimestamp | null
  tradeQty: ITradeQuantity | null
}
