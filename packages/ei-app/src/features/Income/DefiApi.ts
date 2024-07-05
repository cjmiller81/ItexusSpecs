import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export const defisApi = createApi({
  reducerPath: "defiPool",
  baseQuery: axiosBaseQuery(),
  endpoints(build) {
    return {
      getPools: build.query({ query: () => ({ url: "/api/defi/pools", method: "get" }) }),
    };
  },
});

export const { useGetPoolsQuery } = defisApi;
