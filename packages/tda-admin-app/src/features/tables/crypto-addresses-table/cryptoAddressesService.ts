import appAxios from "../../../libs/axios/axios";
import { ICryptoAddresses } from "mocks/initCryptoAddresses";

export const cryptoAddressesService = {
  getAll: async (): Promise<ICryptoAddresses[]> => {
    try {
      const response = await appAxios.get<ICryptoAddresses[]>(`/api/cryptoAddress`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await appAxios.delete(`/api/cryptoAddress/${id}`);
  },

  add: async (newAccount: ICryptoAddresses): Promise<ICryptoAddresses> => {
    const response = await appAxios.post<ICryptoAddresses>(`/api/cryptoAddress`, newAccount);
    return response.data;
  },
};
