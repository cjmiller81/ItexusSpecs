import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { PoolApiResponse } from "./Models/PoolApiResponse";

type PoolsQueryArgs = {
  sorter?: string;
  filter?: string;
  skip?: number;
  take?: number;
};

type PoolLookupArgs = {
  search?: string;
};

export const defisApi = createApi({
  reducerPath: "defiPool",
  baseQuery: axiosBaseQuery(),
  endpoints(build) {
    return {
      getPools: build.query<PoolApiResponse, PoolsQueryArgs | void>({
        query: (args) => {
          const params = {
            sorter: args?.sorter ?? "[]",
            filter: args?.filter ?? "[]",
            skip: args?.skip ?? 0,
            take: args?.take ?? 20,
          };

          return {
            url: "/api/defi/pools",
            method: "get",
            params,
          };
        },
      }),
      getPoolSymbols: build.query<string[], PoolLookupArgs | void>({
        async queryFn(args, _api, _extra, baseQuery) {
          const search = args?.search?.trim();

          if (!search || search.length < 2) {
            return { data: [] };
          }

          const result = await baseQuery({
            url: `/api/defi/pools/symbols`,
            method: "get",
            params: {
              searchString: search,
            },
          });

          if ("error" in result && result.error) {
            return { error: result.error } as any;
          }

          return { data: result.data as string[] };
        },
      }),
      getPoolProjects: build.query<string[], PoolLookupArgs | void>({
        async queryFn(args, _api, _extra, baseQuery) {
          const search = args?.search?.trim();

          if (!search || search.length < 2) {
            return { data: [] };
          }

          const result = await baseQuery({
            url: `/api/defi/pools/projects`,
            method: "get",
            params: {
              searchString: search,
            },
          });

          if ("error" in result && result.error) {
            return { error: result.error } as any;
          }

          return { data: result.data as string[] };
        },
      }),
    };
  },
});

export const { useGetPoolsQuery, useGetPoolSymbolsQuery, useLazyGetPoolSymbolsQuery, useGetPoolProjectsQuery, useLazyGetPoolProjectsQuery } = defisApi;
