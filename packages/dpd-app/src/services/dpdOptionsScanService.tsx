import { SubProfile } from "@/models/SubProfile";
import axios from "axios";

const API_BASE_URL = "https://api.dpd-dev.emergentcybernetics.net/api/dpdOptionsScan";

export interface ExitTier {
  exitTierPositionPercent: number;
  exitType: "LIMIT" | "STOP" | string;
  exitTypeValue: number;
  optionTargetOffsetPercent: number;
  optionStopOffsetPercent: number;
  stockTargetOffsetPercent: number;
  stockStopOffsetPercent: number;
}

export interface StrategySettings {
  cancelAndResubmitOnPartial: boolean;
  dteMin: number;
  dteMax: number;
  entryOffsetPercent: number;
  entryType: number;
  exitTiers: ExitTier[];
  maxDelta: number;
  minContractAsk: number;
  minDelta: number;
  minOpenInterest: number;
  minVolume: number;
  baSpreadDiff: number;
  oiCapPercent: number;
  optionType: "CALL" | "PUT" | string;
  requireActiveBid: boolean;
  ticker: string;
  totalDollarAmount: number;
  tradeUnderlying: boolean;
  onlyTradeUnderlying: boolean;
  breakUpOrder: boolean;
  orderBreaks: number;
  tradeAsSet: boolean;
}

export interface SchwabScanRequest {
  accountNumber: string;
  state: number;
  strategySettings: StrategySettings;
}

export class dpdOptionsScanService {
  
  static async scanSchwab(request: SubProfile): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/schwab`, request, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error executing Schwab scan:", error);
      throw error;
    }
  }
}
