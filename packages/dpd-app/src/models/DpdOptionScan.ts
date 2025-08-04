export interface DpdOptionsScanList {
    strategies: DpdOptionsScan[];
}

export interface DpdOptionsScan {
  strategyId: string;
  accountNumber: string;
  state: DpdOptionsScanStrategyState;
  userId: string;
  strategySettings?: OrderSubmit;
  callLegPosition?: PositionMsg;
  putLegPosition?: PositionMsg;
  underlyingPosition?: PositionMsg;
  callLegOriginalQty: number;
  putLegOriginalQty: number;
  underlyingOriginalQty: number;
}

export enum DpdOptionsScanStrategyState {
  INITIAL = 0,
}

export enum OptionContractPutCall {
  PUT = 0,
  CALL = 1,
}

export enum SettlementType {
  A = 0,
  P = 1,
}

export enum ExpirationExitType {
  M = 0,
  Q = 1,
  S = 2,
  W = 3,
}

export enum ExitType {
  LIMIT = 1,
  OCO = 2
}

export interface OrderSubmit {
  cancelAndResubmitOnPartial: boolean;
  dteMin: number;
  dteMax: number;
  entryOffsetPercent: number;
  entryType: EntryType;
  useLaddering: boolean;
  exitTiers: ExitTier[];
  maxDelta: number;
  minContractAsk: number;
  minDelta: number;
  minOpenInterest: number;
  minVolume: number;
  baSpreadDiff?: number;
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
  orderBreaks?: number;
  tradeAsSet: boolean;
  userId?: string;
}

export interface ExitTier {
  exitTierPositionPercent: number;
  exitType: ExitType;
  exitTypeValue: number;
  optionTargetOffsetPercent: number;
  optionStopOffsetPercent: number;
  stockTargetOffsetPercent: number;
  stockStopOffsetPercent: number;
}

export enum EntryType {
  ENTRY_USE_ASK = 0,
  ENTRY_USE_BID = 1,
  ENTRY_USE_MID = 2,
  ENTRY_MARKET = 3,
}

export interface PositionMsg {
  accountNumber: string;
  exchange: string;
  symbol: string;
  streamerSymbol: string;
  strikePrice?: number;
  underlyingSymbol: string;
  exchangeIdToOrderId: Record<string, string>;
  filledEntryOrders: Record<string, FilledOrder>;
  filledExitOrders: Record<string, FilledOrder>;
  workingEntryOrders: Record<string, number>;
  workingStopOrders: Record<string, number>;
  workingTargetOrders: Record<string, number>;
  filledLongOrders: Record<string, FilledOrder>;
  filledShortOrders: Record<string, FilledOrder>;
  entryDate?: string;
  contractExpirationDate?: string;
  updatedAt: string;
  errorOrders: Record<string, string>;
}

export interface FilledOrder {
  item1: number;
  item2: number;
}
