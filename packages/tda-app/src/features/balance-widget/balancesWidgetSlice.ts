import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice, Status } from "components";
import { CustomerBalanceModel } from "./BalanceModel";
import { balancesWidgetService } from "./balanceWidgetService";

export interface CurrenciesState {
  fiatCurrencies: CustomerBalanceModel[];
  cryptoCurrencies: CustomerBalanceModel[];
  statusFetchingBalances: Status;
}

const initialState: CurrenciesState = {
  fiatCurrencies: [],
  cryptoCurrencies: [],
  statusFetchingBalances: "idle"
};

export const fetchCustomerBalance = createAsyncThunk("fetchCustomerBalance", async () => {
  return await balancesWidgetService.getAll();
});

export const balancesWidgetSlice = createAppSlice({
  name: "balancesWidget",
  initialState,
  reducers: () => ({}),
  extraReducers: builder => {
    builder
    .addCase(fetchCustomerBalance.pending, state => {
      state.statusFetchingBalances = "loading";
    })
    .addCase(fetchCustomerBalance.fulfilled, (state, action: PayloadAction<CustomerBalanceModel[]>) => {
      state.statusFetchingBalances = "idle";
      state.fiatCurrencies = action.payload.filter(x => x.isFiat && x.amount !== 0);
      state.cryptoCurrencies = action.payload.filter(x => !x.isFiat && x.amount !== 0);
    })
    .addCase(fetchCustomerBalance.rejected, state => {
      state.statusFetchingBalances = "failed";
    })
  },
});
