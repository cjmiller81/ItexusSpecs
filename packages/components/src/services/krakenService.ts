import { appAxios } from "../lib/axios/customAxios";
import { Kraken } from "../models/wallet/kraken";

export const krakenApi = {
    connectToKraken: async (params: Kraken): Promise<boolean> => {
        try {
            const response = await appAxios.post("/api/kraken/connect", params,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to connect to Kraken:", error);
            throw new Error("Connection to Kraken failed");
        }
    },

    getAccountBalance: async (): Promise<Record<string, number>> => {
        try {
            const response = await appAxios.get("/api/kraken/account-balance", {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch Kraken account balance:", error);
            throw new Error("Fetching Kraken account balance failed");
        }
    },
};
