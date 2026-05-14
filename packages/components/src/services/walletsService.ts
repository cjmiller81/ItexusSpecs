import moment from "moment";
import { Wallet } from "../models/wallet/wallet";
import { HistoricalWalletData } from "../models/wallet/historicalWalletData";
import { appAxios } from "../lib/axios/customAxios";
import { CapHistoricalWeightedDate } from "../models/wallet/capHistoricalWeightedDate";
import { apiDateFormatString } from "../constants/common";
import { Exchange } from "../models/wallet/exchange";
import { WalletPortfolioResponse } from "../models/wallet/walletPortfolio";
import { enrichTokenPositions, type LifiChain } from "../utils/enrichTokenPositions";

export const walletsApi = {
  getWalletsAssets: async (): Promise<Wallet[]> => {
    const response = await appAxios.get<Wallet[]>(`/api/wallet`);
    return response.data;
  },

  getExchanges: async (): Promise<Exchange[]> => {
    const response = await appAxios.get<Exchange[]>(`/api/exchanges`);
    return response.data;
  },

  deleteExchange: async (exchange: string): Promise<void> => {
    return appAxios.delete(`/api/kraken/connect/${exchange}`);
  },

  deleteWallet: async (wallet: string): Promise<void> => {
    return appAxios.delete(`/api/wallet/${wallet}`);
  },

  addWallets: async (wallet: string, walletName: string, isPersonal: boolean): Promise<void> => {
    return appAxios.post(`/api/wallet`, [
      {
        address: wallet,
        isPersonal,
        walletName,
      },
    ]);
  },
  updateWallets: async (wallet: Wallet): Promise<void> => {
    const { ...walletRequest } = wallet;
    return appAxios.post(`/api/wallet/${wallet.address}`, walletRequest);
  },
  getHistoricalWalletData: async (
    symbols: { symbol: string; qty: number; chain: string }[],
    startDate: Date,
    endDate: Date,
    compareSymbol?: string | null,
  ): Promise<HistoricalWalletData[]> => {
    const response = await appAxios.post(`/model/run/walletValueIndex`, symbols, {
      params: {
        startDate: ToUtcDateFormatted(startDate),
        endDate: ToUtcDateFormatted(endDate),
        compareSymbol,
      },
    });

    return response.data;
  },
  getHistoricalCapWeightedWalletData: async (
    startDate: Date,
    endDate: Date,
    tokensIds: string[],
    compareSymbolId?: string,
  ): Promise<CapHistoricalWeightedDate[]> => {
    const response = await appAxios.post("/model/run/marketCapWeightedIndex", tokensIds, {
      params: {
        startDate: ToUtcDateFormatted(startDate),
        endDate: ToUtcDateFormatted(endDate),
        compareTokenId: compareSymbolId,
      },
    });

    return response.data;
  },

  getWalletsPortfolio: async (
    addresses: string[],
    lifiChainMap?: Map<number, LifiChain>,
  ): Promise<WalletPortfolioResponse[]> => {
    const response = await appAxios.post(`/api/portfolio/batch`, addresses);
    if (!lifiChainMap) return response.data;
    return response.data.map((portfolio: WalletPortfolioResponse) => ({
      ...portfolio,
      tokenHoldings: enrichTokenPositions(portfolio.tokenHoldings, lifiChainMap),
    }));
  },
};

function ToUtcDateFormatted(date: Date) {
  return moment(date).utc().format(apiDateFormatString);
}
