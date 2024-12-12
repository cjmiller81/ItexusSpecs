import { PayloadAction } from "@reduxjs/toolkit";
import { Status, createAppSlice } from "components";
import { stockService } from "@/services/stockService";
import { Market } from "@/models/Market";

type FetchStockParams = {
    startDate: Date;
    endDate: Date;
    ticker: string;
};

type StockDetails = {
    stock: Market[];
};

export interface StockSliceState {
    stock: Market[];
    stockDetails?: StockDetails;
    statusFetchingStock: Status;
}

const initialState: StockSliceState = {
    stock: [],
    statusFetchingStock: "idle",
};

export const stockSlice = createAppSlice({
    name: "stock",
    initialState,
    reducers: create => ({
        fetchStock: create.asyncThunk(
            async (params: FetchStockParams) => {
                const { startDate, endDate, ticker } = params;
                return await stockService.get({ startDate, endDate, ticker });
            },
            {
                pending: (state) => {
                    state.statusFetchingStock = "loading";
                },
                fulfilled: (state, action: PayloadAction<Market[]>) => {
                    state.statusFetchingStock = "idle";
                    state.stock = action.payload;
                },
                rejected: (state) => {
                    state.statusFetchingStock = "failed";
                },
            }
        ),
    }),
});

export const { fetchStock, } = stockSlice.actions
