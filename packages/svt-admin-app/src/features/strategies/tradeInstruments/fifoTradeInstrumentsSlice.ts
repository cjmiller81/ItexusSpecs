import { PayloadAction } from "@reduxjs/toolkit"
import { Status, createAppSlice } from "components"
import { IFifoTradeInstruments } from "./iFifoTradeInstruments"
import { fifoTradeInstrumentsService } from "./fifoTradeInstrumentsService"

export interface FifoTradeInstrumentsSlice {
  fifoTradeInstruments: IFifoTradeInstruments[]
  statusFetchingFifoTradeInstruments: Status
  statusCreatingFifoTradeInstruments: Status
  statusUpdatingFifoTradeInstruments: Status
  statusDeletingFifoTradeInstruments: Status
}

const initialState: FifoTradeInstrumentsSlice = {
  fifoTradeInstruments: [],
  statusFetchingFifoTradeInstruments: "idle",
  statusCreatingFifoTradeInstruments: "idle",
  statusUpdatingFifoTradeInstruments: "idle",
  statusDeletingFifoTradeInstruments: "idle",
}

export const fifoTradeInstrumentsSlice = createAppSlice({
  name: "fifoTradeInstruments",
  initialState,
  reducers: create => ({
    createFifoTradeInstruments: create.asyncThunk(
      async (fifoTradeInstruments: IFifoTradeInstruments, thunkApi) => {
        await fifoTradeInstrumentsService.create(fifoTradeInstruments)
        thunkApi.dispatch(fetchFifoTradeInstruments(null))
      },
      {
        pending: state => {
          state.statusCreatingFifoTradeInstruments = "loading"
        },
        fulfilled: state => {
          state.statusCreatingFifoTradeInstruments = "idle"
        },
        rejected: state => {
          state.statusCreatingFifoTradeInstruments = "failed"
        },
      },
    ),
    updateFifoTradeInstruments: create.asyncThunk(
      async (fifoTradeInstruments: IFifoTradeInstruments, thunkApi) => {
        await fifoTradeInstrumentsService.update(fifoTradeInstruments)
        thunkApi.dispatch(fetchFifoTradeInstruments(null))
      },
      {
        pending: state => {
          state.statusUpdatingFifoTradeInstruments = "loading"
        },
        fulfilled: state => {
          state.statusUpdatingFifoTradeInstruments = "idle"
        },
        rejected: state => {
          state.statusUpdatingFifoTradeInstruments = "failed"
        },
      },
    ),
    deleteFifoTradeInstruments: create.asyncThunk(
      async ({ id }: { id: string }, thunkApi) => {
        await fifoTradeInstrumentsService.delete(id)
        thunkApi.dispatch(fetchFifoTradeInstruments(null))
      },
      {
        pending: state => {
          state.statusDeletingFifoTradeInstruments = "loading"
        },
        fulfilled: state => {
          state.statusDeletingFifoTradeInstruments = "idle"
        },
        rejected: state => {
          state.statusDeletingFifoTradeInstruments = "failed"
        },
      },
    ),
    fetchFifoTradeInstruments: create.asyncThunk(
      async () => {
        return await fifoTradeInstrumentsService.getAll()
      },
      {
        pending: state => {
          state.statusFetchingFifoTradeInstruments = "loading"
        },
        fulfilled: (state, action: PayloadAction<IFifoTradeInstruments[]>) => {
          state.statusFetchingFifoTradeInstruments = "idle"
          state.fifoTradeInstruments = action.payload
        },
        rejected: state => {
          state.statusFetchingFifoTradeInstruments = "failed"
        },
      },
    ),
  }),
})

export const { createFifoTradeInstruments, deleteFifoTradeInstruments, fetchFifoTradeInstruments, updateFifoTradeInstruments } = fifoTradeInstrumentsSlice.actions
