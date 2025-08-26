import { WalletPortfolioResponse } from "../models/wallet/walletPortfolio";
import { HistoricalWalletData } from "../models/wallet/historicalWalletData";
import moment from "moment";

export const getCurrentTokensValueFromZapper = (
  portfolioData: WalletPortfolioResponse[],
  selectedWalletAddresses: string[]
): number => {
  if (!Array.isArray(portfolioData) || selectedWalletAddresses.length === 0) {
    return 0;
  }

  let totalTokensValue = 0;

  const selectedWalletsData = portfolioData.filter(wallet => 
    selectedWalletAddresses.includes(wallet.walletAddress)
  );

  selectedWalletsData.forEach(wallet => {
    if (wallet.tokenHoldings && Array.isArray(wallet.tokenHoldings)) {
      wallet.tokenHoldings.forEach(token => {
        if (token.balanceUSD) {
          totalTokensValue += token.balanceUSD;
        }
      });
    }
  });

  return totalTokensValue;
};

export const updateChartDataWithCurrentDayValue = (
  chartData: HistoricalWalletData[],
  currentTokensValue: number
): HistoricalWalletData[] => {
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return chartData;
  }

  const today = moment().startOf('day');
  const updatedData = [...chartData];

  const todayDataIndex = updatedData.findIndex(dataPoint => 
    moment(dataPoint.historyDate).startOf('day').isSame(today)
  );

  if (todayDataIndex !== -1) {
    updatedData[todayDataIndex] = {
      ...updatedData[todayDataIndex],
      walletValue: currentTokensValue
    };
  }

  return updatedData;
};

export const shouldUpdateCurrentDayValue = (endDate: Date): boolean => {
  const today = moment().startOf('day');
  const endDateStart = moment(endDate).startOf('day');
  return endDateStart.isSame(today);
};
