
export interface WordpressApiSettings {
    accessToken: string | null;
    expiresAt: number | null;
    apiRootUrl: string;
    nonce: string | null;
    epdCustomerId: string | null;
    stripeCustomerId: string | null;
    membership_level: string | null;
    userId: string | null;
  }
  
  export interface ExchangeAccount {
    exchangeUsername: string;
    accountBalance: {
      units: number;
      nanos: number;
    } | null;
    accountName: string | null;
    accountNumber: string;
    authorityLevel: string | null;
    isClosed: boolean;
    isFuturesApproved: boolean;
    isMargin: boolean;
    isPrimary: boolean;
    suitableOptionsLevel: string | null;
  }
  
  export interface TastytradeAccountConnect {
    login: string;
    password: string | null;
    rememberToken: string | null;
    epdCustomerId: string | null;
    stripeCustomerId: string | null;
  }

  export interface DecimalValue {
    units: number;
    nanos: number;
  }
  
  export interface Timestamp {
    seconds: number;
    nanos: number;
  }
    
  export enum DiagonalHedgeState {
    Initial = "initial",
    Flat = "flat",
    Scanning = "scanning",
    EntryScan = "entryScan",
    HasVixPrice = "hasVixPrice",
    HasVixPriceAndShortPutChain = "hasVixPriceAndShortPutChain",
    HasVixPriceDataAndOptionChains = "hasVixPriceDataAndOptionChains",
    HasShortPutPrice = "hasShortPutPrice",
    HasOptionPrices = "hasOptionPrices",
    EstablishingLongPutPosition = "establishingLongPutPosition",
    InLongPutPosition = "inLongPutPosition",
    EstablishingShortPutPosition = "establishingShortPutPosition",
    InLongPutAndShortPutPosition = "inLongPutAndShortPutPosition",
    AdjustPosition = "adjustPosition"
  }
  
  export enum DiagonalHedgePresets
  {
    Cautious = "cautious",
    Neutral = "neutral",
    Bullish = "bullish",
  }
  
  export interface DiagonalHedgeSettings {
    capitalAllocation: DecimalValue;
    capitalAllocationNext: DecimalValue;
    capitalPerShortPutMinHedge: DecimalValue;
    capitalPerShortPutMaxHedge: DecimalValue;
    closingOnly: boolean;
    preset: DiagonalHedgePresets | null;
    distanceFromShortStrike: DecimalValue;
    extrinsicAnnualizedCreditTarget: DecimalValue;
    longPutDte: number;
    longPutDteStop: number;
    maxDistanceShortStrike: DecimalValue;
    maxHedgeRatioAllowed: DecimalValue;
    maxHedgeRatioVix: number;
    maxTargetCreditAllowed: DecimalValue;
    minDistanceShortStrike: DecimalValue;
    minHedgeRatioAllowed: DecimalValue;
    minHedgeRatioVix: number;
    shortDte: number;
    shortPutDteStop: number;
    shortPutTarget: DecimalValue;
    tradeQty: DecimalValue;
    vixEffect: DecimalValue;
    vixInflectionPoint: number;
  }
  
  export interface DiagonalHedge {
    accountNumber: string;
    active: boolean;
    botStatus: DiagonalHedgeState;
    connectionStatus: boolean;
    longPutPosition: PositionMsg | null;
    longPutPositionStatus: OrderStatus;
    exchange: string;
    lastUpdatedAt: Timestamp | null;
    masterSymbol: string;
    removed: boolean;
    shortPutPosition: PositionMsg | null;
    shortPutPositionStatus: OrderStatus;
    userId: string;
    userMessage: string | null;
    strategySettings: DiagonalHedgeSettings | null;
    foundShortPutStrikes: FuturesNestedOptionChainSerializerOptionChainsExpirations | null;
    foundLongPutStrikes: FuturesNestedOptionChainSerializerOptionChainsExpirations | null;
    shortStrike: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes | null;
    longStrike: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes | null;
    shortPutStrikeQuote: ExchangeQuote | null;
    longPutStrikeQuote: ExchangeQuote | null;
    vixPrice: number | null;
    state: DiagonalHedgeState;
  }
  
  interface TickSize {
    value: DecimalValue;
    threshold: DecimalValue | null;
    symbol: string;
    hasSymbol: boolean;
  }
  
  interface TickSizeWrapper {
    tickSizes: TickSize[];
  }
  
  export interface ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes {
    strikePrice: DecimalValue;
    call: string;
    callStreamerSymbol: string;
    put: string;
    putStreamerSymbol: string;
  }
  
  interface StrikeWrapper {
    strikes: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes[];
  }
  
  export interface FuturesNestedOptionChainSerializerOptionChainsExpirations {
    underlyingSymbol?: string;
    rootSymbol?: string;
    optionRootSymbol?: string;
    optionContractSymbol?: string;
    asset?: string;
    expirationDate: Timestamp;
    daysToExpiration: number;
    expirationType: 'Weekly' | 'End-Of-Month';
    settlementType: 'PM';
    notionalValue?: DecimalValue;
    displayFactor?: DecimalValue;
    strikeFactor?: DecimalValue;
    stopsTradingAt?: Timestamp;
    expiresAt?: Timestamp;
    tickSizes?: TickSizeWrapper[];
    strikes: StrikeWrapper[];
  }

