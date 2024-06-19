import { HistoricalWalletData, Period } from "components"
import { getPeriodHistoricalDataFileter } from "./ChartSlicesCommon"

export type CompareToValues = {
  x: Date
  y: number
}[]

export function getHistoricalWalletWorthChartData(
  historicalWalletData: HistoricalWalletData[],
  period: Period,
): CompareToValues {
  const periodFilter = getPeriodHistoricalDataFileter(period)

  const firstWalletValue = historicalWalletData[0].walletValue
  const walletWorthValues = historicalWalletData
    .filter(seriesPoint => periodFilter(seriesPoint.historyDate))
    .map(x => ({
      x: x.historyDate,
      y: ((x.walletValue - firstWalletValue) / firstWalletValue) * 100,
    }))

  return walletWorthValues
}
