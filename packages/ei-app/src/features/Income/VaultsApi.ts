import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export const vaultsApi = createApi({
  reducerPath: "vaults",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.beefy.finance/" }),

  endpoints: builder => ({
    getAllData: builder.query<any, void>({
      queryFn: async () => {
        try {
          const vaultsPromise = fetch("https://api.beefy.finance/vaults").then(res => res.json());
          const apyPromise = fetch("https://api.beefy.finance/apy/breakdown").then(res => res.json());
          const tvlPromise = fetch("https://api.beefy.finance/tvl").then(res => res.json());

          const [vaultsData, apyData, tvlData] = await Promise.all([vaultsPromise, apyPromise, tvlPromise]);

          return { data: { vaults: vaultsData, apy: apyData, tvl: tvlData } };
        } catch (error: any) {
          const baseQueryError: FetchBaseQueryError = {
            status: "CUSTOM_ERROR",
            error: error.message || "An error occurred while fetching data",
          };
          return { error: baseQueryError };
        }
      },
    }),
  }),
});

export const { useGetAllDataQuery } = vaultsApi;
