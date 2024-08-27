import moment from "moment"
import { Wallet } from "../models/wallet/wallet"
import { HistoricalWalletData } from "../models/wallet/historicalWalletData"
import { appAxios } from "../lib/axios/customAxios"
import { CapHistoricalWeightedDate } from "../models/wallet/capHistoricalWeightedDate"
import { apiDateFormatString } from "../constants/common"

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
    tokensIds: string[],
    compareSymbolId?: string,
  ): Promise<CapHistoricalWeightedDate[]> => {
    const response = await appAxios.get(`/model/run/marketCapWeightedIndex?${tokensIds.map((n, index) => `tokensIds=${n}`).join('&')}`, {
      params: {
        startDate: ToUtcDateFormatted(startDate),
        endDate: ToUtcDateFormatted(endDate),
        compareTokenId: compareSymbolId,
        tokensIds,
      },
    })

    return response.data
  },
}

function ToUtcDateFormatted(date: Date) {
  return moment(date).utc().format(apiDateFormatString)
}
