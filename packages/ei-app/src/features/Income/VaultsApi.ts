import { axiosBaseQuery } from "@/libs/axios/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { VaultsApiResponse, BoostsApiResponse } from "./Models/VaultsApiResponse";
import axios from "axios"; // Adjust this import based on your model structure

export const vaultsApi = createApi({
  reducerPath: "vaultsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: build => ({
    getVaults: build.query<VaultsApiResponse, void>({
      query: () => ({ url: "https://api.beefy.finance/vaults", method: "get" }),
    }),
    getBoosts: build.query<BoostsApiResponse, void>({
      query: () => ({ url: "https://api.beefy.finance/boosts", method: "get" }),
    }),
    getChainLogos: build.query<{ [key: string]: string }, { chains: { [key: string]: string } }>({
      queryFn: async ({ chains }, api) => {
        const logoData: { [key: string]: string } = {};
        try {
          const logoPromises = Object.entries(chains).map(async ([chain, symbol]) => {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${symbol}`);
            const coinData = response.data;
            if (coinData?.image?.thumb) {
              logoData[chain] = coinData.image.thumb; // Store the logo URL
            }
          });
          await Promise.all(logoPromises); // Wait for all logo fetches
          return { data: logoData }; // Return fetched logos
        } catch (error) {
          console.error("Error fetching chain logos:", error);
          return { error: { status: "CUSTOM_ERROR", message: error.message } }; // Return error to Redux
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetVaultsQuery, useGetBoostsQuery, useGetChainLogosQuery } = vaultsApi;
