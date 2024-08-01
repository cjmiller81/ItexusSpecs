import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PoolApiResponse } from "./Models/PoolApiResponse";

export const defisApi = createApi({
  reducerPath: "defiPool",
  baseQuery: axiosBaseQuery(),
  endpoints(build) {
    return {
      getPools: build.query<PoolApiResponse, void>({ query: () => ({ url: "/api/defi/pools", method: "get" }) }),
    };
  },
});

export const { useGetPoolsQuery } = defisApi;
