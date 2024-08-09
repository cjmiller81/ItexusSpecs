import { GetHistoryDataRequest } from "@/api/rfq-api/models/GetHistoryDataRequest";
import { RfqRequest } from "@/api/rfq-api/models/RfqRequest";
import { RfqResponse } from "@/api/rfq-api/models/RfqResponse";
import { rfqApi } from "@/api/rfq-api/rfqApi";
import { Status, createAppSlice } from "components";
import { HistoryDataParsed } from "../../../../api/rfq-api/models/HistoryDataParsed";

export interface RfqState {
  rfqModel: RfqResponse | null;
  statusFetchingRfq: Status;
  statusFetchingHistoryData: Status;
  statusFetchingExecutionHistoryData: Status;
  historyData: HistoryDataParsed[];
  executionHistoryData: HistoryDataParsed[];
}

const initialState: RfqState = {
  statusFetchingRfq: "idle",
  statusFetchingHistoryData: "idle",
  statusFetchingExecutionHistoryData: "idle",
  rfqModel: null,
  historyData: [],
  executionHistoryData: [],
};

export const rfqSlice = createAppSlice({
  name: "rfq",
  initialState,
  reducers: create => ({
    clearRfq: create.reducer(state => {
      state.rfqModel = null;
    }),
    fetchHistoryData: create.asyncThunk(
      async (action: GetHistoryDataRequest) => {
        const response = await rfqApi.getHistoryData(action);
        return response;
      },
      {
        pending: state => {
          state.statusFetchingHistoryData = "loading";
        },
        fulfilled: (state, action) => {
          state.statusFetchingHistoryData = "idle";
          state.historyData = action.payload;
        },
        rejected: state => {
          state.statusFetchingHistoryData = "failed";
        },
      },
    ),
    fetchExecutionHistoryData: create.asyncThunk(
      async (action: GetHistoryDataRequest) => {
        const response = await rfqApi.getExecutionHistoryData(action);
        return response;
      },
      {
        pending: state => {
          state.statusFetchingExecutionHistoryData = "loading";
        },
        fulfilled: (state, action) => {
          state.statusFetchingExecutionHistoryData = "idle";
          state.executionHistoryData = action.payload;
        },
        rejected: state => {
          state.statusFetchingExecutionHistoryData = "failed";
        },
      },
    ),
    fetchRfq: create.asyncThunk(
      async (request: RfqRequest) => {
        const response = await rfqApi.getRfq(request);
        return response[0];
      },
      {
        pending: state => {
          state.statusFetchingRfq = "loading";
        },
        fulfilled: (state, action) => {
          state.statusFetchingRfq = "idle";
          state.rfqModel = action.payload;
        },
        rejected: state => {
          state.statusFetchingRfq = "failed";
        },
      },
    ),
  }),
});

export const { fetchRfq, clearRfq, fetchHistoryData, fetchExecutionHistoryData } = rfqSlice.actions;
