import appAxios from "@/libs/axios/axios";
import { Mechanical0DteSpx, Mechanical0DteSpxList } from "./users/types";


export const dteMechanicalUsersService = {
  getAll: async (): Promise<Mechanical0DteSpxList> => {
    const response = await appAxios.get<Mechanical0DteSpxList>("/api/admin/strategies/machanical0DteSpx");
    return response.data;
  },

  getByAccountNumber: async (accountNumber: string): Promise<Mechanical0DteSpxList> => {
    const response = await appAxios.get<Mechanical0DteSpxList>(`/api/admin/strategies/mechanical0DteSpx/tastytrade/${accountNumber}`);
    return response.data;
  },

  getById: async (accountNumber: string, strategyId: string): Promise<Mechanical0DteSpx> => {
    const response = await appAxios.get<Mechanical0DteSpx>(`/api/admin/strategies/mechanical0DteSpx/tastytrade/${accountNumber}/${strategyId}`);
    return response.data;
  },

  deleteStrategy: async (accountNumber: string, strategyId: string): Promise<void> => {
    await appAxios.delete(`/api/admin/strategies/mechanical0DteSpx/tastytrade/${accountNumber}/${strategyId}`);
  },

  startStrategy: async (accountNumber: string, strategyId: string): Promise<void> => {
    await appAxios.post(`/api/admin/strategies/mechanical0DteSpx/tastytrade/${accountNumber}/${strategyId}/start`);
  },

  stopStrategy: async (accountNumber: string, strategyId: string): Promise<void> => {
    await appAxios.post(`/api/admin/strategies/mechanical0DteSpx/tastytrade/${accountNumber}/${strategyId}/stop`);
  },

  editStrategy: async (accountNumber: string, strategyId: string, data: Partial<Mechanical0DteSpx>): Promise<Mechanical0DteSpx> => {
    const response = await appAxios.post<Mechanical0DteSpx>(
      `/api/admin/strategies/mechanical0DteSpx/tastytrade/${accountNumber}/${strategyId}`,
      data
    );
    return response.data;
  },
};
