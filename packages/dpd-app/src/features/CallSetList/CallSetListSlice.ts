import { PayloadAction } from "@reduxjs/toolkit";
import { Status, createAppSlice } from "components";
import { strategiesService } from "@/services/strategiesService";
import { DpdOptionsScan } from "@/models/DpdOptionScan";

export interface CallSetListState {
  strategies: DpdOptionsScan[];
  statusFetchingStrategies: Status;
  expandedRows: string[];
}

const initialState: CallSetListState = {
  strategies: [],
  statusFetchingStrategies: "idle",
  expandedRows: [],
};

export const callSetListSlice = createAppSlice({
  name: "call-set-list",
  initialState,
  reducers: (create) => ({
    fetchStrategies: create.asyncThunk(
      async () => {
        const strategiesList = await strategiesService.getSchwab();
        return strategiesList.strategies;
      },
      {
        pending: (state) => {
          state.statusFetchingStrategies = "loading";
        },
        fulfilled: (state, action) => {
          state.strategies = action.payload;
          state.statusFetchingStrategies = "idle";
        },
        rejected: (state) => {
          state.statusFetchingStrategies = "failed";
        },
      }
    ),
    toggleRowExpansion: create.reducer((state, action: PayloadAction<string>) => {
      const strategyId = action.payload;
      const index = state.expandedRows.indexOf(strategyId);
      if (index > -1) {
        state.expandedRows.splice(index, 1);
      } else {
        state.expandedRows.push(strategyId);
      }
    }),
  }),
});

export const { fetchStrategies, toggleRowExpansion } = callSetListSlice.actions;
