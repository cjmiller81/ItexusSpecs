import { Status, createAppSlice, toTotalTokensBalances, walletsApi } from "components";
import moment from "moment";
import { RootState } from "../RootReducer";
import { CompareToValues, getHistoricalWalletWorthChartData } from "./Shared";

export interface WalletsState {
  totalWalletWorthChartData: CompareToValues | null;
  totalWalletWorthValueChartData: CompareToValues | null;
  statusTotalWalletWorthChartData: Status;
}

const initialState: WalletsState = {
  totalWalletWorthChartData: null,
  totalWalletWorthValueChartData: null,
  statusTotalWalletWorthChartData: "idle",
};

export const dashboardSlice = createAppSlice({
  name: "dashboard",
  initialState,
  reducers: create => ({
    fetchHistoricalWalletData: create.asyncThunk<
      { growth: CompareToValues; value: CompareToValues },
      void
    >(
      async (_, thunkApi) => {
        const state = thunkApi.getState() as RootState;

        const response = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.wallets.wallets),
          moment().utc().add(-1, "M").toDate(),
          moment().utc().toDate(),
          null,
        );

        const growthData = getHistoricalWalletWorthChartData(response, "daily");

        const valueData: CompareToValues = response.map((item: any) => ({
          x: new Date(item.historyDate),
          y: item.walletValue,
        }));

        return {
          growth: growthData,
          value: valueData,
        };
      },
      {
        pending: state => {
          state.statusTotalWalletWorthChartData = "loading";
        },
        fulfilled: (state, action) => {
          state.statusTotalWalletWorthChartData = "idle";
          state.totalWalletWorthChartData = action.payload.growth;
          state.totalWalletWorthValueChartData = action.payload.value;
        },
        rejected: state => {
          state.statusTotalWalletWorthChartData = "failed";
        },
      }
    ),
  }),
});

export const { fetchHistoricalWalletData } = dashboardSlice.actions;
