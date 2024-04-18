import { AddressModel } from "@/components/Modals/WalletInputModal"
import { Wallet } from "@/models/Wallet/Wallet"
import { walletsApi } from "@/services/walletsService"
import { toTotalTokensBalances } from "@/utils/tokensTableHelpers"
import { PayloadAction } from "@reduxjs/toolkit"
import moment from "moment"
import { RootState } from "../RootReducer"
import { appStore } from "../Store"
import { createAppSlice } from "../createAppSlice"

export type Status = "idle" | "loading" | "failed"
export interface TotalWalletWorthData {
  totalWorth: number
  growPercentage: number
}

type WalletsFilter = {isPersonal: boolean}
interface WalletsState {
  firstLoad: boolean
  wallets: Wallet[]
  totalWalletsWorthData?: TotalWalletWorthData
  statstatusCreatingWalletus: Status
  statusFetchingWallets: Status
  statusDeletingWallets: Status
  statusUpdatingWallets: Status
  statusTotalWalletWorthFetching: Status
  selectedWallets: Wallet[]
  currentWalletsFilter: WalletsFilter
}

const initialState: WalletsState = {
  firstLoad: true,
  wallets: [],
  statstatusCreatingWalletus: "idle",
  statusFetchingWallets: "idle",
  statusDeletingWallets: "idle",
  statusUpdatingWallets: "idle",
  statusTotalWalletWorthFetching: "idle",
  selectedWallets: [],
  currentWalletsFilter: {isPersonal: false}
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
      async (wallet: AddressModel, thunkApi) => {
        await walletsApi.addWallets(wallet.address, wallet.walletName, wallet.isPersonal)
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
    setWalletsFilter: create.reducer((state, action: PayloadAction<WalletsFilter>) => {
      state.currentWalletsFilter = action.payload
    }),
    selectWallets: create.reducer((state, action: PayloadAction<Wallet[]>) => {
      state.selectedWallets = action.payload
    }),
    updateWallet: create.asyncThunk(
      async (wallet: Wallet, thunkApi) => {
        await walletsApi.updateWallets(wallet)
        thunkApi.dispatch(fetchWallets(null))
      },
      {
        pending: state => {
          state.statusUpdatingWallets = "loading"
        },
        fulfilled: state => {
          state.statusUpdatingWallets = "idle"
        },
        rejected: state => {
          state.statusUpdatingWallets = "failed"
        },
      },
    ),
    fetchTotalWalletsWorthData: create.asyncThunk(
      async (_, thunkApi): Promise<TotalWalletWorthData> => {
        const state = thunkApi.getState() as RootState

        if (!state.walletsReducer.wallets.selectedWallets.length) {
          return {
            growPercentage: 0,
            totalWorth: 0,
          }
        }
        const historicalWalletsData = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.walletsReducer.wallets.selectedWallets),
          moment.utc().add(-1, "d").toDate(),
          moment.utc().add(1, "d").toDate(),
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
          appStore.dispatch(selectWallets(response))
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

export const {
  createWallet,
  deleteWallet,
  clearErrors,
  fetchWallets,
  fetchTotalWalletsWorthData,
  selectWallets,
  updateWallet,
} = walletsSlice.actions
