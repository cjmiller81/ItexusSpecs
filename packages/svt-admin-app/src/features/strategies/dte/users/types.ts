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

interface TradeQty {
  units: number;
  nanos: number;
}

interface PidAddress {
  address: string;
  id: string;
}

interface StrategySettings {
  entryOrderAtOpenOffsetMinutes: number;
  exitOrderAtCloseOffsetMinutes: number;
  maxProfitPercentTarget: number;
  strikeWidth: number;
  minCreditRequired: number;
}

export interface StrategyBotList {
  zeroDteFlyStrategyList : StrategyBot[]
}

export interface StrategyBot {
  active: boolean;
  entryOrderId: string;
  hasEntryOrderId: boolean;
  entryExchangeOrderId: string;
  hasEntryExchangeOrderId: boolean;
  entryOrderStatus: string;
  hasEntryOrderStatus: boolean;
  exchange: string;
  exchangeAccountNumber: string;
  stopOrderId: string;
  hasStopOrderId: boolean;
  stopExchangeOrderId: string;
  hasStopExchangeOrderId: boolean;
  stopOrderStatus: string;
  hasStopOrderStatus: boolean;
  targetOrderId: string;
  hasTargetOrderId: boolean;
  targetExchangeOrderId: string;
  hasTargetExchangeOrderId: boolean;
  targetOrderStatus: string;
  hasTargetOrderStatus: boolean;
  tradeQty: TradeQty;
  userId: string;
  status: string;
  removed: boolean;
  masterSymbol: string;
  masterSymbolAssetType: string;
  pidAddress: PidAddress;
  callLeg1StreamerSymbol: string;
  callLeg2StreamerSymbol: string;
  putLeg1StreamerSymbol: string;
  putLeg2StreamerSymbol: string;
  entryReplaceOrderId: string;
  hasEntryReplaceOrderId: boolean;
  entryReplaceExchangeOrderId: string;
  hasEntryReplaceExchangeOrderId: boolean;
  stopReplaceOrderId: string;
  hasStopReplaceOrderId: boolean;
  stopReplaceExchangeOrderId: string;
  hasStopReplaceExchangeOrderId: boolean;
  callLeg1Symbol: string;
  callLeg2Symbol: string;
  putLeg1Symbol: string;
  putLeg2Symbol: string;
  nextEntryTimestamp: ITimestamp;
  nextEndOfDayCloseTimestamp?: ITimestamp;
  userMessage: string;
  strategySettings: StrategySettings;
}