import { appAxios } from "components";

interface ICurrencyWithdrawal {
  id: string | undefined;
  amount: number;
  currency: string;
  destination: string;
  label: string | undefined;
}

export const currencyWithdrawal = {
  submitCurrencyWithdrawal: async (data: ICurrencyWithdrawal): Promise<void> => {
    try {
      await appAxios.post(`/settlement/request`, data);
    } catch (error) {
      console.error("Error submitting settlement request:", error);
      throw error;
    }
  },
};
