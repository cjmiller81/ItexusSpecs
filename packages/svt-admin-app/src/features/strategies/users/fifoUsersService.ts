import appAxios from "@/libs/axios/axios"
import { IFifoUser } from "./iFifoUser"
import {  Bot } from "./details/bot"
import { Order } from "./details/order"

export const fifoUsersService = {
  update: async (user: IFifoUser): Promise<void> => {
    const response = await appAxios.put(`/api/fifo/users/${user.id}`, user)
    return response.data
  },
  getAll: async (): Promise<IFifoUser[]> => {
    const response = await appAxios.get<IFifoUser[]>(`/api/fifo/users`)
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/fifo/users/${id}`)
  },
  getUserBots: async (userId: string): Promise<Bot[]> => {
    const response = await appAxios.get<Bot[]>(`/api/fifo/users/${userId}/bots`)
    return response.data
  },
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const response = await appAxios.get<Order[]>(`/api/fifo/users/${userId}/orders`)
    return response.data
  },
}
