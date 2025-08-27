import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export type Exchange = {
  id: string;
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
}

type ConvertedVolume = {
  usd: number;
}

export const cexApi = createApi({
  reducerPath: "cex",
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getExchanges: build.query<Exchange[], void>({
      query: () => ({ url: "/exchanges", method: "get" }),
      transformResponse: (response: Exchange[]) =>
        response.filter(e => e.centralized),
    }),
    getExchangesWithTickers: build.query<Exchange[], void>({
      query: () => ({ url: "/exchanges?includeTickers=true", method: "get" }),
      transformResponse: (response: Exchange[]) =>
        response.filter(e => e.centralized),
    }),
  }),
});

export const { useGetExchangesQuery, useGetExchangesWithTickersQuery } = cexApi;