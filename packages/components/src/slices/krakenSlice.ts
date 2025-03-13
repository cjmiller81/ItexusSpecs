import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { appAxios } from '../lib/axios/customAxios';
import { RootState } from './store';

export interface MarketData {
    base: string;
    price: string;
    displayName: string;
    alternateName: string;
    pairName: string;
    quote: string;
}

export interface KrakenState {
    isConnected: boolean;
    loading: boolean;
    error: string | null;
    balance: Record<string, number> | null;
    tradablePairs: MarketData[] | [];
}

const initialState: KrakenState = {
    isConnected: false,
    loading: false,
    error: null,
    balance: null,
    tradablePairs: []
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

        fetchTradablePairsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTradablePairsSuccess(state, action: PayloadAction<MarketData[]>) {            
            state.loading = false;
            state.tradablePairs = action.payload;
        },
        fetchTradablePairsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { connectRequest, connectSuccess, connectFailure, fetchBalanceRequest, fetchBalanceSuccess, fetchBalanceFailure, fetchTradablePairsRequest, fetchTradablePairsSuccess, fetchTradablePairsFailure } = krakenSlice.actions;

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

export const getTradablePairs = (symbol: string): AppThunk => async (dispatch) => {
    dispatch(fetchTradablePairsRequest());
    try {
        const response = await appAxios.get(`/api/kraken/pairsQuote?marketSymbol=${symbol}`, {
            withCredentials: true,
        });
        dispatch(fetchTradablePairsSuccess(response.data.pairs));
    } catch (error) {
        console.error("Failed to fetch Kraken tradable pairs:", error);
        dispatch(fetchTradablePairsFailure("Fetching Kraken tradable pairs failed"));
    }
};

export default krakenSlice.reducer;
