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
  callNextLegPosition?: PositionMsg;
  putLegPosition?: PositionMsg;
  putNextLegPosition?: PositionMsg;
  underlyingPosition?: PositionMsg;
  callLegOriginalQty: number;
  callNextLegOriginalQty: number;
  putLegOriginalQty: number;
  putNextLegOriginalQty: number;
  underlyingOriginalQty: number;
  errorMsg?: string;
}

export enum DpdOptionsScanStrategyState {
  INITIAL = 0,
  ACTIVE = 5,
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
  entryType: string;
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
  hasUserId?: boolean;
  instrument?: Instrument;
}

export interface ExitTier {
  exitTierPositionPercent: number;
  exitType: ExitType;
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
  strikePrice?: number | null;
  underlyingSymbol: string;
  exchangeIdToOrderId: Record<string, string>;
  filledEntryOrders: Record<string, FilledOrder>;
  filledExitOrders: Record<string, FilledOrder>;
  workingEntryOrders: Record<string, OrderValue>;
  workingStopOrders: Record<string, OrderValue>;
  workingTargetOrders: Record<string, OrderValue>;
  filledLongOrders: Record<string, FilledOrder>;
  filledShortOrders: Record<string, FilledOrder>;
  entryDate?: string | null;
  contractExpirationDate?: string | null;
  updatedAt: Timestamp;
  errorOrders: Record<string, string>;
}

export interface Instrument {
  cusip: string;
  description: string;
  exchange: string;
  exchangeName: string;
  assetType: string;
  symbol: string;
}

export interface FilledOrder {
  item1: OrderValue;
  item2: OrderValue;
}

export interface OrderValue {
  units: number;
  nanos: number;
}

export interface Timestamp {
  seconds: number;
  nanos: number;
}
