import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { appAxios } from '../lib/axios/customAxios';
import { RootState } from './store';

export interface KrakenState {
    isConnected: boolean;
    loading: boolean;
    error: string | null;
    balance: Record<string, number> | null;
}

const initialState: KrakenState = {
    isConnected: false,
    loading: false,
    error: null,
    balance: null,
};
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string> 
>;

export const krakenSlice = createSlice({
    name: 'kraken',
    initialState,
    reducers: {
        connectRequest(state) {
            state.loading = true;
            state.error = null;
        },
        connectSuccess(state) {
            state.loading = false;
            state.isConnected = true;
        },
        connectFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        fetchBalanceRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchBalanceSuccess(state, action: PayloadAction<Record<string, number>>) {
            state.loading = false;
            state.balance = action.payload;
        },
        fetchBalanceFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { connectRequest, connectSuccess, connectFailure, fetchBalanceRequest, fetchBalanceSuccess, fetchBalanceFailure } = krakenSlice.actions;

export const getAccountBalance = (): AppThunk => async (dispatch) => {
    dispatch(fetchBalanceRequest());
    try {
        const response = await appAxios.get("/api/kraken/account-balance", {
            withCredentials: true,
        });
        dispatch(fetchBalanceSuccess(response.data));
    } catch (error) {
        console.error("Failed to fetch Kraken account balance:", error);
        dispatch(fetchBalanceFailure("Fetching Kraken account balance failed"));
    }
};

export default krakenSlice.reducer;
