import { appAxios } from "@/libs/axios/customAxios"
import { Wallet } from "@/models/Wallet/Wallet"

export const walletsApi = {
  getWalletsAssets: async (): Promise<Wallet[]> => {
    const response = await appAxios.get<Wallet[]>(`/user/wallet`)
    return response.data
  },

  deleteWallet: async (wallet: string): Promise<void> => {
    return appAxios.delete(`/user/wallet/${wallet}`)
  },

  addWallets: async (wallet: string): Promise<void> => {
    return appAxios.post(`/user/wallet`, [
      {
        address: wallet,
      },
    ])
  },
}
