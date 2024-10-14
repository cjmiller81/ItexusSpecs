import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBankAccount } from "mocks/initBankAccounts";
import { bankAccountsService } from "./bankAccountService";

interface BankAccountsState {
  accounts: IBankAccount[];
  status: "idle" | "loading" | "failed";
}

const initialState: BankAccountsState = {
  accounts: [],
  status: "idle",
};

export const fetchBankAccounts = createAsyncThunk("bankAccounts/fetchBankAccounts", async () => {
  const accounts = await bankAccountsService.getAll();
  return accounts;
});

export const deleteBankAccount = createAsyncThunk("bankAccounts/deleteBankAccount", async (id: string) => {
  await bankAccountsService.delete(id);
  return id;
});

export const addBankAccount = createAsyncThunk("bankAccounts/addBankAccount", async (newAccount: IBankAccount) => {
  const addedAccount = await bankAccountsService.add(newAccount);
  return addedAccount;
});

const bankAccountSlice = createSlice({
  name: "bankAccounts",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBankAccounts.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchBankAccounts.fulfilled, (state, action: PayloadAction<IBankAccount[]>) => {
        state.status = "idle";
        state.accounts = action.payload;
      })
      .addCase(fetchBankAccounts.rejected, (state, action) => {
        console.error("Failed to fetch accounts:", action.error);
        state.status = "failed";
      })
      .addCase(deleteBankAccount.fulfilled, (state, action: PayloadAction<string>) => {
        state.accounts = state.accounts.filter(account => account.id !== action.payload);
      })
      .addCase(addBankAccount.fulfilled, (state, action: PayloadAction<IBankAccount>) => {
        state.accounts.push(action.payload);
      });
  },
});

export default bankAccountSlice.reducer;
