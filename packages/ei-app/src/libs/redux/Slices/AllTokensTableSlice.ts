import { ICategory, ICoin, IPlatform, IPrefilterTokensFilterValues } from "@/services/backend-api.service"
import { iconsApi } from "@/services/iconsService"
import { v4 as uuid } from "uuid"
import { createAppSlice } from "../createAppSlice"
import { setPrefilteredData as setPrefilteredWeightedData } from "./MarketCapEqualWeightModelingSlice"
import { setPrefilteredData as setPrefilteredEqualWeightedData } from "./MarketCapWeightedModelingSlice"

export type Status = "idle" | "loading" | "failed"
export interface TotalWalletWorthData {
  totalWorth: number
  growPercentage: number
}

interface WalletsState {
  allTokens: ICoin[]
  allChains: IPlatform[]
  allCategories: ICategory[]
  fetchingTokensStatus: Status
  creatingFilterStatus: Status
  updatingFilterStatus: Status
  deletingFilterStatus: Status
  fetchingFilterStatus: Status
  filters: IPrefilterTokensFilterValues[]
}

const initialState: WalletsState = {
  allTokens: [],
  allChains: [],
  allCategories: [],
  filters: [],
  deletingFilterStatus: "idle",
  fetchingTokensStatus: "idle",
  creatingFilterStatus: "idle",
  updatingFilterStatus: "idle",
  fetchingFilterStatus: "idle",
}

export type CreateFilterModel = Omit<IPrefilterTokensFilterValues, "id">

export const allTokensTableSlice = createAppSlice({
  name: "allTokensTable",
  initialState,
  reducers: create => ({
    fetchCoins: create.asyncThunk(
      async (
        _,
        thunkApi,
      ): Promise<{
        coins: ICoin[]
        chains: IPlatform[]
        categories: ICategory[]
      }> => {
        const [coins, chains, categories] = await Promise.all([
          iconsApi.getAll(),
          iconsApi.getAllChains(),
          iconsApi.getAllCategories(),
        ])

        thunkApi.dispatch(fetchFilters({}))
        thunkApi.dispatch(setPrefilteredEqualWeightedData([...coins]))
        thunkApi.dispatch(setPrefilteredWeightedData([...coins]))
        return { coins, chains, categories }
      },
      {
        pending: state => {
          state.fetchingTokensStatus = "loading"
        },
        fulfilled: (state, action) => {
          state.fetchingTokensStatus = "idle"
          state.allTokens = action.payload.coins
          state.allCategories = action.payload.categories
          state.allChains = action.payload.chains
        },
        rejected: (state) => {
          state.fetchingTokensStatus = "failed"
        },
      },
    ),
    createFilter: create.asyncThunk(
      async (createFilterModel: CreateFilterModel, thunkApi) => {
        await iconsApi.createTokensFilter({ ...createFilterModel, id: uuid() })
        thunkApi.dispatch(fetchFilters({}))
      },
      {
        pending: state => {
          state.creatingFilterStatus = "loading"
        },
        fulfilled: state => {
          state.creatingFilterStatus = "idle"
        },
        rejected: state => {
          state.creatingFilterStatus = "failed"
        },
      },
    ),
    updateFilter: create.asyncThunk(
      async (filterModel: IPrefilterTokensFilterValues, thunkApi) => {
        await iconsApi.updateFilter(filterModel)
        thunkApi.dispatch(fetchFilters({}))
      },
      {
        pending: state => {
          state.updatingFilterStatus = "loading"
        },
        fulfilled: state => {
          state.updatingFilterStatus = "idle"
        },
        rejected: state => {
          state.updatingFilterStatus = "failed"
        },
      },
    ),
    deleteFilter: create.asyncThunk(
      async (action: { id: string }, thunkApi) => {
        await iconsApi.deleteTokensFilter(action.id)
        thunkApi.dispatch(fetchFilters({}))
      },
      {
        pending: state => {
          state.deletingFilterStatus = "loading"
        },
        fulfilled: state => {
          state.deletingFilterStatus = "idle"
        },
        rejected: state => {
          state.deletingFilterStatus = "failed"
        },
      },
    ),
    fetchFilters: create.asyncThunk(
      async () => {
        return await iconsApi.getAllFilters()
      },
      {
        pending: state => {
          state.fetchingFilterStatus = "loading"
        },
        fulfilled: (state, action) => {
          state.filters = action.payload
          state.fetchingFilterStatus = "idle"
        },
        rejected: state => {
          state.fetchingFilterStatus = "failed"
        },
      },
    ),
  }),
})

export const { fetchCoins, updateFilter, fetchFilters, createFilter, deleteFilter } = allTokensTableSlice.actions
