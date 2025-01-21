import { appAxios } from "../lib/axios/customAxios";
import { Kraken } from "../models/wallet/kraken";

export const krakenApi = {
    connectToKraken: async (params: Kraken): Promise<boolean> => {
        try {
            const response = await appAxios.post("/api/kraken/connect", params);
            return response.data;
        } catch (error) {
            console.error("Failed to connect to Kraken:", error);
            throw new Error("Connection to Kraken failed");
        }
    },
};
