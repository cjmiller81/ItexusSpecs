import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { walletsApi } from "@/services/walletsService"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./UiSlice"

interface WalletsState {
  chartData: HistoricalWalletData[]
  statstatusFetchingHistoricalData: Status
}

const initialState: WalletsState = {
  chartData: [],
  statstatusFetchingHistoricalData: "idle",
}
export const walletWorthChartSlice = createAppSlice({
  name: "walletWorthChart",
  initialState,
  reducers: create => ({
    clearErrors: create.reducer(state => {
      state.statstatusFetchingHistoricalData = "idle"
    }),
    fetchHistoricalWolletData: create.asyncThunk(
      async (payload: {
        symbols: { symbol: string; qty: number }[]
        startDate: Date
        endDate: Date
        compareSymbol: string
      }) => {
        const response = await walletsApi.getHistoricalWalletData(
          payload.symbols,
          payload.startDate,
          payload.endDate,
          payload.compareSymbol,
        )
        return response
      },
      {
        pending: state => {
          state.statstatusFetchingHistoricalData = "loading"
        },
        fulfilled: (state, action) => {
          state.statstatusFetchingHistoricalData = "idle"
          state.chartData = action.payload
        },
        rejected: state => {
          state.statstatusFetchingHistoricalData = "failed"
        },
      },
    ),
  }),
})

export const { fetchHistoricalWolletData } = walletWorthChartSlice.actions
