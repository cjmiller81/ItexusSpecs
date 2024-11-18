import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdminUserDetails, IAdminUsersSliceState, IExchangeAccountList } from "./types";
import { userDetailsService } from "./userDetailsService";

const initialState: IAdminUsersSliceState = {
  statusFetchingExchangeAccounts: "idle",
  statusFetchingUserDetails: "idle"
};

export const fetchExchangeAccounts = createAsyncThunk(
    "adminUsers/fetchExchangeAccounts", 
    async ({ userId }: { userId: string }) => {
       return await userDetailsService.getExchangeAccountList(userId);
});

export const fetchUserDetails = createAsyncThunk(
  "adminUsers/fetchUserDetails",
  async ({ userId, accountNumber }: { userId: string, accountNumber: string }) => {
    const [positionList, managedOrderList] = await Promise.all([
      userDetailsService.getAccountPositionList(userId, accountNumber),
      userDetailsService.getManagedOrderList(userId, accountNumber)
    ]);
    return { positionList, managedOrderList };
  },
);

export const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExchangeAccounts.pending, state => {
        state.statusFetchingExchangeAccounts = "loading";
      })
      .addCase(fetchExchangeAccounts.fulfilled, (state, action: PayloadAction<IExchangeAccountList>) => {
        state.statusFetchingExchangeAccounts = "idle";
        state.exchangeAccounts = action.payload;
      })
      .addCase(fetchExchangeAccounts.rejected, state => {
        state.statusFetchingExchangeAccounts = "failed";
      })
      .addCase(fetchUserDetails.pending, state => {
        state.statusFetchingExchangeAccounts = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<IAdminUserDetails>) => {
        state.statusFetchingExchangeAccounts = "idle";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, state => {
        state.statusFetchingExchangeAccounts = "failed";
      })
    }
  },
);

export default adminUsersSlice.reducer;