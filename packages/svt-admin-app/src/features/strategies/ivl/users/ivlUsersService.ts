import appAxios from "@/libs/axios/axios";
import { IvlUser, IIvlStrategiesResponse } from "./IvlUser";
import { CapitalAllocation } from "./details/capitalAllocation";
import { Billing } from "./details/billing";
import { Order } from "./details/order";
import { Bot } from "./details/bot";
import { OpenPosition } from "./details/openPosition";
import { ICurrentDayFills } from "./details/currentDayFillsInterface";
import { IWorkingOrder } from "./details/workingOrderInterface";

export const ivlUsersService = {
  update: async (user: IvlUser): Promise<void> => {
    const response = await appAxios.put(`/api/admin/strategies/ivl/${user.userId}`, user);
    return response.data;
  },
  getAll: async (): Promise<IIvlStrategiesResponse> => {
    const response = await appAxios.get<IIvlStrategiesResponse>(`/api/admin/strategies/ivl`);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/admin/strategies/ivl/${id}`);
  },
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await appAxios.get<Order[]>(`/api/ivl/users/${userId}/orders`);
    return response.data;
  },
  getUserBots: async (userId: string): Promise<Bot> => {
    const response = await appAxios.get<Bot>(`/api/admin/strategies/ivl/${userId}`);
    return response.data;
  },
  getUserCapitalAllocations: async (userId: string): Promise<CapitalAllocation[]> => {
    const response = await appAxios.get<CapitalAllocation[]>(`/api/ivl/users/${userId}/capital-allocations`);
    return response.data;
  },
  getUserBillings: async (userId: string): Promise<Billing[]> => {
    const response = await appAxios.get<Billing[]>(`/api/ivl/users/${userId}/billing`);
    return response.data;
  },
  getOpenPositions: async (userId: string, accountNumber: string, symbol: string): Promise<OpenPosition[]> => {
    const response = await appAxios.get<OpenPosition[]>(
      `/api/admin/users/${userId}/accounts/${accountNumber}/positions/${symbol}`,
    );
    return response.data;
  },
  getCurrentDayFills: async (userId: string): Promise<ICurrentDayFills[]> => {
    const response = await appAxios.get<ICurrentDayFills[]>(`/api/ivl/users/${userId}/current-day-fills`);
    return response.data;
  },
  getUserWorkingOrders: async (userId: string): Promise<IWorkingOrder[]> => {
    const response = await appAxios.get<IWorkingOrder[]>(`/api/ivl/users/${userId}/working-orders`);
    return response.data;
  },
};
