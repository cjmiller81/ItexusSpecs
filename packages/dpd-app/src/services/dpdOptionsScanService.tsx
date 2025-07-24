import axios from "axios";
import { Instrument, InstrumentsResponse } from "@/slices/dpdOptionsScanSlice";

export interface ExitTier {
  exitTierPositionPercent: number;
  exitType: string;
  exitTypeValue: number | string;
  optionStopOffsetPercent: number;
  optionTargetOffsetPercent: number;
  stockStopOffsetPercent: number;
  stockTargetOffsetPercent: number;
}

export interface StrategySettings {
  cancelAndResubmitOnPartial: boolean;
  dteMin: number;
  dteMax: number;
  entryOffsetPercent: number;
  entryType: number;
  exitTiers: ExitTier[];
  maxDelta: number | null;
  minContractAsk: number;
  minDelta: number | null;
  minOpenInterest: number;
  minVolume: number;
  baSpreadDiff: number;
  oiCapPercent: number;
  optionType: string;
  requireActiveBid: boolean;
  ticker: string;
  totalDollarAmount: number;
  tradeUnderlying: boolean;
  onlyTradeUnderlying: boolean;
  breakUpOrder: boolean;
  orderBreaks: number;
  tradeAsSet: boolean;
  instrument?: Instrument | null;
}

export interface SubProfiles {
  accountNumber: string;
  state: number;
  strategySettings: StrategySettings;
}

export class dpdOptionsScanService {
  
  static async scanSchwab(request: SubProfiles): Promise<any> {
    try {
      const response = await axios.post(`${process.env.API_BASE_URL}/api/dpdOptionsScan/schwab`, request, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error executing Schwab scan:", error);
      throw error;
    }
  }
}
