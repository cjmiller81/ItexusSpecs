import { AxiosError } from "axios";
import { appAxios } from "components";

export interface NewsItem {
  news_url: string;
  image_url: string;
  title: string;
  text: string;
  source_name: string;
  date: string;
  topics: string[];
  sentiment: string;
  type: string;
  tickers: string[];
}

export interface NewsResponse {
  data: NewsItem[];
  total_pages: number;
  total_items: number;
}

interface TickerNewsParams {
  tickers: string;
  items?: number;
  page?: number;
  extra_fields?: string;
  sortby?: string;
}

interface TickerAdvancedNewsParams {
  tickersInclude?: string;
  tickersOnly?: string;
  items?: number;
  page?: number;
}

interface CategoryNewsParams {
  section: string;
  items?: number;
  page?: number;
}

export const cryptoNewsService = {

  getNewsByTicker: async (params: TickerNewsParams): Promise<NewsResponse> => {
    try {
      const response = await appAxios.get("/api/cryptonews/ticker", {
        params: {
          tickers: params.tickers,
          items: params.items || 3,
          page: params.page || 1,
          extra_fields: params.extra_fields,
          sortby: params.sortby,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch news by ticker:", error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to load news by ticker");
    }
  },

  getNewsByTickerAdvanced: async (params: TickerAdvancedNewsParams): Promise<NewsResponse> => {
    try {
      const response = await appAxios.get("/api/cryptonews/ticker-advanced", {
        params: {
          "tickers-include": params.tickersInclude,
          "tickers-only": params.tickersOnly,
          items: params.items || 3,
          page: params.page || 1,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch news by advanced ticker filter:", error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to load news by advanced ticker filter");
    }
  },

  getNewsByCategory: async (params: CategoryNewsParams): Promise<NewsResponse> => {
    try {
      const response = await appAxios.get("/api/cryptonews/category", {
        params: {
          section: params.section,
          items: params.items || 100,
          page: params.page || 1,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch news by category:", error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to load news by category");
    }
  },

  getTickers: async (): Promise<string[]> => {
    try {
      const response = await appAxios.get("/api/cryptonews/tickers", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tickers:", error);
      if (error instanceof AxiosError) {
        throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error("Failed to load tickers");
    }
  },
};