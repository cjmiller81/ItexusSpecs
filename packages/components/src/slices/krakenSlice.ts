
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { appAxios } from '../lib/axios/customAxios';
import { RootState } from './store';
import { getKrakenErrorMessage } from '../services/krakenService';
import { toast } from 'react-toastify';

export interface MarketData {
    base: string;
    price: string;
    displayName: string;
    alternateName: string;
    pairName: string;
    quote: string;
}

export interface PlaceOrderResponse {

    orderId: string,
    clientOrderId: string,
    result: number,
    resultCode: number,
    message: string,
    amount: number,
    amountFilled: number,
    isAmountFilledReversed: boolean,
    price: number,
    averagePrice: number,
    orderDate: string,
    httpHeaderDate: string,
    completedDate: string,
    marketSymbol: string,
    isBuy: boolean,
    fees: number,
    feesCurrency: string,
    tradeId: string,
    tradeDate: string,
    updateSequence: string
}

export interface KrakenState {
    isConnected: boolean;
    loading: boolean;
    error: string | null;
    balance: Record<string, number> | null;
    tradablePairs: MarketData[] | [];
    placeOrderResponse: PlaceOrderResponse | null;
    placeOrderError: string | null
}

const initialState: KrakenState = {
    isConnected: false,
    loading: false,
    error: null,
    balance: null,
    tradablePairs: [],
    placeOrderResponse: null,
    placeOrderError: null
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
        resetBalance(state) {
            state.loading = false;
            state.balance = null;
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
            state.tradablePairs = [];
        },
        placeOrderRequest(state) {
            state.loading = true;
            state.error = null;
        },
        placeOrderSuccess(state, action: PayloadAction<PlaceOrderResponse>) {
            state.loading = false;
            state.placeOrderResponse = action.payload;
        },
        placeOrderFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.placeOrderError = action.payload;
            state.placeOrderResponse = null;
        },
        resetOrderResponseError(state) {
            state.loading = false;
            state.placeOrderError = null;
        },
    },
});

export const { connectRequest, connectSuccess, connectFailure, fetchBalanceRequest, fetchBalanceSuccess, fetchBalanceFailure, fetchTradablePairsRequest, fetchTradablePairsSuccess, fetchTradablePairsFailure, resetBalance, placeOrderRequest, placeOrderSuccess, placeOrderFailure, resetOrderResponseError } = krakenSlice.actions;

export const getAccountBalance = (): AppThunk => async (dispatch) => {
    dispatch(fetchBalanceRequest());
    try {
        const response = await appAxios.get("/api/kraken/account-balance", {
            withCredentials: true,
        });
        dispatch(fetchBalanceSuccess(response.data));
    } catch (error) {
        console.error("Failed to fetch Kraken account balance:", error);
        toast.error(getKrakenErrorMessage(error));
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

export const resetAccountBalance = () => async (dispatch) => {
    dispatch(resetBalance());
}

export const resetPlaceOrderResponseError = () => async (dispatch) => {
    dispatch(resetOrderResponseError());
}

export const postPlaceOrder = (orderRequest: any): AppThunk => async (dispatch) => {
    dispatch(placeOrderRequest());
    try {
        const response = await appAxios.post("/api/kraken/orders", 
        {
            withCredentials: true,
            ...orderRequest
        });
        dispatch(placeOrderSuccess(response.data));
    } catch (error: any) { 
        console.error("Failed to place kraken order", error);
        const message = getKrakenErrorMessage(error);
    
        dispatch(placeOrderFailure(message));
    }
};

export default krakenSlice.reducer;