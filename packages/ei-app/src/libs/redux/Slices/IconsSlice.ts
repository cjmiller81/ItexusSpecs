import { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import { TokenDetails } from "@/models/Wallet/TokenDetails"
import { iconsAbortableApi } from "@/services/iconsService"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./UiSlice"

interface IconsState {
  iconsFetchingStatus: Status
  icons: TokenDetails[]
  currentSearch?: string
  lookUpOptions: LookUpOption[]
  cachedIcons: { [searchQuery: string]: TokenDetails[] }
}

const initialState: IconsState = {
  iconsFetchingStatus: "idle",
  icons: [],
  lookUpOptions: [],
  cachedIcons: {},
}

export const IconsSlice = createAppSlice({
  name: "icons",
  initialState,
  reducers: create => ({
    clearSearchResult: create.reducer(state => {
      state.icons = []
      state.lookUpOptions = []
    }),
    searchIcons: create.asyncThunk(
      async (payload: { query?: string }, thunkApi): Promise<{ query?: string; tokens: TokenDetails[] }> => {
        const response = await iconsAbortableApi.getIcons(payload.query)
        return { query: payload.query, tokens: response }
      },
      {
        pending: (state, action) => {
          state.currentSearch = action.meta.arg.query
          state.iconsFetchingStatus = "loading"
        },
        fulfilled: (state, action) => {
          state.iconsFetchingStatus = "idle"
          state.lookUpOptions = action.payload.tokens.map<LookUpOption>(icon => ({
            label: `${icon.sym.toUpperCase()} - ${icon.name}`,
            iconUrl: icon.lURI,
            symbol: icon.sym
          }))
          state.icons = action.payload.tokens
        },
        rejected: (state, error) => {
          if (error?.error.message !== "aborted" && state.iconsFetchingStatus !== "loading") {
            state.iconsFetchingStatus = "failed"
          }

          if (
            error?.error.message === "aborted" &&
            error.meta.arg.query === state.currentSearch &&
            state.iconsFetchingStatus !== "loading"
          ) {
            state.iconsFetchingStatus = "idle"
          }
        },
      },
    ),
  }),
})

export const { searchIcons, clearSearchResult } = IconsSlice.actions
