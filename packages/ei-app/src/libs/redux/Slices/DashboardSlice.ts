import { Status, createAppSlice, toTotalTokensBalancesFromPortfolio, walletsApi } from "components";
import moment from "moment";
import { RootState } from "../RootReducer";
import { CompareToValues, getHistoricalWalletWorthChartData } from "./Shared";
import { 
  getCurrentTokensValueFromZapper, 
  updateChartDataWithCurrentDayValue 
} from "components";

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
      { addresses?: string[] } | undefined
    >(
      async (arg, thunkApi) => {
        const state = thunkApi.getState() as RootState;

        const portfolioData = arg?.addresses
          ? state.wallets.portfolioWalletData.filter(p => arg.addresses!.includes(p.walletAddress))
          : state.wallets.portfolioWalletData;

        const response = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalancesFromPortfolio(portfolioData),
          moment().utc().add(-1, "M").toDate(),
          moment().utc().toDate(),
          null,
        );

        const selectedWalletAddresses = arg?.addresses ?? state.wallets.wallets?.map(wallet => wallet.address) ?? []
        const currentTokensValue = getCurrentTokensValueFromZapper ? getCurrentTokensValueFromZapper(
          portfolioData,
          selectedWalletAddresses
        ) : 0
        
        const updatedResponse = updateChartDataWithCurrentDayValue ? updateChartDataWithCurrentDayValue(response, currentTokensValue) : response

        const growthData = getHistoricalWalletWorthChartData(updatedResponse, "daily");

        const valueData: CompareToValues = updatedResponse.map((item: any) => ({
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
