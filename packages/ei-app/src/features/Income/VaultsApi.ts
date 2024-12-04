import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export const vaultsApi = createApi({
  reducerPath: "vaults",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.beefy.finance/" }),
  endpoints: builder => ({
    getAllData: builder.query<any, void>({
      queryFn: async () => {
        try {
          const vaultsPromise = fetch(`${process.env.BACKEND_API_URL}/api/beefy/vaults`).then(res => res.json());
          const vaultsData = await vaultsPromise;

          return {
            data: {
              vaults: vaultsData.data,
            },
          };
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
