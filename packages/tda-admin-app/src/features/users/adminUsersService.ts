
import appAxios from "@/utils/axios";
import { IAdminUser } from "./iAdminUser"
import { transformData } from "features/users/transformData"


interface Customer {
  id: string;
  name: string;
}

export const adminUsersService = {
  getAll: async (): Promise<IAdminUser[]> => {
    const response = await appAxios.get<IAdminUser[]>(`/api/users`)
    return transformData(response.data)
  },

  getPermissions: async (): Promise<string[]> => {
    const response = await appAxios.get<string[]>(`/api/permissions`)
    return response.data
  },

  getCustomers: async (): Promise<Customer[]> => {
    const response = await appAxios.get<Customer[]>(`/api/customers`)
    return response.data
  },

  update: async (user: IAdminUser): Promise<void> => {
    const response = await appAxios.patch(`/api/users/${user.id}`, user)
    return response.data
  },

  updateRoles: async (id: string | null, roles: any): Promise<void> => {
    const response = await appAxios.patch(`/api/users/${id}`, roles)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    return appAxios.delete(`/api/users/${id}`)
  },
}
