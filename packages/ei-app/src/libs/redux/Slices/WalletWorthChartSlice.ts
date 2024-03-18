import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { walletsApi } from "@/services/walletsService"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./UiSlice"

interface WalletsState {
  chartData?: ChartSeriesDataResponse
  statstatusFetchingHistoricalData: Status
}

export interface ChartSeriesDataResponse {
  seriesData: HistoricalWalletData[]
  comareToLabel: string
}

const initialState: WalletsState = {
  chartData: undefined,
  statstatusFetchingHistoricalData: "idle",
}
export const walletWorthChartSlice = createAppSlice({
  name: "walletWorthChart",
  initialState,
  reducers: create => ({
    clearErrors: create.reducer(state => {
      state.statstatusFetchingHistoricalData = "idle"
    }),
    fetchHistoricalWalletData: create.asyncThunk(
      async (payload: {
        symbols: { symbol: string; qty: number }[]
        startDate: Date
        endDate: Date
        compareSymbol: string
        compareLabel: string
      }): Promise<ChartSeriesDataResponse> => {
        const response = await walletsApi.getHistoricalWalletData(
          payload.symbols,
          payload.startDate,
          payload.endDate,
          payload.compareSymbol,
        )

        return { seriesData: response, comareToLabel: payload.compareLabel }
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

export const { fetchHistoricalWalletData } = walletWorthChartSlice.actions
