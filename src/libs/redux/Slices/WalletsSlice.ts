import { getUndefinedErrorMessage } from "@/constants/Errormessages"
import { Wallet } from "@/models/Wallet/Wallet"
import { walletsApi } from "@/services/walletsService"
import { createAppSlice } from "../createAppSlice"

export type Status = "idle" | "loading" | "failed"
interface WalletsState {
  wallets: Wallet[]
  errors: string[]
  statstatusCreatingWalletus: Status
  statusFetchingWallets: Status
  statusDeletingWallets: Status
}

const initialState: WalletsState = {
  wallets: [],
  errors: [],
  statstatusCreatingWalletus: "idle",
  statusFetchingWallets: "idle",
  statusDeletingWallets: "idle",
}
export const walletsSlice = createAppSlice({
  name: "wallets",
  initialState,
  reducers: create => ({
    clearErrors: create.reducer(state => {
      state.errors = []
      state.statstatusCreatingWalletus = "idle"
      state.statusFetchingWallets = "idle"
      state.statusDeletingWallets = "idle"
    }),
    createWallet: create.asyncThunk(
      async (wallet: string) => {
        await walletsApi.addWallets(wallet)
        return await walletsApi.getWalletsAssets()
      },
      {
        pending: state => {
          state.statstatusCreatingWalletus = "loading"
          state.statusFetchingWallets = "loading"
        },
        fulfilled: (state, action) => {
          state.statstatusCreatingWalletus = "idle"
          state.statusFetchingWallets = "idle"
          state.wallets = action.payload
        },
        rejected: state => {
          state.statstatusCreatingWalletus = "failed"
          state.errors.push(getUndefinedErrorMessage())
        },
      },
    ),
    deleteWallet: create.asyncThunk(
      async (wallet: string) => {
        await walletsApi.deleteWallet(wallet)
        return await walletsApi.getWalletsAssets()
      },
      {
        pending: state => {
          state.statusDeletingWallets = "loading"
          state.statusFetchingWallets = "loading"
        },
        fulfilled: (state, action) => {
          state.statusDeletingWallets = "idle"
          state.statusFetchingWallets = "idle"
          state.wallets = action.payload
        },
        rejected: state => {
          state.statusDeletingWallets = "failed"
          state.errors.push(getUndefinedErrorMessage())
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
          state.errors.push(getUndefinedErrorMessage())
        },
      },
    ),
  }),
})

export const { createWallet, deleteWallet, fetchWallets, clearErrors } = walletsSlice.actions
