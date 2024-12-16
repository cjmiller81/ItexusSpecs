import appAxios from "@/libs/axios/axios"
import { IDteStrategiesResponse, IDteStrategy, StrategyBot, StrategyBotList } from "./types"
import { OpenPosition } from "./details/openPosition"
import { ICurrentDayFills } from "./details/currentDayFillsInterface"
import { IWorkingOrder } from "./details/workingOrderInterface"

export const dteUsersService = {
  getAll: async (): Promise<IDteStrategiesResponse> => {
    return (await appAxios.get<IDteStrategiesResponse>(`/api/admin/strategies/zeroDteFlyStrategy`)).data;
  },
  getBots: async (userId: string): Promise<StrategyBotList> => {
    return (await appAxios.get<StrategyBotList>(`/api/admin/strategies/zeroDteFlyStrategy/${userId}`)).data;
  },
  startBot: async (userId: string, accountNumber: string, masterSymbol: string): Promise<StrategyBot> => {
    return (await appAxios.post(`/api/admin/strategies/zeroDteFlyStrategy/${userId}/${accountNumber}/${masterSymbol}/start`)).data;
  },
  stopBot: async (userId: string, accountNumber: string, masterSymbol: string): Promise<StrategyBot> => {
    return (await appAxios.post(`/api/admin/strategies/zeroDteFlyStrategy/${userId}/${accountNumber}/${masterSymbol}/stop`)).data;
  },
  forceStopExitBot: async (userId: string, accountNumber: string, masterSymbol: string): Promise<StrategyBot> => {
    return (await appAxios.post(`/api/admin/strategies/zeroDteFlyStrategy/${userId}/${accountNumber}/${masterSymbol}/forceStopExitOrder`)).data;
  },
  resetBot: async (userId: string, accountNumber: string, masterSymbol: string): Promise<StrategyBot> => {
    return (await appAxios.post(`/api/admin/strategies/zeroDteFlyStrategy/${userId}/${accountNumber}/${masterSymbol}/reset`)).data;
  },
  // not used functions below
  update: async (user: IDteStrategy): Promise<void> => {
    const response = await appAxios.put(`/api/zero-dte/users/${user.userId}`, user)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/zero-dte/users/${id}`)
  },
  getOpenPositions: async (userId: string, accountNumber: string, symbol: string): Promise<OpenPosition[]> => {
    const response = await appAxios.get<OpenPosition[]>(`/api/admin/users/${userId}/accounts/${accountNumber}/positions/${symbol}`)
    return response.data
  },
  getCurrentDayFills: async (userId: string, accountNumber: string, orderId: string): Promise<ICurrentDayFills[]> => {
    const response = await appAxios.get<ICurrentDayFills[]>(`/api/admin/users/${userId}/accounts/${accountNumber}/orders/${orderId}`)
    return response.data
  },
  getUserWorkingOrders: async (userId: string, accountNumber: string, orderId: string): Promise<IWorkingOrder[]> => {
    const response = await appAxios.get<IWorkingOrder[]>(`/api/admin/users/${userId}/accounts/${accountNumber}/orders/${orderId}`)
    return response.data
  },
}