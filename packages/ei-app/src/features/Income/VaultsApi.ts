import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

export const vaultsApi = createApi({
  reducerPath: "vaults",
  baseQuery: axiosBaseQuery(),
  endpoints: build => ({
    getAllData: build.query<any, any>({
      query: (params = {}) => {
        return {
          url: "/api/beefy/vaults",
          method: "get",
          params,
        };
      },
    }),
  }),
});

export const { useGetAllDataQuery } = vaultsApi;
