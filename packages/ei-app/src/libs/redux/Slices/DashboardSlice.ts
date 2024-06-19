import { Status, createAppSlice, toTotalTokensBalances, walletsApi } from "components"
import moment from "moment"
import { RootState } from "../RootReducer"
import { CompareToValues, getHestoricalWalletWorthChartData } from "./Shared"

export interface WalletsState {
  totalWalletWorthChartData: CompareToValues | null
  statusTotalWalletWorthChartData: Status
}

const initialState: WalletsState = {
  totalWalletWorthChartData: null,
  statusTotalWalletWorthChartData: "idle",
}

export const dashboardSlice = createAppSlice({
  name: "dashboard",
  initialState,
  reducers: create => ({
    fetchHistoricalWalletData: create.asyncThunk<CompareToValues, void>(
      async (_, thunkApi): Promise<CompareToValues> => {
        const state = thunkApi.getState() as RootState

        const response = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.wallets.wallets),
          moment().utc().add(-1, "M").toDate(),
          moment().utc().toDate(),
          null,
        )

        const chartData = getHestoricalWalletWorthChartData(response, "daily")
        return chartData
      },
      {
        pending: state => {
          state.statusTotalWalletWorthChartData = "loading"
        },
        fulfilled: (state, action) => {
          state.statusTotalWalletWorthChartData = "idle"
          state.totalWalletWorthChartData = action.payload
        },
        rejected: state => {
          state.statusTotalWalletWorthChartData = "failed"
        },
      },
    ),
  }),
})

export const { fetchHistoricalWalletData } = dashboardSlice.actions
