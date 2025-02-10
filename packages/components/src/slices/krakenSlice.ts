import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const { connectRequest, connectSuccess, connectFailure } = krakenSlice.actions;

