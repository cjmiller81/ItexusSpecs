import { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { Wallet } from "../models/wallet/wallet";
import { walletsApi } from "../services/walletsService";
import { toTotalTokensBalances } from "../utils";
import { createAppSlice } from "./createAppSlice";
import { RootState } from "./store";

export type Status = "idle" | "loading" | "failed";
export interface TotalWalletWorthData {
  growPercentage: number;
}

type WalletsFilter = { isPersonal: boolean };
export interface WalletsState {
  wallets: Wallet[] | null;
  totalWalletsWorthData?: TotalWalletWorthData;
  statstatusCreatingWalletus: Status;
  statusFetchingWallets: Status;
  statusDeletingWallets: Status;
  statusUpdatingWallets: Status;
  statusTotalWalletWorthFetching: Status;
  selectedWallets: Wallet[];
  currentWalletsFilter: WalletsFilter;
}

const initialState: WalletsState = {
  wallets: null,
  statstatusCreatingWalletus: "idle",
  statusFetchingWallets: "idle",
  statusDeletingWallets: "idle",
  statusUpdatingWallets: "idle",
  statusTotalWalletWorthFetching: "idle",
  selectedWallets: [],
  currentWalletsFilter: { isPersonal: false },
};

type AddressModel = {
  address: string;
  walletName: string;
  isPersonal: boolean;
};

export const walletsSlice = createAppSlice({
  name: "wallets",
  initialState,
  reducers: create => ({
    createWallet: create.asyncThunk(
      async (wallet: AddressModel, thunkApi) => {
        await walletsApi.addWallets(wallet.address, wallet.walletName, wallet.isPersonal);
        thunkApi.dispatch(fetchWallets(null));
      },
      {
        pending: state => {
          state.statstatusCreatingWalletus = "loading";
        },
        fulfilled: state => {
          state.statstatusCreatingWalletus = "idle";
        },
        rejected: state => {
          state.statstatusCreatingWalletus = "failed";
        },
      },
    ),
    setWalletsFilter: create.reducer((state, action: PayloadAction<WalletsFilter>) => {
      state.currentWalletsFilter = action.payload;
    }),
    selectWallets: create.reducer((state, action: PayloadAction<Wallet[]>) => {
      state.selectedWallets = action.payload;
    }),
    updateWallet: create.asyncThunk(
      async (wallet: Wallet) => {
        await walletsApi.updateWallets(wallet);
        return wallet;
      },
      {
        pending: state => {
          state.statusUpdatingWallets = "loading";
        },
        fulfilled: (state, action) => {
          state.wallets = state.wallets!.map(wallet =>
            wallet.address === action.payload.address
              ? {
                ...wallet,
                walletName: action.payload.walletName,
                isPersonal: action.payload.isPersonal,
              }
              : wallet,
          );
          state.statusUpdatingWallets = "idle";
        },
        rejected: state => {
          state.statusUpdatingWallets = "failed";
        },
      },
    ),
    fetchTotalWalletsWorthData: create.asyncThunk(
      async (_, thunkApi): Promise<TotalWalletWorthData> => {
        const state = thunkApi.getState() as RootState;

        if (!state.wallets.selectedWallets.length) {
          return {
            growPercentage: 0,
          };
        }
        const historicalWalletsData = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.wallets.selectedWallets),
          moment().add(-1, "d").toDate(),
          moment().toDate(),
        );

        return {
          growPercentage: historicalWalletsData[0].walletValue
            ? (historicalWalletsData[1].walletValue - historicalWalletsData[0].walletValue) /
            historicalWalletsData[0].walletValue
            : 0,
        };
      },
      {
        pending: state => {
          state.statusTotalWalletWorthFetching = "loading";
        },
        fulfilled: (state, action: PayloadAction<TotalWalletWorthData>) => {
          state.statusTotalWalletWorthFetching = "idle";
          state.totalWalletsWorthData = action.payload;
        },
        rejected: state => {
          state.statusTotalWalletWorthFetching = "failed";
        },
      },
    ),
    deleteWallet: create.asyncThunk(
      async (wallet: string) => {
        await walletsApi.deleteWallet(wallet);
        return { removedWallet: wallet };
      },
      {
        pending: state => {
          state.statusDeletingWallets = "loading";
        },
        fulfilled: (state, action) => {
          state.statusDeletingWallets = "idle";
          state.wallets = state.wallets!.filter(w => w.address !== action.payload.removedWallet);
        },
        rejected: state => {
          state.statusDeletingWallets = "failed";
        },
      },
    ),
    fetchWallets: create.asyncThunk(
      async (_, thunkApi) => {
        const response = await walletsApi.getWalletsAssets();
        const state = thunkApi.getState() as RootState;
        if (state.wallets.wallets === null) {
          thunkApi.dispatch(selectWallets(response));
        }
        return response;
      },
      {
        pending: state => {
          state.statusFetchingWallets = "loading";
        },
        fulfilled: (state, action) => {
          state.statusFetchingWallets = "idle";
          state.wallets = action.payload;
        },
        rejected: state => {
          state.statusFetchingWallets = "failed";
        },
      },
    ),
  }),
});

export const { createWallet, deleteWallet, fetchWallets, fetchTotalWalletsWorthData, selectWallets, updateWallet } =
  walletsSlice.actions;
