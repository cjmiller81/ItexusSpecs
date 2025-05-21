import { TokenSearchItem } from "@/models/Wallet/TokenSearchItem"
import { appAxios, delay, PaginatedList } from "components"
import { ICategory } from "components/src/models/token/ICatigory"
import { ICoin } from "components/src/models/token/ICoin"
import { IPlatform } from "components/src/models/token/IPlatform"
import { IPrefilterTokensFilterValues } from "components/src/models/token/IPrefilterTokensFilterValues"

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

  getIcons: async (searchQuery?: string, pageNumber?: number, chainId?: number, pageSize?: number, signal?: AbortSignal): Promise<PaginatedList<TokenSearchItem>> => {
    const response = await appAxios.get<PaginatedList<TokenSearchItem>>(`/tokens-searchV2`, {
      signal: signal,
      params: {
        query: searchQuery,
        pageSize: pageSize || 100,
        pageNumber: pageNumber || 0,
        chainId: chainId,
      },
    })

    return response.data
  },

  getIconsV2: async (
  searchQuery?: string,
  pageNumber?: number,
  pageSize?: number,
  anyOfAddresses?: string[],
  chainId?: number,
  signal?: AbortSignal
  ): Promise<PaginatedList<TokenSearchItem>> => {
    const response = await appAxios.post<PaginatedList<TokenSearchItem>>(
      `/tokens-searchV2`,
      anyOfAddresses ?? [],
      {
        signal,
        params: {
          query: searchQuery,
          pageSize: pageSize ?? 10,
          pageNumber: pageNumber ?? 0,
          chainId: chainId,
        },
      }
    )

    return response.data
  },
}

export const iconsDelayedApi = {
  getIcons: async (searchQuery?: string, pageNumber?: number, pageSize?: number, chainId?: number, signal?: AbortSignal, delayTime?: number): Promise<PaginatedList<TokenSearchItem>> => {
    if (delayTime) await delay(delayTime)
    signal?.throwIfAborted()
    return await iconsApi.getIcons(searchQuery, pageNumber, pageSize,chainId, controller.signal)
  },
}

let controller = new AbortController()
export const iconsAbortableApi = {
  getIcons: async (searchQuery?: string, pageNumber?: number, pageSize?: number, chainId?: number, delayTime?: number): Promise<PaginatedList<TokenSearchItem>> => {
    controller.abort("aborted")
    controller = new AbortController()
    return await iconsDelayedApi.getIcons(searchQuery, pageNumber, pageSize,chainId, controller.signal, delayTime || 500)
  },
}
