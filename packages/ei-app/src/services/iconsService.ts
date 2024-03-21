import { appAxios } from "@/libs/axios/customAxios"
import { TokenDetails } from "@/models/Wallet/TokenDetails"
import { delay } from "@/utils/common"

export const iconsApi = {
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
