import appAxios from "@/libs/axios/axios";
import { IExchangeAccountList, IManagedOrderList, IPositionList } from "./types";

export const userDetailsService = {
  getExchangeAccountList: async (userId: string): Promise<IExchangeAccountList> => {
    const response = await appAxios.get<IExchangeAccountList>(`/api/admin/users/${userId}/accounts`);
    return response.data;
  },
  getAccountPositionList: async (userId: string, accountNumber: string): Promise<IPositionList> => {
    const response = await appAxios.get<IPositionList>(`/api/admin/users/${userId}/accounts/${accountNumber}/positions`);
    return response.data;
  },
  getManagedOrderList: async (userId: string, accountNumber: string): Promise<IManagedOrderList> => {
    const response = await appAxios.get<IManagedOrderList>(`/api/admin/users/${userId}/accounts/${accountNumber}/orders`);
    return response.data;
  }
};
