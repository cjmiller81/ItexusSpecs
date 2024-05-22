import { TokenDetails } from "@/models/Wallet/TokenDetails"
import { delay } from "@/utils/common"
import { appAxios } from "components"
import { ICategory, ICoin, IPlatform, IPrefilterTokensFilterValues } from "./backend-api.service"

//TODO Add retry logic for axios requests
type ApiFilterModel = Omit<IPrefilterTokensFilterValues, "filter"> & { filter: string }

function ToApiFilterModel(filterModel: IPrefilterTokensFilterValues): ApiFilterModel {
  return { ...filterModel, filter: JSON.stringify(filterModel.filter) }
}
export const iconsApi = {
  getAll: async (): Promise<ICoin[]> => {
    const response = await appAxios.get<ICoin[]>(`/tokens`)
    return response.data
  },

  createTokensFilter: async (filter: IPrefilterTokensFilterValues) => {
    const apiFilterModel = ToApiFilterModel(filter)
    await appAxios.post<IPrefilterTokensFilterValues[]>(`/tokens-filters`, apiFilterModel)
  },

  deleteTokensFilter: async (id: string) => {
    await appAxios.delete<IPrefilterTokensFilterValues[]>(`/tokens-filters/${id}`)
  },

  updateFilter: async (filterModel: IPrefilterTokensFilterValues) => {
    const apiFilterModel = ToApiFilterModel(filterModel)
    await appAxios.post<IPrefilterTokensFilterValues[]>(`/tokens-filters`, apiFilterModel)
  },

  getAllFilters: async (): Promise<IPrefilterTokensFilterValues[]> => {
    const response = await appAxios.get<ApiFilterModel[]>(`/tokens-filters`)
    return response.data.map(apiFilterModel => ({ ...apiFilterModel, filter: JSON.parse(apiFilterModel.filter) }))
  },

  getAllCategories: async (): Promise<ICategory[]> => {
    const response = await appAxios.get<ICategory[]>(`/categories`)
    return response.data
  },
  getAllChains: async (): Promise<IPlatform[]> => {
    const response = await appAxios.get<IPlatform[]>(`/chains`)
    return response.data
  },
  getbyId: async (id: string) => {
    const response = await appAxios.get<ICoin>(`/tokens/${id}`)
    return response.data
  },

  getIcons: async (searchQuery?: string, signal?: AbortSignal): Promise<TokenDetails[]> => {
    const response = await appAxios.get<TokenDetails[]>(`/tokens-search`, {
      signal: signal,
      params: {
        query: searchQuery,
      },
    })

    return response.data
  },
}

export const iconsDelayedApi = {
  getIcons: async (searchQuery?: string, signal?: AbortSignal, delayTime?: number): Promise<TokenDetails[]> => {
    if (delayTime) await delay(delayTime)
    signal?.throwIfAborted()
    return await iconsApi.getIcons(searchQuery, controller.signal)
  },
}

let controller = new AbortController()
export const iconsAbortableApi = {
  getIcons: async (searchQuery?: string): Promise<TokenDetails[]> => {
    controller.abort("aborted")
    controller = new AbortController()
    return await iconsDelayedApi.getIcons(searchQuery, controller.signal, 500)
  },
}
