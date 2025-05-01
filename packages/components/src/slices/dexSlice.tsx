import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { QuoteParametersResponse } from "../models/QuoteParametersResponse";
import { dexService } from "../services/dexService";
import { OneInchQuoteResponse } from "../models/oneInchQuoteResponse";
import { TokenResponse } from "../models/token/TokenResponse";

interface QuoteRequest {
  tokenPositionSymbol: string;
  chainName: string;
  qty: number;
  swapForSymbol: string;
  tokenPositionId: string;
  swapForId: string;
}

interface OneInchQuoteRequest {
  chainName: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: number;
}

export interface DexState {
  data: QuoteParametersResponse | null;
  quote: OneInchQuoteResponse | null;
  quoteLoading: boolean;
  error: string | null;
  quoteError: string | null;
}

const initialState: DexState = {
  data: null,
  quote: null,
  quoteLoading: false,
  error: null,
  quoteError: null,
};

export const fetchQuoteParameters = createAsyncThunk<
  QuoteParametersResponse,
  QuoteRequest,
  { rejectValue: string }
>(
  "quote/fetchQuoteParameters",
  async (params, { rejectWithValue }) => {
    try {
      const data = await dexService.get(params);

      return data;
    } catch (error: any) {
      const message =
        typeof error?.response?.data === 'string'
          ? error.response.data
          : error?.response?.data?.message || error?.message;

      return rejectWithValue(message);
    }
  }
);

export const fetchQuote = createAsyncThunk<
  OneInchQuoteResponse,
  OneInchQuoteRequest,
  { rejectValue: string }
>(
  "quote/fetchQuote",
  async (params, { rejectWithValue }) => {
    try {
      const data = await dexService.getQuote(params);
      return data;
    } catch (error: any) {
      const message = 
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message || error?.message;
      
      return rejectWithValue(message);
    }
  }
);

export const fetchToken = createAsyncThunk<
  TokenResponse,
  { id: string },
  { rejectValue: string }
>(
  "token/fetchToken",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await dexService.getToken({ id });
      return data;
    } catch (error: any) {
      const message =
        typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.message || error?.message;

      return rejectWithValue(message);
    }
  }
);

export const dexSlice = createSlice({
  name: "dex",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuoteParameters.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchQuoteParameters.fulfilled, (state, action) => {
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchQuoteParameters.rejected, (state, action) => {
        state.error = action.payload || "Unknown error";
      })
      .addCase(fetchQuote.pending, (state) => {
        state.quoteLoading = true;
        state.quoteError = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action: PayloadAction<OneInchQuoteResponse>) => {
        state.quoteLoading = false;
        state.quote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.quoteLoading = false;
        state.quoteError = action.payload ?? "";
      })
      .addCase(fetchToken.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.error = action.payload ?? "";
      });
  },
});

export const dexReducer = dexSlice.reducer;
