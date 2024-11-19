import appAxios from "@/utils/axios"
import { CustomerTransactionData } from "./types";

export const settlementService = {
    getTransactions: async (startDate: Date, endDate: Date): Promise<CustomerTransactionData[]> => {
      const response = await appAxios.get<CustomerTransactionData[]>(
        `api/customers/customerTransaction?startDate=${startDate}&endDate=${endDate}`)
      return response.data;
    },
    getTransactionHistories: async (startDate: Date, endDate: Date): Promise<CustomerTransactionData[]> => {
        const response = await appAxios.get<CustomerTransactionData[]>(
          `api/customers/customerTransactionHistory?startDate=${startDate}&endDate=${endDate}`)
        return response.data;
      }
}