import { createAppSlice } from "components";
import { BalanceModel } from "./BalanceModel";
import { cryptoBalances, fiatBalances } from "./mocks/cryptoBalances";

export interface CurrenciesState {
  fiatCurrencies: BalanceModel[];
  cryptoCurrencies: BalanceModel[];
}

const initialState: CurrenciesState = {
  fiatCurrencies: fiatBalances,
  cryptoCurrencies: cryptoBalances,
};

export const balancesWidgetSlice = createAppSlice({
  name: "balancesWidget",
  initialState,
  reducers: () => ({}),
});
