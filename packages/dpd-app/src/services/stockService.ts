import appAxios from "@/libs/axios/axios"
import { Market } from "@/models/Market"
import { Moment } from "moment";

export const stockService = {
    get: async ({ startDate, endDate, ticker }: { startDate: Moment | Date; endDate: Moment | Date; ticker: string }): Promise<Market[]> => {
        const url = `/api/dpd/${ticker}/range/${startDate}/${endDate}`;
        const response = await appAxios.get<Market[]>(url);
        return response.data;
    }
};

