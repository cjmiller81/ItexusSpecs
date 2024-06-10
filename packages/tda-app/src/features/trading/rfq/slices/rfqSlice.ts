import { rfqApi } from "@/api/rfq-api/rfqApi"
import { Status, createAppSlice } from "components"
import { HistoryDataParsed } from "../../../../api/rfq-api/models/HistoryDataParsed"
import { GetHistoryDataRequest } from "@/api/rfq-api/models/GetHistoryDataRequest"
import { RfqRequest } from "@/api/rfq-api/models/RfqRequest"
import { RfqResponse } from "@/api/rfq-api/models/RfqResponse"

export interface RfqState {
  rfqModel: RfqResponse | null
  statusFetchingRfq: Status
  statusFetchingHistoryData: Status
  historyData: HistoryDataParsed[]
}

const initialState: RfqState = {
  statusFetchingRfq: "idle",
  statusFetchingHistoryData: "idle",
  rfqModel: null,
  historyData: [],
}

export const rfqSlice = createAppSlice({
  name: "rfq",
  initialState,
  reducers: create => ({
    clearRfq: create.reducer(state => {
      state.rfqModel = null
    }),
    fetchHistoryData: create.asyncThunk(
      async (action: GetHistoryDataRequest) => {
        const response = await rfqApi.getHistoryData(action)
        return response
      },
      {
        pending: state => {
          state.statusFetchingHistoryData = "loading"
        },
        fulfilled: (state, action) => {
          state.statusFetchingHistoryData = "idle"
          state.historyData = action.payload
        },
        rejected: state => {
          state.statusFetchingHistoryData = "failed"
        },
      },
    ),
    fetchRfq: create.asyncThunk(
      async (request: RfqRequest) => {
        const response = await rfqApi.getRfq(request)
        return response[0]
      },
      {
        pending: state => {
          state.statusFetchingRfq = "loading"
        },
        fulfilled: (state, action) => {
          state.statusFetchingRfq = "idle"
          if (action.payload.BidPx && action.payload.OfferPx) state.rfqModel = action.payload
        },
        rejected: state => {
          state.statusFetchingRfq = "failed"
        },
      },
    ),
  }),
})

export const { fetchRfq, clearRfq, fetchHistoryData } = rfqSlice.actions
