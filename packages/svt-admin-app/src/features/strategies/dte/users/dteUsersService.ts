import appAxios from "@/libs/axios/axios"
import { IDteUser } from "./iDteUser"
import { Bot } from "./details/bot"
import { OpenPosition } from "./details/openPosition"
import { ICurrentDayFills } from "./details/currentDayFillsInterface"
import { IWorkingOrder } from "./details/workingOrderInterface"

export const dteUsersService = {
  update: async (user: IDteUser): Promise<void> => {
    const response = await appAxios.put(`/api/zero-dte/users/${user.id}`, user)
    return response.data
  },
  getAll: async (): Promise<IDteUser[]> => {
    const response = await appAxios.get<IDteUser[]>(`/api/zero-dte/users`)
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