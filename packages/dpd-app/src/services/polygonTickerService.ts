import axios from "axios";
import { Ticker } from "@/models/Ticker";

const API_BASE_URL = "https://api.dpd-dev.emergentcybernetics.net";

export class polygonTickerService {
  static async searchTickers(query: string, signal?: AbortSignal): Promise<Ticker[]> {
    try {
      const response = await axios.get<Ticker[]>(`${API_BASE_URL}/api/polygon/tickers/search`, {
        params: { q: query },
        withCredentials: true,
        signal,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching tickers:", error);
      throw error;
    }
  }

  static async getTickerBySymbol(symbol: string, signal?: AbortSignal): Promise<Ticker> {
    try {
      const response = await axios.get<Ticker>(`${API_BASE_URL}/api/polygon/tickers/${encodeURIComponent(symbol)}`, {
        withCredentials: true,
        signal,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticker ${symbol}:`, error);
      throw error;
    }
  }
}

