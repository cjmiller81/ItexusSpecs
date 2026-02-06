import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPlatform } from "components";

export const chainsApi = createApi({
  reducerPath: "chainsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_API_URL,
    credentials: 'include',
  }),
  endpoints: builder => ({
    getChains: builder.query<IPlatform[], void>({
      query: () => "/chains",
    }),
  }),
});

export const { useGetChainsQuery } = chainsApi