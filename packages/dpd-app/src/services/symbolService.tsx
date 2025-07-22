import { Instrument } from "@/slices/dpdOptionsScanSlice";
import axios from "axios";


export type AssetType = "EQUITY" | "ETF" | "MUTUAL_FUND" | string;

export interface MarketSymbolsSearchResponse {
  instruments: Instrument[];
}

export class symbolService {
  static async searchMarketSymbolsRegex(
    userInput: string
  ): Promise<MarketSymbolsSearchResponse> {
    const regexPattern = `^/?(${userInput}[A-Z0-9:]*)$`;

    try {
      const response = await axios.get<MarketSymbolsSearchResponse>(
        `${process.env.API_BASE_URL}/api/schwab/marketSymbolsSearch`,
        {
          params: {
            symbol: regexPattern,
            projection: 1,
          },
          headers: { accept: "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching market symbols with regex:", error);
      throw error;
    }
  }
}
