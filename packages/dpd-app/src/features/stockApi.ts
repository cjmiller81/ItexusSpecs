import { Market } from "@/models/Market";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stockApi = createApi({
    reducerPath: "stockApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getStockData: builder.query<Market[], { stocksTicker: string; fromDate: string; toDate: string }>({
            query: ({ stocksTicker, fromDate, toDate }) => {
                return {
                    url: `/api/finra/regSohDaily/${stocksTicker}/${fromDate}/${toDate}`,
                    method: "GET",
                };
            },
        }),
    }),
});

export const { useGetStockDataQuery } = stockApi;

