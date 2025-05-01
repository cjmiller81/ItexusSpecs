import { AxiosResponse } from "axios";
import { appAxios } from "../lib/axios/customAxios";
import { Kraken } from "../models/wallet/kraken";
import { toast } from "react-toastify";

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
            toast.error(getKrakenErrorMessage(error));
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
            toast.error(getKrakenErrorMessage(error));
            throw new Error("Fetching Kraken account balance failed");
        }
    },
};

export const getKrakenErrorMessage = (error) => {
    const response = (error as any).response as AxiosResponse<any, any>;
    const { title, detail } = response?.data || {};
    let message = '';
    
    if (title) {
         message += title;
    } else {
        message += error.message || "An unknown error occurred";
    }
    
    if (detail) {
        message += `: ${detail}`;
    }

    return message;
}
