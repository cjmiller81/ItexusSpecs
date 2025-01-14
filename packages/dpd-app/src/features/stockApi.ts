import { Market } from "@/models/Market";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const stockApi = createApi({
    reducerPath: "stockApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.BACKEND_API_URL,
    }),
    endpoints: builder => ({
        getStockData: builder.query<Market[], { ticker: string; fromDate: string; toDate: string }>({
            query: ({ ticker, fromDate, toDate }) => ({
                url: `/api/finra/regSohDaily/${ticker}/${fromDate}/${toDate}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetStockDataQuery } = stockApi;