export interface PositionMsg {
  accountNumber: string;
  exchange: string;
  symbol: string;
  streamerSymbol: string;
  strikePrice: DecimalValue | null;
  underlyingSymbol: string;
  exchangeIdToOrderId: Record<string, string>;
  filledEntryOrders: Record<string, FilledOrder>;
  filledExitOrders: Record<string, FilledOrder>;
  workingEntryOrders: Record<string, DecimalValue>;
  workingStopOrders: Record<string, DecimalValue>;
  workingTargetOrders: Record<string, DecimalValue>;
  filledLongOrders: Record<string, FilledOrder>;
  filledShortOrders: Record<string, FilledOrder>;
  entryDate: Timestamp | null;
  contractExpirationDate: Timestamp | null;
  updatedAt: Timestamp;
  errorOrders?: {};
}

interface FilledOrder {
  item1: DecimalValue;
  item2: DecimalValue;
}

export interface ExchangeQuote {
    marketAssetType?: string;
    symbol: string;
    description?: string;
    bidPrice: number;
    bidSize: number;
    bidId?: string;  
    askPrice: number;
    askSize: number;
    askId?: string;
    lastPrice?: number;
    lastSize?: number;
    lastId?: string;
    openPrice?: number;
    highPrice?: number;
    lowPrice?: number;
    closePrice?: number;
    netChange?: number;
    totalVolume?: number;
    quoteTimeInLong?: number;
    strikePrice: { units: number; nanos: number } | number | null;
    tradeTimeInLong?: number;
    mark?: number;
    exchange?: string; 
    exchangeName?: string; 
    marginable?: boolean;
    shortable?: boolean; 
    volatility?: number;
    digits?: number;
    askTime: number;
    askExchangeCode: string;
    bidTime: number;
    bidExchangeCode: string;
    sequence: number;
    time: number;
    timeNanoPart: number;
    timeNanos: number;
    hasSymbol: boolean;
  }
  
  export enum IvlRiskTolerance {
    High,
    Medium,
    Low
  }
  
  export enum SpreadTypeProto {
    STRANGLE = 0,
    IRON_CONDOR = 1
  }
  
  export enum Mechanical0DteSpxStateProto {
    ZDTE_INITIAL = 0,
    ZDTE_HAS_VIX_PRICE_LEVELS = 1,
    ZDTE_SKIP_TRADING = 2,
    ZDTE_HAS_0DTE_OPTION_CHAIN = 3,
    ZDTE_HAS_OPTION_STRIKE_PRICE_QUOTES = 4,
    ZDTE_HAS_CURRENT_POSITIONS = 5,
    ZDTE_SUBMITTING_ENTRY_ORDER = 6,
    ZZTE_IN_STRANGLE_ORDER = 7,
    ZDTE_IN_IRON_CONDOR_ORDER = 8,
    ZDTE_SUBMITTING_STOP_LOSS_ORDERS = 9,
    ZDTE_STOP_LOSS_ORDER_WORKING = 10,
    ZDTE_END_OF_DAY = 11
  }
  
  export const Mechanical0DteSpxStateMap: Record<string, Mechanical0DteSpxStateProto> = {
    zdteInitial: Mechanical0DteSpxStateProto.ZDTE_INITIAL,
    zdteHasVixPriceLevels: Mechanical0DteSpxStateProto.ZDTE_HAS_VIX_PRICE_LEVELS,
    zdteSkipTrading: Mechanical0DteSpxStateProto.ZDTE_SKIP_TRADING,
    zdteHas0dteOptionChain: Mechanical0DteSpxStateProto.ZDTE_HAS_0DTE_OPTION_CHAIN,
    zdteHasOptionStrikePriceQuotes: Mechanical0DteSpxStateProto.ZDTE_HAS_OPTION_STRIKE_PRICE_QUOTES,
    zdteHasCurrentPositions: Mechanical0DteSpxStateProto.ZDTE_HAS_CURRENT_POSITIONS,
    zdteSubmittingEntryOrder: Mechanical0DteSpxStateProto.ZDTE_SUBMITTING_ENTRY_ORDER,
    zzteInStrangleOrder: Mechanical0DteSpxStateProto.ZZTE_IN_STRANGLE_ORDER,
    zdteInIronCondorOrder: Mechanical0DteSpxStateProto.ZDTE_IN_IRON_CONDOR_ORDER,
    zdteSubmittingStopLossOrders: Mechanical0DteSpxStateProto.ZDTE_SUBMITTING_STOP_LOSS_ORDERS,
    zdteStopLossOrderWorking: Mechanical0DteSpxStateProto.ZDTE_STOP_LOSS_ORDER_WORKING,
    zdteEndOfDay: Mechanical0DteSpxStateProto.ZDTE_END_OF_DAY
  };
  
  export interface StrategySettings {
    entryOrderAtOpenOffsetMinutes: number;
    exitOrderAtCloseOffsetMinutes: number;
    maxProfitPercentTarget: number;
    strikeWidth: number;
    minCreditRequired: number;
    maxCreditRequired: number;
    spreadType?: "ironCondor" | "strangle" | null;
    useVixPrice?: boolean | null;
    hasUseVixPrice?: boolean | null;
    useVixGaps?: boolean | null;
    hasUseVixGaps?: boolean | null;
    minVixPrice?: DecimalValue | null;
    maxVixPrice?: DecimalValue | null;
    minVixOvernightGapUp?: DecimalValue | null;
    maxVixOvernightGapUp?: DecimalValue | null;
    minVixOvernightGapDown?: DecimalValue | null;
    maxVixOvernightGapDown?: DecimalValue | null;
  }
  
  export interface SvtIvlStrategyAccountConnect {
    accountNumber: string;
    riskTolerance: IvlRiskTolerance;
    capitalAllocation: {
      units: number;
      nanos: number;
    } | null;
    capitalAllocationNext: {
      units: number;
      nanos: number;
    } | null;
    closingOnly: boolean;
  }
  
  export interface SvtIvlEsStrategySetStatus {
    isStarted: boolean;
    entryOrderId: string | null;
    entryExchangeOrderId: string | null;
    entryOrderStatus: OrderStatus | null;
    entryOrderSymbol: string | null;
    exitOrderId: string | null;
    exitExchangeOrderId: string | null;
    exitOrderStatus: OrderStatus | null;
    exitOrderSymbol: string | null;
    exchangeUsername: string;
    accountNumber: string | null;
    riskTolerance: IvlRiskTolerance;
    capitalAllocation: {
      units: number;
      nanos: number;
    } | null;
    capitalAllocationStart: {
      units: number;
      nanos: number;
    } | null;
    capitalAllocationNext: {
      units: number;
      nanos: number;
    } | null;
    contractQty: {
      units: number;
      nanos: number;
    } | null;
    closingOnly: boolean;
    userMessage: string | null;
  }
  
  export interface CreateFifoStrategyRequest {
    active: boolean;
    exchangeAccountNumber: string | null;
    masterSymbol: string;
    tradeQty: {
      units: number;
      nanos: number;
    };
    tradeSymbol: string;
  }
  
  export interface CreateZeroDteStrategyRequest {
    active: boolean;
    exchangeAccountNumber: string | null;
    strategySettings: StrategySettings | null;
  }
  
  export interface FifoStrategyListItem {
    active: boolean;
    atrPeriod: number;
    capitalAllocation: number;
    entryOrderId: string;
    hasEntryOrderId: boolean;
    entryExchangeOrderId: string;
    hasEntryExchangeOrderId: boolean,
    entryOrderStatus: string;
    hasEntryOrderStatus: false;
    exchange: string;
    exchangeAccountNumber: string;
    masterSymbol: string;
    masterSymbolAssetType: string;
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
    tradeQty: {
      units: number;
      nanos: number;
    };
    tradeSymbol: string;
    tradeSymbolAssetType: string;
    userId: string;
    callLeg1StreamerSymbol: string;
    callLeg2StreamerSymbol: string;
    putLeg1StreamerSymbol: string;
    putLeg2StreamerSymbol: string;
    callLeg1Symbol: string;
    callLeg2Symbol: string;
    putLeg1Symbol: string;
    putLeg2Symbol: string;
    nextEntryTimestamp: {
      seconds: number;
      nanos: number;
    } | null;
    nextEndOfDayCloseTimestamp: {
      seconds: number;
      nanos: number;
    } | null;
    userMessage: string;
    strategySettings: StrategySettings | null;
    status: string;
    removed: boolean;
  }
  
  export interface FifoStrategyListResponse {
    fifoStrategyList: FifoStrategyListItem[];
  }
  
  export interface ZeroDteFlyStrategyListResponse {
    zeroDteFlyStrategyList: FifoStrategyListItem[];
  }
  
  export interface CreateDiagonalHedgeRequest {
    accountNumber: string;
    active: boolean;
    masterSymbol: string;
    strategySettings?: {
      preset: DiagonalHedgePresets;
      capitalAllocation: DecimalValue;
      closingOnly: boolean;
    };
  }
  
  export interface Mechanical0DteSpxSettings {
    spreadType: "ironCondor" | "strangle";
    entryOrderAtOpenOffsetMinutes: number;
    targetCreditShortPut: DecimalValue;
    strikeDistanceLongPut?: DecimalValue;
    targetCreditShortCall: DecimalValue;
    strikeDistanceLongCall?: DecimalValue;
    stopLossPercentShortPut: DecimalValue;
    stopLossPercentShortCall: DecimalValue;
    useVixPrice?: boolean | null;
    hasUseVixPrice?: boolean | null;
    useVixGaps?: boolean | null;
    hasUseVixGaps?: boolean | null;
    minVixPrice?: DecimalValue | null;
    maxVixPrice?: DecimalValue | null;
    minVixOvernightGapUp?: DecimalValue | null;
    maxVixOvernightGapUp?: DecimalValue | null;
    minVixOvernightGapDown?: DecimalValue | null;
    maxVixOvernightGapDown?: DecimalValue | null;
  }
  
  export interface PriceLevels {
    vixOpen: DecimalValue;
    vixPreviousClose: DecimalValue;
    currentVixPrice: DecimalValue;
    openTimestamp: Timestamp;
    previousCloseTimestamp: Timestamp;
    currentTimestamp: Timestamp;
  }
  
  export interface Mechanical0DteSpx {
    strategyId: string;
    accountNumber: string;
    active: boolean;
    botStatus: Mechanical0DteSpxStateProto | string;
    connectionStatus: boolean;
    exchange: string;
    lastUpdatedAt?: Timestamp | null;
    masterSymbol: string;
    removed: boolean;
    userId: string;
    userMessage?: string;
    strategySettings: Mechanical0DteSpxSettings | null;
    hasUserMessage?: boolean; 
    foundStrikes?: FuturesNestedOptionChainSerializerOptionChainsExpirations | null;
    putUpperLegPosition?: PositionMsg | null;
    putLowerLegPosition?: PositionMsg | null;
    callUpperLegPosition?: PositionMsg | null;
    callLowerLegPosition?: PositionMsg | null;
    putUpperLegStrike?: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes | null;
    putLowerLegStrike?: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes | null;
    callUpperLegStrike?: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes | null;
    callLowerLegStrike?: ProtoFuturesNestedOptionChainSerializerOptionChainsExpirationsStrikes | null;
    putUpperLegQuote?: ExchangeQuote | null;
    putLowerLegQuote?: ExchangeQuote | null;
    callUpperLegQuote?: ExchangeQuote | null;
    callLowerLegQuote?: ExchangeQuote | null;
    vixPriceLevels?: PriceLevels | null;
    state: number;
    callUpperLegOriginalQty?: number;
    hasCallUpperLegOriginalQty?: boolean; 
    callLowerLegOriginalQty?: number;
    hasCallLowerLegOriginalQty?: boolean;
    putUpperLegOriginalQty?: number;
    hasPutUpperLegOriginalQty?: boolean;
    putLowerLegOriginalQty?: number;
    hasPutLowerLegOriginalQty?: boolean;
    callLowerLegOriginalWorkingStopQty?: number;
    hasCallLowerLegOriginalWorkingStopQty?: boolean;
    putUpperLegOriginalWorkingStopQty?: number;
    hasPutUpperLegOriginalWorkingStopQty?: boolean;
  }
  
  export interface Mechanical0DteSpxList {
    strategies: Mechanical0DteSpx[];
  }
  
  export interface CreateMechanical0DteSpxRequest {
    active: boolean;
    accountNumber: string | null;
    strategySettings: Mechanical0DteSpxSettings | null;
  }

  export interface ExchangePosition {
    username: string;
    accountNumber: string;
    amount: number;
    amountFilled: number;
    averagePrice: number;
    fees: number;
    direction: string;
    instruction: string;
    liquidationPrice: number;
    leverage: number;
    lastPrice: number;
    marketSymbol: string;
    status: string;
    timeStamp: string | Date;
  }
  
  export enum OrderStatus {
    Undefined = -1,
    Submitted = 0,
    Working = 2,
    Partial = 3,
    Filled = 4,
    PendingCancel = 5,
    Error = 6,
    FilledPartiallyAndCancelled = 7,
    Canceled = 8,
    UndefinedProto = 99,
  }
  
  // Map for string values to enum values
  export const OrderStatusMap: Record<string, OrderStatus> = {
    undefined: OrderStatus.Undefined,
    submitted: OrderStatus.Submitted,
    working: OrderStatus.Working,
    partial: OrderStatus.Partial,
    filled: OrderStatus.Filled,
    pendingCancel: OrderStatus.PendingCancel,
    error: OrderStatus.Error,
    filledPartiallyAndCancelled: OrderStatus.FilledPartiallyAndCancelled,
    canceled: OrderStatus.Canceled,
    undefinedProto: OrderStatus.UndefinedProto
  };
  
  // Map for display strings
  export const OrderStatusDisplayMap: Record<OrderStatus, string> = {
    [OrderStatus.Undefined]: "Undefined",
    [OrderStatus.Submitted]: "Submitted",
    [OrderStatus.Working]: "Working",
    [OrderStatus.Partial]: "Partially Filled",
    [OrderStatus.Filled]: "Filled",
    [OrderStatus.PendingCancel]: "Pending Cancel",
    [OrderStatus.Error]: "Error",
    [OrderStatus.FilledPartiallyAndCancelled]: "Partially Filled & Cancelled",
    [OrderStatus.Canceled]: "Canceled",
    [OrderStatus.UndefinedProto]: "Undefined"
  };
  