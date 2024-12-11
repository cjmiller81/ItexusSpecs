import { CurrencyPair } from "@/api/rfq-api/models/CurrencyPair"
import { rfqApi } from "@/api/rfq-api/rfqApi"
import { Status, createAppSlice } from "components"

export interface CurrenciesState {
  pairs: CurrencyPair[]
  statusFetchingPairs: Status
}

const initialState: CurrenciesState = {
  pairs: [],
  statusFetchingPairs: "idle",
}

export const currenciesSlice = createAppSlice({
  name: "currencies",
  initialState,
  reducers: create => ({
    fetchPairs: create.asyncThunk(
      async () => {
        const response = await rfqApi.getCurrenciesPairs()
        return response
      },
      {
        pending: state => {
          state.statusFetchingPairs = "loading"
        },
        fulfilled: (state, action) => {
          state.statusFetchingPairs = "idle"
          state.pairs = action.payload
        },
        rejected: state => {
          state.statusFetchingPairs = "failed"
        },
      },
    ),
  }),
})

export const { fetchPairs } = currenciesSlice.actions
