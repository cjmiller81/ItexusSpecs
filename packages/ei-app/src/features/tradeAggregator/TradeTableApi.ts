import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export type Exchange = {
  id: string;
  country: string | null;
  name: string;
  url: string;
  centralized: boolean;
  tickers?: CoinGeckoTicker[];
}

type ConvertedVolume = {
  usd: number;
}

export type CoinGeckoTicker = {
  base: string;
  target: string;
  last: number;
  volume: number;
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };
  converted_volume: {
    btc: number;
    eth: number;
    usd: number;
  };
  trust_score: string;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string;
  token_info_url: string;
  coin_id: string;
  target_coin_id: string;
}


export type CoinGeckoPrice = {
  [key: string]: {
    usd: number;
    base: string;
    target: string;
    exchangeId: string;
  };
}

export const cexApi = createApi({
  reducerPath: "cex",
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getExchanges: build.query<Exchange[], void>({
      query: () => ({ url: "/exchanges", method: "get" }),
      transformResponse: (response: Exchange[]) =>
        response.filter(e =>
          e.centralized &&
          !e.name.toLowerCase().includes("futures") &&
          !e.name.toLowerCase().includes("derivative")
        ),
      keepUnusedDataFor: 0,
    }),
    getCountries: build.query<string[], void>({
      query: () => ({ url: "/api/countries", method: "get" })
    }),

    getExchangesTicker: build.query<Exchange[], string>({
      query: (id) => ({ url: `/exchanges/tickers/${id}`, method: "get" }),
      transformResponse: (response: Exchange[]) => response || [],
      keepUnusedDataFor: 0,
    }),

    getCoinGeckoPrices: build.query<CoinGeckoPrice, string[]>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        
        const [coinId, exchangeId, base, target] = params;
        
        for (let attempt = 1; attempt <= 5; attempt++) {
          try {
            const timestamp = Date.now();
            const result = await fetchWithBQ({
              url: `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?exchange_ids=${exchangeId}&_t=${timestamp}`,
              method: "get",
            });
      
            if (!('error' in result)) {
              const tickerData = result.data as Exchange;
              const ticker = tickerData.tickers?.find((t: CoinGeckoTicker) => 
                t.base.toLowerCase() === base.toLowerCase() && 
                t.target.toLowerCase() === target.toLowerCase()
              );
              
              if (ticker) {
                const uniqueKey = `${base}_${target}_${exchangeId}`;
                return { 
                  data: { 
                    [uniqueKey]: { 
                      usd: ticker.last,
                      base: base,
                      target: target,
                      exchangeId: exchangeId
                    } 
                  } as CoinGeckoPrice 
                };
              }
                       
              return { data: {} as CoinGeckoPrice };
            }
      
            throw result.error;
            
          } catch (error: any) {
            const status = error?.status || error?.response?.status;
            const statusCode = typeof status === 'string' ? parseInt(status) : status;
            const isNetworkError = error?.code === 'ERR_NETWORK';
            const is429Error = statusCode === 429;
            
            if ((is429Error || isNetworkError || statusCode >= 500) && attempt < 5) {
              const delayTime = is429Error ? 15000 * attempt : (isNetworkError ? 10000 * attempt : 5000 * attempt);
              await delay(delayTime); 
              continue;
            }
      
            return { error: error };
          }
        }
    
        return { error: { status: 'CUSTOM_ERROR', data: 'Max retries reached' } };
      },
    }),

    getExchangesWithTickers: build.query<Exchange, string>({
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
        for (let attempt = 1; attempt <= 5; attempt++) {
          try {
            const result = await fetchWithBQ({
              url: `https://api.coingecko.com/api/v3/exchanges/${id}/tickers?page=1&order=volume`,
              method: "get",
            });
      
            if (!('error' in result)) {
              return { data: result.data as Exchange };
            }
      
            throw result.error;
            
          } catch (error: any) {
            const status = error?.status || error?.response?.status;
            const statusCode = typeof status === 'string' ? parseInt(status) : status;
            const isNetworkError = error?.code === 'ERR_NETWORK';
            const is429Error = statusCode === 429;
            
            if ((is429Error || isNetworkError || statusCode >= 500) && attempt < 5) {
              const delayTime = is429Error ? 15000 * attempt : (isNetworkError ? 10000 * attempt : 5000 * attempt);
              await delay(delayTime); 
              continue;
            }
      
            return { error: error };
          }
        }
    
        return { error: { status: 'CUSTOM_ERROR', data: 'Max retries reached' } };
      },
      keepUnusedDataFor: 0,
    })
  }),
});

export const { 
  useGetExchangesQuery, 
  useGetCountriesQuery, 
  useGetExchangesTickerQuery, 
  useLazyGetExchangesTickerQuery,
  useGetCoinGeckoPricesQuery, 
  useGetExchangesWithTickersQuery 
} = cexApi;