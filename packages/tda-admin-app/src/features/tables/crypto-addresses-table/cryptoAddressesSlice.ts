import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICryptoAddresses } from "mocks/initCryptoAddresses";
import { cryptoAddressesService } from "./cryptoAddressesService";

interface CryptoAddressState {
  accounts: ICryptoAddresses[];
  status: "idle" | "loading" | "failed";
}

const initialState: CryptoAddressState = {
  accounts: [],
  status: "idle",
};

export const fetchCryptoAddress = createAsyncThunk("cryptoAddress/fetchCryptoAddress", async () => {
  return await cryptoAddressesService.getAll();
});

export const deleteCryptoAddress = createAsyncThunk("cryptoAddress/deleteCryptoAddress", async (id: string) => {
  await cryptoAddressesService.delete(id);
  return id;
});

export const addCryptoAddress = createAsyncThunk(
  "cryptoAddress/addCryptoAddress",
  async (newAccount: ICryptoAddresses) => {
    return await cryptoAddressesService.add(newAccount);
  },
);

const cryptoAddressSlice = createSlice({
  name: "cryptoAddress",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCryptoAddress.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchCryptoAddress.fulfilled, (state, action: PayloadAction<ICryptoAddresses[]>) => {
        state.status = "idle";
        state.accounts = action.payload;
      })
      .addCase(fetchCryptoAddress.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(deleteCryptoAddress.fulfilled, (state, action: PayloadAction<string>) => {
        state.accounts = state.accounts.filter(account => account.id !== action.payload);
      })
      .addCase(addCryptoAddress.fulfilled, (state, action: PayloadAction<ICryptoAddresses>) => {
        state.accounts.push(action.payload);
      });
  },
});

export default cryptoAddressSlice.reducer;
