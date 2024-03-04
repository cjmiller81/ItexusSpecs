import { Wallet } from "@/models/Wallet/Wallet"
import { walletsApi } from "@/services/walletsService"
import { createAppSlice } from "../createAppSlice"

export type Status = "idle" | "loading" | "failed"
interface WalletsState {
  wallets: Wallet[]
  statstatusCreatingWalletus: Status
  statusFetchingWallets: Status
  statusDeletingWallets: Status
}

const initialState: WalletsState = {
  wallets: [],
  statstatusCreatingWalletus: "idle",
  statusFetchingWallets: "idle",
  statusDeletingWallets: "idle",
}
export const walletsSlice = createAppSlice({
  name: "wallets",
  initialState,
  reducers: create => ({
    clearErrors: create.reducer(state => {
      state.statstatusCreatingWalletus = "idle"
      state.statusFetchingWallets = "idle"
      state.statusDeletingWallets = "idle"
    }),
    createWallet: create.asyncThunk(
      async (wallet: string, thunkApi) => {
        await walletsApi.addWallets(wallet)
        thunkApi.dispatch(fetchWallets(null))
      },
      {
        pending: state => {
          state.statstatusCreatingWalletus = "loading"
        },
        fulfilled: state => {
          state.statstatusCreatingWalletus = "idle"
        },
        rejected: state => {
          state.statstatusCreatingWalletus = "failed"
        },
      },
    ),
    deleteWallet: create.asyncThunk(
      async (wallet: string, thunkApi) => {
        await walletsApi.deleteWallet(wallet)
        thunkApi.dispatch(fetchWallets(null))
      },
      {
        pending: state => {
          state.statusDeletingWallets = "loading"
        },
        fulfilled: state => {
          state.statusDeletingWallets = "idle"
        },
        rejected: state => {
          state.statusDeletingWallets = "failed"
        },
      },
    ),
    fetchWallets: create.asyncThunk(
      async () => {
        const response = await walletsApi.getWalletsAssets()
        return response
      },
      {
        pending: state => {
          state.statusFetchingWallets = "loading"
        },
        fulfilled: (state, action) => {
          state.statusFetchingWallets = "idle"
          state.wallets = action.payload
        },
        rejected: state => {
          state.statusFetchingWallets = "failed"
        },
      },
    ),
  }),
})

export const { createWallet, deleteWallet, fetchWallets, clearErrors } = walletsSlice.actions
