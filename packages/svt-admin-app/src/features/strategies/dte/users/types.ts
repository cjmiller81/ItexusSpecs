export interface IDteStrategiesResponse 
{ 
  strategies: IDteStrategy[];
}

export interface IDteStrategy {
  accountNumber: string;
  active: boolean;
  botStatus: string;
  connectionStatus: boolean;
  entryOrderStatus: string;
  hasEntryOrderStatus: boolean;
  exchange: string;
  exchangeUsername: string;
  lastUpdatedAt: ITimestamp | null;
  masterSymbol: string;
  nextEntryTimestamp: ITimestamp | null;
  nextEndOfDayCloseTimestamp: ITimestamp | null;
  priceAverageFill: number | null;
  removed: boolean;
  stopOrderStatus: string;
  hasStopOrderStatus: boolean;
  targetOrderStatus: string;
  hasTargetOrderStatus: boolean;
  tradeQty: ITradeQuantity | null;
  userId: string;
  userMessage: string;
  hasUserMessage: boolean;
}

export interface ITimestamp {
  seconds: number;
  nanos: number;
}

export interface ITradeQuantity {
  units: number;
  nanos: number;
}