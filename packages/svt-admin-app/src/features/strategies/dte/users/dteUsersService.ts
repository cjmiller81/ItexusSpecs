import appAxios from "@/libs/axios/axios"
import { IDteUser } from "./iDteUser"
import { Bot } from "./details/bot"

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
}