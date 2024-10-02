import appAxios from "@/libs/axios/axios"
import { IvlUser } from "./IvlUser"
import { CapitalAllocation } from "./details/capitalAllocation"
import { Billing } from "./details/billing"
import { Order } from "./details/order"
import { Bot } from "./details/bot"

export const ivlUsersService = {
  update: async (user: IvlUser): Promise<void> => {
    const response = await appAxios.put(`/api/ivl/users/${user.id}`, user)
    return response.data
  },
  getAll: async (): Promise<IvlUser[]> => {
    const response = await appAxios.get<IvlUser[]>(`/api/ivl/users`)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/ivl/users/${id}`)
  },
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await appAxios.get<Order[]>(`/api/ivl/users/${userId}/orders`)
    return response.data
  },
  getUserBots: async (userId: string): Promise<Bot[]> => {
    const response = await appAxios.get<Bot[]>(`/api/ivl/users/${userId}/bots`)
    return response.data
  },
  getUserCapitalAllocations: async (userId: string): Promise<CapitalAllocation[]> => {
    const response = await appAxios.get<CapitalAllocation[]>(`/api/ivl/users/${userId}/capital-allocations`)
    return response.data
  },
  getUserBillings: async (userId: string): Promise<Billing[]> => {
    const response = await appAxios.get<Billing[]>(`/api/ivl/users/${userId}/billing`)
    return response.data
  },
}
