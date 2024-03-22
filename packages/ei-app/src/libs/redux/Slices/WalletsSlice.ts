import { WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { Wallet } from "@/models/Wallet/Wallet"
import { walletsApi } from "@/services/walletsService"
import { getTomorrowUtc, getYesterdayUtc } from "@/utils/common"
import { toTotalTokensBalances } from "@/utils/tokensTableHelpers"
import { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../RootReducer"
import { appStore } from "../Store"
import { createAppSlice } from "../createAppSlice"

export type Status = "idle" | "loading" | "failed"
export interface TotalWalletWorthData {
  totalWorth: number
  growPercentage: number
}

interface WalletsState {
  firstLoad: boolean
  wallets: Wallet[]
  totalWalletsWorthData?: TotalWalletWorthData
  statstatusCreatingWalletus: Status
  statusFetchingWallets: Status
  statusDeletingWallets: Status
  statusTotalWalletWorthFetching: Status
  selectedWallets: WalletRow[]
}

const initialState: WalletsState = {
  firstLoad: true,
  wallets: [],
  statstatusCreatingWalletus: "idle",
  statusFetchingWallets: "idle",
  statusDeletingWallets: "idle",
  statusTotalWalletWorthFetching: "idle",
  selectedWallets: [],
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
    selectWallets: create.reducer((state, action: PayloadAction<WalletRow[]>) => {
      state.selectedWallets = action.payload
    }),
    fetchTotalWalletsWorthData: create.asyncThunk(
      async (_, thunkApi): Promise<TotalWalletWorthData> => {
        const yesterday = getYesterdayUtc()
        const tomorrow = getTomorrowUtc()

        const state = thunkApi.getState() as RootState

        if (!state.walletsReducer.wallets.selectedWallets.length) {
          return {
            growPercentage: 0,
            totalWorth: 0,
          }
        }
        const historicalWalletsData = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.walletsReducer.wallets.selectedWallets),
          yesterday,
          tomorrow,
        )

        return {
          growPercentage: historicalWalletsData[0].walletValue
            ? (historicalWalletsData[1].walletValue - historicalWalletsData[0].walletValue) /
              historicalWalletsData[0].walletValue
            : 0,
          totalWorth: historicalWalletsData[1].walletValue,
        }
      },
      {
        pending: state => {
          state.statusTotalWalletWorthFetching = "loading"
        },
        fulfilled: (state, action: PayloadAction<TotalWalletWorthData>) => {
          state.statusTotalWalletWorthFetching = "idle"
          state.totalWalletsWorthData = action.payload
        },
        rejected: state => {
          state.statusTotalWalletWorthFetching = "failed"
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
      async (_, thunkApi) => {
        const response = await walletsApi.getWalletsAssets()
        const state = thunkApi.getState() as RootState
        if (state.walletsReducer.wallets.firstLoad) {
          appStore.dispatch(selectWallets(response.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))))
        }
        return response
      },
      {
        pending: state => {
          state.statusFetchingWallets = "loading"
        },
        fulfilled: (state, action) => {
          state.statusFetchingWallets = "idle"
          if (!state.firstLoad) state.wallets = action.payload
          else {
            state.firstLoad = false
            state.wallets = action.payload
          }
        },
        rejected: state => {
          state.statusFetchingWallets = "failed"
        },
      },
    ),
  }),
})

export const { createWallet, deleteWallet, clearErrors, fetchWallets, fetchTotalWalletsWorthData, selectWallets } =
  walletsSlice.actions
