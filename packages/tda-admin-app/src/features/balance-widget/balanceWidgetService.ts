import appAxios from "@/utils/axios"
import { CustomerBalanceModel } from "./BalanceModel"

export const balancesWidgetService = {
    getAll: async (): Promise<CustomerBalanceModel[]> => {
      const response = await appAxios.get<CustomerBalanceModel[]>(`api/customers/customerBalance`)
      return response.data;
    }
}