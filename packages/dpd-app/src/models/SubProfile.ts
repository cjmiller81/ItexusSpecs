import { Instrument } from "@/slices/dpdOptionsScanSlice";

export interface ExitTier {
    exitTierPositionPercent: number;
    exitType: string;
    optionStopOffsetPercent: number;
    optionTargetOffsetPercent: number;
    stockStopOffsetPercent: number;
    stockTargetOffsetPercent: number;
  }
  
  export interface SubProfile {
    name: string;
    cancelAndResubmitOnPartial: boolean;
    dteMax: number;
    dteMin: number;
    entryOffsetPercent: number;
    entryType: string;
    useLaddering: boolean;
    maxDelta: number | null;
    minContractAsk: number;
    minDelta: number | null;
    minOpenInterest: number;
    minVolume: number;
    oiCapPercent: number;
    onlyTradeUnderlying: boolean;
    optionType: string;
    requireActiveBid: boolean;
    useBidAskMax: boolean;
    bidAskMax: number;
    ticker: string;
    totalDollarAmount: number;
    tradeUnderlying: boolean;
    breakUpOrder: boolean;
    orderBreaks: number;
    tradeAsSet: boolean;
    baSpreadDiff: number;
    account: string;
    instruments: Instrument | null;
    exitTiers: ExitTier[];
  }
  