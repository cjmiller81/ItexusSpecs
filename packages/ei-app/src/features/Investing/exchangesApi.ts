import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IExchange } from "components";

export const exchangesApi = createApi({
  reducerPath: "exchangesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_API_URL,
    credentials: 'include',
  }),
  endpoints: builder => ({
    getExchanges: builder.query<IExchange[], void>({
      query: () => "/exchanges",
    }),
  }),
});

export const { useGetExchangesQuery } = exchangesApi;
