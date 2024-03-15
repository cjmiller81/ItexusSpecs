import { apiDateFormatString } from "@/constants/Common"
import { appAxios } from "@/libs/axios/customAxios"
import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { Wallet } from "@/models/Wallet/Wallet"
import moment from "moment"

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
  getHistoricalWalletData: async (
    symbols: { symbol: string; qty: number }[],
    startDate: Date,
    endDate: Date,
    compareSymbol: string,
  ): Promise<HistoricalWalletData[]> => {
    const response = await appAxios.post(`/model/run/walletValueIndex`, symbols, {
      params: {
        startDate: moment(startDate).format(apiDateFormatString),
        endDate: moment(endDate).format(apiDateFormatString),
        compareSymbol,
      },
    })

    return response.data;
  },
}
