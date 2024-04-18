import { apiDateFormatString } from "@/constants/Common"
import { appAxios } from "@/libs/axios/customAxios"
import { CapHistoricalWeightedDate } from "@/models/Wallet/CapHistoricalWeightedDate"
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

  addWallets: async (wallet: string, walletName: string, isPersonal: boolean): Promise<void> => {
    return appAxios.post(`/user/wallet`, [
      {
        address: wallet,
        isPersonal,
        walletName
      },
    ])
  },
  updateWallets: async (wallet: Wallet): Promise<void> => {
    const {chainAssets, ...walletRequest} = wallet
    return appAxios.post(`/user/wallet/${wallet.address}`, walletRequest)
  },
  getHistoricalWalletData: async (
    symbols: { symbol: string; qty: number }[],
    startDate: Date,
    endDate: Date,
    compareSymbol?: string | null,
  ): Promise<HistoricalWalletData[]> => {
    const response = await appAxios.post(`/model/run/walletValueIndex`, symbols, {
      params: {
        startDate: ToUtcDateFormatted(startDate),
        endDate: ToUtcDateFormatted(endDate),
        compareSymbol,
      },
    })

    return response.data
  },
  getHistoricalCapWeightedWalletData: async (
    startDate: Date,
    endDate: Date,
    tokenCount: number,
    compareSymbolId?: string,
  ): Promise<CapHistoricalWeightedDate[]> => {
    const response = await appAxios.get(`/model/run/marketCapWeightedIndex`, {
      params: {
        startDate: ToUtcDateFormatted(startDate),
        endDate: ToUtcDateFormatted(endDate),
        compareTokenId: compareSymbolId,
        tokenCount,
      },
    })

    return response.data
  },
}

function ToUtcDateFormatted(date: Date) {
  return moment(date).utc().format(apiDateFormatString)
}
