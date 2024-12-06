import appAxios from "@/libs/axios/axios"
import { IDteStrategiesResponse, IDteStrategy } from "./types"
import { Bot } from "./details/bot"
import { OpenPosition } from "./details/openPosition"
import { ICurrentDayFills } from "./details/currentDayFillsInterface"
import { IWorkingOrder } from "./details/workingOrderInterface"

export const dteUsersService = {
  update: async (user: IDteStrategy): Promise<void> => {
    const response = await appAxios.put(`/api/zero-dte/users/${user.userId}`, user)
    return response.data
  },
  getAll: async (): Promise<IDteStrategiesResponse> => {
    const response = await appAxios.get<IDteStrategiesResponse>(`/api/admin/strategies/zeroDteFlyStrategy`)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/zero-dte/users/${id}`)
  },
  getUserBots: async (userId: string): Promise<Bot[]> => {
    const response = await appAxios.get<Bot[]>(`/api/zero-dte/users/${userId}/bots`)
    return response.data
  },
  getOpenPositions: async (userId: string): Promise<OpenPosition[]> => {
    const response = await appAxios.get<OpenPosition[]>(`/api/zero-dte/users/${userId}/open-positions`)
    return response.data
  },
  getCurrentDayFills: async (userId: string): Promise<ICurrentDayFills[]> => {
    const response = await appAxios.get<ICurrentDayFills[]>(`/api/zero-dte/users/${userId}/current-day-fills`)
    return response.data
  },
  getUserWorkingOrders: async (userId: string): Promise<IWorkingOrder[]> => {
    const response = await appAxios.get<IWorkingOrder[]>(`/api/zero-dte/users/${userId}/working-orders`)
    return response.data
  },
}