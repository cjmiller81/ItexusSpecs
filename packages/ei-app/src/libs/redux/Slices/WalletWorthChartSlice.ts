import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { walletsApi } from "@/services/walletsService"
import { getChartDataScale, toTotalTokensBalances } from "@/utils/tokensTableHelpers"
import { RootState } from "../RootReducer"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./UiSlice"

interface WalletsState {
  chartData?: ChartSeriesDataResponse
  statstatusFetchingHistoricalData: Status
}

export interface ChartSeriesDataResponse {
  seriesData: HistoricalWalletData[]
  comareToLabel?: string | null
  minY: number
  maxY: number
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
      async (
        payload: {
          startDate: Date
          compareSymbol?: string | null
          compareLabel?: string | null
        },
        thunkApi,
      ): Promise<ChartSeriesDataResponse> => {
        const state = thunkApi.getState() as RootState
        const response = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.walletsReducer.wallets.selectedWallets),
          payload.startDate,
          new Date(),
          payload.compareSymbol,
        )
        const { min, max } = getChartDataScale(response)
        return { seriesData: response, comareToLabel: payload.compareLabel, minY: min, maxY: max }
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
