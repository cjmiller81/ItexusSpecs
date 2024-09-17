import { GetHistoryDataRequest } from "@/api/rfq-api/models/GetHistoryDataRequest";
import { RfqRequest } from "@/api/rfq-api/models/RfqRequest";
import { RfqResponse } from "@/api/rfq-api/models/RfqResponse";
import { rfqApi } from "@/api/rfq-api/rfqApi";
import { Status } from "components";
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface RfqState {
  rfqModel: RfqResponse | null;
  statusFetchingRfq: Status;
  statusFetchingHistoryData: Status;
  statusFetchingExecutionHistoryData: Status;
  historyData: HistoryDataParsed[];
  executionHistoryData: HistoryDataParsed[];
  isTradingEnabled: boolean;
}

const initialState: RfqState = {
  statusFetchingRfq: "idle",
  statusFetchingHistoryData: "idle",
  statusFetchingExecutionHistoryData: "idle",
  rfqModel: null,
  historyData: [],
  executionHistoryData: [],
  isTradingEnabled: false,
};

export const fetchHistoryData = createAsyncThunk("rfq/fetchHistoryData", async (action: GetHistoryDataRequest) => {
  const response = await rfqApi.getHistoryData(action);
  return response;
});

export const fetchExecutionHistoryData = createAsyncThunk(
  "rfq/fetchExecutionHistoryData",
  async (action: GetHistoryDataRequest) => {
    const response = await rfqApi.getExecutionHistoryData(action);
    return response;
  },
);

export const fetchRfq = createAsyncThunk("rfq/fetchRfq", async (request: RfqRequest) => {
  const response = await rfqApi.getRfq(request);
  return response[0];
});

export const rfqSlice = createSlice({
  name: "rfq",
  initialState,
  reducers: {
    clearRfq: state => {
      state.rfqModel = null;
    },
    setTradingEnabled: (state, action: PayloadAction<boolean>) => {
      state.isTradingEnabled = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHistoryData.pending, state => {
        state.statusFetchingHistoryData = "loading";
      })
      .addCase(fetchHistoryData.fulfilled, (state, action) => {
        state.statusFetchingHistoryData = "idle";
        state.historyData = action.payload;
      })
      .addCase(fetchHistoryData.rejected, state => {
        state.statusFetchingHistoryData = "failed";
      })
      .addCase(fetchExecutionHistoryData.pending, state => {
        state.statusFetchingExecutionHistoryData = "loading";
      })
      .addCase(fetchExecutionHistoryData.fulfilled, (state, action) => {
        state.statusFetchingExecutionHistoryData = "idle";
        state.executionHistoryData = action.payload;
      })
      .addCase(fetchExecutionHistoryData.rejected, state => {
        state.statusFetchingExecutionHistoryData = "failed";
      })
      .addCase(fetchRfq.pending, state => {
        state.statusFetchingRfq = "loading";
      })
      .addCase(fetchRfq.fulfilled, (state, action) => {
        state.statusFetchingRfq = "idle";
        state.rfqModel = action.payload;
      })
      .addCase(fetchRfq.rejected, state => {
        state.statusFetchingRfq = "failed";
      });
  },
});

export const { clearRfq, setTradingEnabled } = rfqSlice.actions;
export default rfqSlice.reducer;
