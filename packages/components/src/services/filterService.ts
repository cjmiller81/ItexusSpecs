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

    getPoolChains: async (): Promise<string[]> => {
        const response = await appAxios.get<string[]>(`/api/defi/pools/chains`)
        return response.data
    },

    getPoolCategories: async (): Promise<string[]> => {
        const response = await appAxios.get<string[]>(`/api/defi/pools/categories`)
        return response.data
    },

    getPoolProjects: async (): Promise<string[]> => {
        const response = await appAxios.get<string[]>(`/api/defi/pools/projects`)
        return response.data
    },

    getPoolSymbols: async (): Promise<string[]> => {
        const response = await appAxios.get<string[]>(`/api/defi/pools/symbols`)
        return response.data
    },
}


