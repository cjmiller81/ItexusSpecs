import { LookUpOption } from "@/components/common/inputs/SymbolsLookup"
import { WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { ChartSeriesDataResponse } from "@/libs/redux/Slices/WalletWorthChartSlice"
import { Asset } from "@/models/Wallet/asset"
import { ChainAsset } from "@/models/Wallet/ChainAsset"
import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { Wallet } from "@/models/Wallet/Wallet"

export interface WalletTokensTableModel extends Asset {
  price?: number
  usdAmount?: number
  chainName: string
}

export const toTableTokensModels = (chainAssets: ChainAsset[]): WalletTokensTableModel[] => {
  return chainAssets.flatMap(chainAsset => toTableTokensModel(chainAsset))
}

export const toTableTokensModel = (chainAsset: ChainAsset): WalletTokensTableModel[] => {
  const tokenDetailsMap = new Map(chainAsset.tokenDetails.map(details => [details.sym, details]))
  const tableAssets = chainAsset.walletAssets.map<WalletTokensTableModel>(asset => {
    const details = tokenDetailsMap.get(asset.tokenName.toLowerCase())
    return details
      ? {
          ...asset,
          price: details.price,
          usdAmount: details.price * asset.balance,
          chainName: chainAsset.chainName,
        }
      : { ...asset, chainName: chainAsset.chainName }
  })

  return tableAssets
}

export const getWalletsUsdTotal = (wallets: Wallet[]): number => {
  const total = wallets.reduce((acc, wallet) => {
    return acc + getWalletUsdTotal(wallet)
  }, 0)

  return total
}

export const getWalletUsdTotal = (wallet: Wallet) => {
  return wallet.chainAssets.reduce((chainAcc, chainAssets) => {
    const tokenDetailsMap = new Map(chainAssets.tokenDetails.map(details => [details.sym, details]))

    const assetsTotal = chainAssets.walletAssets.reduce((assetsAcc, asset) => {
      const details = tokenDetailsMap.get(asset.tokenName.toLocaleLowerCase())
      return details ? assetsAcc + asset.balance * details.price : assetsAcc
    }, 0)

    return chainAcc + assetsTotal
  }, 0)
}

export const toOptions = (wallets: WalletRow[]): LookUpOption[] => {
  const options = wallets
    .flatMap(x => x.chainAssets)
    .map(chainAssets => {
      const tokenModels = toTableTokensModel(chainAssets)
      return tokenModels.map<LookUpOption>(token => ({
        iconUrl: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1696501628",
        label: token.tokenName,
      }))
    })
    .flat()

  return options.filter((option, index, arr) => index === arr.findIndex(t => t.label === option.label))
}

//eslint-disable-next-line no-undef
export const toTotalTokensBalances = (wallets: WalletRow[]): { symbol: string; qty: number }[] => {
  const allChainsAssets = wallets
    .flatMap(x => x.chainAssets)
    .map(x => toTableTokensModel(x))
    .flat()

  const groupedSymbols = new Map<string, { totalBalance: number }>()
  for (const e of allChainsAssets) {
    const key = e.tokenName.toLowerCase()
    let value = groupedSymbols.get(key)
    if (!value) {
      groupedSymbols.set(key, { totalBalance: e.balance })
    } else {
      value.totalBalance += e.balance
    }
  }

  return Array.from(groupedSymbols, ([key, value]) => ({ symbol: key, qty: Math.round(value.totalBalance) }))
}

//eslint-disable-next-line no-undef
export const toChartSeries = (
  chartData: ChartSeriesDataResponse,
  historicalWalletsWorthSeriesLabel: string,
  compareToSeriesLabel: string,
  //eslint-disable-next-line no-undef
): { series: ApexAxisChartSeries; min: number; max: number } => {
  if (!chartData || !chartData.seriesData.length) {
    return {
      min: 0,
      max: 10,
      series: [],
    }
  }

  const firstComparePrice = chartData.seriesData[0].comparePrice
  const firstWalletValue = chartData.seriesData[0].walletValue

  const chartDataOffset = 0.1
  const maxPercentageValue = (chartData.maxY - firstWalletValue) / firstWalletValue
  const minPercentageValue = (chartData.minY - firstWalletValue) / firstWalletValue
  return {
    max: maxPercentageValue + Math.abs(chartDataOffset * maxPercentageValue),
    min: minPercentageValue - Math.abs(chartDataOffset * minPercentageValue),
    series: chartData.seriesData
      ? [
          {
            name: historicalWalletsWorthSeriesLabel,
            data: chartData.seriesData.map(x => ({
              x: x.historyDate,
              y: (x.walletValue - firstWalletValue) / firstWalletValue,
            })),
          },
          {
            name: compareToSeriesLabel,
            data: chartData.seriesData.map(x => ({
              x: x.historyDate,
              y: (x.comparePrice - firstComparePrice) / firstComparePrice,
            })),
          },
        ]
      : [],
  }
}

export const getChartDataScale = (chartData: HistoricalWalletData[]): { min: number; max: number } => {
  const findMinMax = (
    historicalWalletData: HistoricalWalletData[],
    //eslint-disable-next-line no-unused-vars
    selector: (seriesData: HistoricalWalletData) => number,
  ): { min: number; max: number } => {
    let min: number = selector(historicalWalletData[0])
    let max: number = selector(historicalWalletData[0])

    for (let i = 1; i < historicalWalletData.length; i++) {
      const value = selector(historicalWalletData[i])
      if (value < min) {
        min = value
      } else if (value > max) {
        max = value
      }
    }

    return { min: min, max: max }
  }

  const compareMinMax = findMinMax(chartData, s => s.comparePrice)
  const walletValueMinMax = findMinMax(chartData, s => s.walletValue)
  return {
    min: Math.min(compareMinMax.min, walletValueMinMax.min),
    max: Math.min(walletValueMinMax.max, walletValueMinMax.max),
  }
}
