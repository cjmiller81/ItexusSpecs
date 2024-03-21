import { TokenDetails } from "@/models/Wallet/TokenDetails"
import { iconsAbortableApi } from "@/services/iconsService"
import { RootState } from "../RootReducer"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./UiSlice"

interface IconsState {
  iconsFetchingStatus: Status
  icons: TokenDetails[]
  currentSearch?: string
  cachedIcons: { [searchQuery: string]: TokenDetails[] }
}

const initialState: IconsState = {
  iconsFetchingStatus: "idle",
  icons: [],
  cachedIcons: {},
}

export const IconsSlice = createAppSlice({
  name: "icons",
  initialState,
  reducers: create => ({
    searchIcons: create.asyncThunk(
      async (payload: { query?: string }, thunkApi): Promise<{ query?: string; tokens: TokenDetails[] }> => {
        const state = thunkApi.getState() as RootState
        const cached = state.walletsReducer.icons.cachedIcons["query"]
        if (cached) {
          return { query: payload.query, tokens: cached }
        }
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
          state.icons = action.payload.tokens
        },
        rejected: (state, error) => {
          if (error?.error.message !== "aborted") {
            state.iconsFetchingStatus = "failed"
          }

          if (error?.error.message === "aborted" && error.meta.arg.query === state.currentSearch) {
            state.iconsFetchingStatus = "idle"
          }
        },
      },
    ),
  }),
})

export const { searchIcons } = IconsSlice.actions
