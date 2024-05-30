import { PayloadAction } from "@reduxjs/toolkit"
import { Status, createAppSlice } from "components"
import { FifoSignal } from "./fifoSignal"
import { fifoSignalsService } from "./fifoSignalsService"

export interface FifiSignalSlice {
  fifoSignals: FifoSignal[]
  statusFetchingFifoSignals: Status
  statusCreatingFifoSignal: Status
  statusUpdatingFifoSignal: Status
  statusDeletingFifoSignal: Status
}

const initialState: FifiSignalSlice = {
  fifoSignals: [],
  statusFetchingFifoSignals: "idle",
  statusCreatingFifoSignal: "idle",
  statusUpdatingFifoSignal: "idle",
  statusDeletingFifoSignal: "idle",
}

export const fifoSignalSlice = createAppSlice({
  name: "fifoSignals",
  initialState,
  reducers: create => ({
    createFifoSignal: create.asyncThunk(
      async (fifoSignal: FifoSignal, thunkApi) => {
        await fifoSignalsService.create(fifoSignal)
        thunkApi.dispatch(fetchFifoSignals(null))
      },
      {
        pending: state => {
          state.statusCreatingFifoSignal = "loading"
        },
        fulfilled: state => {
          state.statusCreatingFifoSignal = "idle"
        },
        rejected: state => {
          state.statusCreatingFifoSignal = "failed"
        },
      },
    ),
    updateFifoSignal: create.asyncThunk(
      async (fifoSignal: FifoSignal, thunkApi) => {
        await fifoSignalsService.update(fifoSignal)
        thunkApi.dispatch(fetchFifoSignals(null))
      },
      {
        pending: state => {
          state.statusUpdatingFifoSignal = "loading"
        },
        fulfilled: state => {
          state.statusUpdatingFifoSignal = "idle"
        },
        rejected: state => {
          state.statusUpdatingFifoSignal = "failed"
        },
      },
    ),
    deleteFifoSignal: create.asyncThunk(
      async ({ id }: { id: string }, thunkApi) => {
        await fifoSignalsService.delete(id)
        thunkApi.dispatch(fetchFifoSignals(null))
      },
      {
        pending: state => {
          state.statusDeletingFifoSignal = "loading"
        },
        fulfilled: state => {
          state.statusDeletingFifoSignal = "idle"
        },
        rejected: state => {
          state.statusDeletingFifoSignal = "failed"
        },
      },
    ),
    fetchFifoSignals: create.asyncThunk(
      async () => {
        return await fifoSignalsService.getAll()
      },
      {
        pending: state => {
          state.statusFetchingFifoSignals = "loading"
        },
        fulfilled: (state, action: PayloadAction<FifoSignal[]>) => {
          state.statusFetchingFifoSignals = "idle"
          state.fifoSignals = action.payload
        },
        rejected: state => {
          state.statusFetchingFifoSignals = "failed"
        },
      },
    ),
  }),
})

export const { createFifoSignal, deleteFifoSignal, fetchFifoSignals, updateFifoSignal } = fifoSignalSlice.actions
