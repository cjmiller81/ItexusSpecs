import { iconsApi } from "@/services/iconsService";
import { createAppSlice, Status } from "components";
import { IPrefilterTokensFilterValues } from "components/src/models/token/IPrefilterTokensFilterValues";
import { v4 as uuid } from "uuid";

export interface TotalWalletWorthData {
  totalWorth: number;
  growPercentage: number;
}

interface WalletsState {
  creatingFilterStatus: Status;
  updatingFilterStatus: Status;
  deletingFilterStatus: Status;
  fetchingFilterStatus: Status;
  filters: IPrefilterTokensFilterValues[];
}

const initialState: WalletsState = {
  filters: [],
  deletingFilterStatus: "idle",
  creatingFilterStatus: "idle",
  updatingFilterStatus: "idle",
  fetchingFilterStatus: "idle",
};

export type CreateFilterModel = Omit<IPrefilterTokensFilterValues, "id">;

export const allTokensTableSlice = createAppSlice({
  name: "allTokensTable",
  initialState,
  reducers: create => ({
    createFilter: create.asyncThunk(
      async (createFilterModel: CreateFilterModel, thunkApi) => {
        await iconsApi.createTokensFilter({ ...createFilterModel, id: uuid() });
        thunkApi.dispatch(fetchFilters({}));
      },
      {
        pending: state => {
          state.creatingFilterStatus = "loading";
        },
        fulfilled: state => {
          state.creatingFilterStatus = "idle";
        },
        rejected: state => {
          state.creatingFilterStatus = "failed";
        },
      },
    ),
    updateFilter: create.asyncThunk(
      async (filterModel: IPrefilterTokensFilterValues, thunkApi) => {
        await iconsApi.updateFilter(filterModel);
        thunkApi.dispatch(fetchFilters({}));
      },
      {
        pending: state => {
          state.updatingFilterStatus = "loading";
        },
        fulfilled: state => {
          state.updatingFilterStatus = "idle";
        },
        rejected: state => {
          state.updatingFilterStatus = "failed";
        },
      },
    ),
    deleteFilter: create.asyncThunk(
      async (action: { id: string }, thunkApi) => {
        await iconsApi.deleteTokensFilter(action.id);
        thunkApi.dispatch(fetchFilters({}));
      },
      {
        pending: state => {
          state.deletingFilterStatus = "loading";
        },
        fulfilled: state => {
          state.deletingFilterStatus = "idle";
        },
        rejected: state => {
          state.deletingFilterStatus = "failed";
        },
      },
    ),
    fetchFilters: create.asyncThunk(
      async () => {
        return await iconsApi.getAllFilters();
      },
      {
        pending: state => {
          state.fetchingFilterStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.filters = action.payload;
          state.fetchingFilterStatus = "idle";
        },
        rejected: state => {
          state.fetchingFilterStatus = "failed";
        },
      },
    ),
  }),
});

export const { updateFilter, fetchFilters, createFilter, deleteFilter } = allTokensTableSlice.actions;
