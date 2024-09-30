import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
          return { error: { message: error.message } };
        }
      },
    }),
  }),
});

export const { useGetAllDataQuery } = vaultsApi;
