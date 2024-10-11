import appAxios from "../../../libs/axios/axios";
import { IBankAccount } from "mocks/initBankAccounts";

export const bankAccountsService = {
  getAll: async (): Promise<IBankAccount[]> => {
    try {
      const response = await appAxios.get<IBankAccount[]>(`/api/bank/accounts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await appAxios.delete(`/api/bank/accounts/${id}`);
  },

  add: async (newAccount: IBankAccount): Promise<IBankAccount> => {
    const response = await appAxios.post<IBankAccount>(`/api/bank/accounts`, newAccount);
    return response.data;
  },
};
