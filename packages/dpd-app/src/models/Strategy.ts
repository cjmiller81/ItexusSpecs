export interface Position {
  accountNumber: string;
  exchange: string;
  symbol: string;
  streamerSymbol: string;
  strikePrice: number | null;
  underlyingSymbol: string;
  exchangeIdToOrderId: Record<string, string>;
  filledEntryOrders: Record<string, { units: number; nanos: number }>;
  filledExitOrders: Record<string, { units: number; nanos: number }>;
  workingEntryOrders: Record<string, { units: number; nanos: number }>;
  workingStopOrders: Record<string, { units: number; nanos: number }>;
  workingTargetOrders: Record<string, { units: number; nanos: number }>;
  filledLongOrders: Record<string, { units: number; nanos: number } | { item1: { units: number; nanos: number }; item2: { units: number; nanos: number } }>;
  filledShortOrders: Record<string, { units: number; nanos: number }>;
  entryDate: string | null;
  contractExpirationDate: string | null;
  updatedAt: {
    seconds: number;
    nanos: number;
  };
  errorOrders: Record<string, string>;
}

export interface StrategySettings {
  cancelAndResubmitOnPartial: boolean;
  dteMin: number;
  dteMax: number;
  entryOffsetPercent: number;
  entryType: string;
  useLaddering: boolean;
  exitTiers: any[];
  maxDelta: number;
  minContractAsk: number;
  minDelta: number;
  minOpenInterest: number;
  minVolume: number;
  baSpreadDiff: number;
  oiCapPercent: number;
  optionType: string;
  requireActiveBid: boolean;
  useBidAskMax: boolean;
  bidAskMax: number;
  ticker: string;
  totalDollarAmount: number;
  tradeUnderlying: boolean;
  onlyTradeUnderlying: boolean;
  breakUpOrder: boolean;
  orderBreaks: number;
  tradeAsSet: boolean;
  userId: string;
  hasUserId: boolean;
  instrument: {
    cusip: string;
    description: string;
    exchange: string;
    exchangeName: string;
    assetType: string;
    symbol: string;
  };
}

export interface Strategy {
  strategyId: string;
  accountNumber: string;
  state: number;
  userId: string;
  strategySettings: StrategySettings;
  callLegPosition: Position | null;
  callNextLegPosition: Position | null;
  putLegPosition: Position | null;
  putNextLegPosition: Position | null;
  underlyingPosition: Position | null;
  callLegOriginalQty: number;
  callNextLegOriginalQty: number;
  putLegOriginalQty: number;
  putNextLegOriginalQty: number;
  underlyingOriginalQty: number;
  errorMsg: string;
}

export interface Instrument {
  cusip: string;
  description: string;
  exchange: string;
  exchangeName: string;
  assetType: string;
  symbol: string;
}

export interface ExitTier {
  exitTierPositionPercent: number;
  exitType: string;
  exitTypeValue: number;
  optionStopOffsetPercent: number;
  optionTargetOffsetPercent: number;
  stockStopOffsetPercent: number;
  stockTargetOffsetPercent: number;
}

export interface StrategyResponse {
  strategies: Strategy[];
}
