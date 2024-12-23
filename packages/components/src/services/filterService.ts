import moment from "moment"
import { Wallet } from "../models/wallet/wallet"
import { HistoricalWalletData } from "../models/wallet/historicalWalletData"
import { appAxios } from "../lib/axios/customAxios"
import { CapHistoricalWeightedDate } from "../models/wallet/capHistoricalWeightedDate"
import { apiDateFormatString } from "../constants/common"
import { ICategory, IExchange, IPlatform } from "../models"

export const filtersApi = {
    getChains: async (): Promise<IPlatform[]> => {
        const response = await appAxios.get<IPlatform[]>(`/chains`)
        return response.data
    },

    getCategories: async (): Promise<ICategory[]> => {
        const response = await appAxios.get<ICategory[]>(`/categories`)
        return response.data
    },

    getExchanges: async (): Promise<IExchange[]> => {
        const response = await appAxios.get<IExchange[]>(`/exchanges`)
        return response.data
    },
}


