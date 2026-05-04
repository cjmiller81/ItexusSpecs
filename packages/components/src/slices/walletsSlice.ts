import { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { Wallet } from "../models/wallet/wallet";
import { walletsApi } from "../services/walletsService";
import { toTotalTokensBalancesFromPortfolio } from "../utils";
import { createAppSlice } from "./createAppSlice";
import { RootState } from "./store";
import { IExchange } from "../models";
import { WalletPortfolioResponse } from "../models/wallet/walletPortfolio";

export type Status = "idle" | "loading" | "failed";
export interface TotalWalletWorthData {
  growPercentage: number;
}

type WalletsFilter = { isPersonal: boolean };
export interface WalletsState {
  wallets: Wallet[] | null;
  exchanges: IExchange[] | null;
  totalWalletsWorthData?: TotalWalletWorthData;
  statstatusCreatingWalletus: Status;
  statusFetchingWallets: Status;
  statusDeletingWallets: Status;
  statusDeletingExchange: Status;
  statusUpdatingWallets: Status;
  statusFetchingExchanges: Status;
  statusTotalWalletWorthFetching: Status;
  statusFetchingPortfolio: Status;
  selectedWallets: Wallet[];
  currentWalletsFilter: WalletsFilter;
  portfolioWalletData: WalletPortfolioResponse[];
}

const initialState: WalletsState = {
  wallets: null,
  exchanges: null,
  statstatusCreatingWalletus: "idle",
  statusFetchingWallets: "idle",
  statusDeletingWallets: "idle",
  statusDeletingExchange: "idle",
  statusUpdatingWallets: "idle",
  statusFetchingExchanges: "idle",
  statusTotalWalletWorthFetching: "idle",
  statusFetchingPortfolio: "idle",
  selectedWallets: [],
  currentWalletsFilter: { isPersonal: false },
  portfolioWalletData: [],
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
        try {
          await walletsApi.addWallets(wallet.address, wallet.walletName, wallet.isPersonal);
          thunkApi.dispatch(fetchWallets(null));
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            console.error(error);
            return thunkApi.rejectWithValue({ error: error.response.data });
          }
          return thunkApi.rejectWithValue({ error: "Failed to add wallet" });
        }
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

   fetchWalletsPortfolio: create.asyncThunk(
    async (
      params: { addresses: string[]; lifiChainMap?: Map<number, any> },
      thunkApi
    ) => {
      const { addresses, lifiChainMap } = params;
      try {
        const response = await walletsApi.getWalletsPortfolio(addresses, lifiChainMap);
        return response;
      } catch (error) {
        return thunkApi.rejectWithValue("Failed to fetch wallet portfolio");
      }
    },
    {
      pending: state => {
        state.statusFetchingPortfolio = "loading";
      },
      fulfilled: (state, action: PayloadAction<WalletPortfolioResponse[]>) => {
        state.statusFetchingPortfolio = "idle";
        state.portfolioWalletData = action.payload;
      },
      rejected: state => {
        state.statusFetchingPortfolio = "failed";
      },
    }
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

        if (!state.wallets.selectedWallets.length || !state.wallets.portfolioWalletData.length) {
          return {
            growPercentage: 0,
          };
        }
        const selectedWalletAddresses = state.wallets.selectedWallets.map(wallet => wallet.address);
        const filteredPortfolioData = state.wallets.portfolioWalletData.filter(
          portfolio => selectedWalletAddresses.includes(portfolio.walletAddress)
        );
        
        const historicalWalletsData = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalancesFromPortfolio(filteredPortfolioData),
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
    fetchExchanges: create.asyncThunk(
      async () => {
        const response = await walletsApi.getExchanges();
        const mappedResult = response.map(ex => {
          const model: IExchange = {
            apiKey: "",
            apiSecret: "",
            exchange_id: ex.id,
            name: ex.account,
          };
          return model;
        });
        return mappedResult;
      },
      {
        pending: state => {
          state.statusFetchingExchanges = "loading";
        },
        fulfilled: (state, action) => {
          state.statusFetchingExchanges = "idle";
          state.exchanges = action.payload;
        },
        rejected: state => {
          state.statusFetchingExchanges = "failed";
        },
      },
    ),

    deleteExchange: create.asyncThunk(
      async (exchange: string) => {
        await walletsApi.deleteExchange(exchange);
        return { removedExchange: exchange };
      },
      {
        pending: state => {
          state.statusDeletingExchange = "loading";
        },
        fulfilled: (state, action) => {
          state.statusDeletingExchange = "idle";
          state.exchanges = state.exchanges!.filter(w => w.exchange_id !== action.payload.removedExchange);
        },
        rejected: state => {
          state.statusDeletingWallets = "failed";
        },
      },
    ),
  }),
});

export const {
  createWallet,
  fetchWalletsPortfolio,
  deleteWallet,
  fetchWallets,
  fetchTotalWalletsWorthData,
  selectWallets,
  updateWallet,
  fetchExchanges,
  deleteExchange,
} = walletsSlice.actions;
