import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export type Exchange = {
  id: string;
  country: string | null;
  name: string;
  url: string;
  centralized: boolean;
  tickers?: Ticker[];
}

type Ticker = {
    base: string,
    target: string,
    last: number,
    volume: number,
    converted_volume: ConvertedVolume
    coin_id: string
}

type ConvertedVolume = {
  usd: number;
}


export type CoinGeckoPrice = {
  [key: string]: {
    [key: string]: number;
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
    }),
    getCountries: build.query<string[], void>({
      query: () => ({ url: "/api/countries", method: "get" })
    }),

    getExchangesTicker: build.query<Exchange[], string>({
      query: (id) => ({ url: `/exchanges/tickers/${id}`, method: "get" }),
      transformResponse: (response: Exchange[]) => response || [],
    }),

    getCoinGeckoPrices: build.query<CoinGeckoPrice, string[]>({
      async queryFn(params, _queryApi, _extraOptions, fetchWithBQ) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        
        const [coinId, exchangeId] = params;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          const result = await fetchWithBQ({
            url: `https://api.coingecko.com/api/v3/coins/${coinId}/tickers?exchange_ids=${exchangeId}`,
            method: "get",
          });
    
          if (!('error' in result)) {
            const tickerData = result.data as any;
            const ticker = tickerData.tickers?.[0];
            
            if (ticker) {
              return { 
                data: { 
                  [coinId]: { 
                    usd: ticker.last 
                  } 
                } as CoinGeckoPrice 
              };
            }
            
            return { data: {} as CoinGeckoPrice };
          }
    
          const status = (result.error as any)?.status;
          if ((status === 429 || status >= 500) && attempt < 3) {
            await delay(5000 * attempt); 
            continue;
          }
    
          return { error: result.error };
        }
    
        return { error: { status: 'CUSTOM_ERROR', data: 'Max retries reached' } };
      },
    }),

    getExchangesWithTickers: build.query<Exchange, string>({
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
        for (let attempt = 1; attempt <= 3; attempt++) {
          const result = await fetchWithBQ({
            url: `https://api.coingecko.com/api/v3/exchanges/${id}/tickers?page=1&order=volume`,
            method: "get",
          });
    
          if (!('error' in result)) {
            return { data: result.data as Exchange };
          }
    
          const status = (result.error as any)?.status;
          if ((status === 429 || status >= 500) && attempt < 3) {
            await delay(5000 * attempt); 
            continue;
          }
    
          return { error: result.error };
        }
    
        return { error: { status: 'CUSTOM_ERROR', data: 'Max retries reached' } };
      },
    })
  }),
});

export const { useGetExchangesQuery, useGetCountriesQuery, useGetExchangesTickerQuery, useGetCoinGeckoPricesQuery, useGetExchangesWithTickersQuery } = cexApi;