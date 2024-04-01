import i18next from "i18next"
import { ChartSeriesDataResponse } from "./WalletWorthChartSlice"

export type Period = "daily" | "weekly" | "monthly"
export type SeriesPoint = {
  x: any
  y: any
  fill?: ApexFill // eslint-disable-line no-undef
  fillColor?: string
  strokeColor?: string
  meta?: any
  goals?: any
  barHeightOffset?: number
  columnWidthOffset?: number
}

export type ChartSeries = {
  name?: string
  type?: string
  color?: string
  group?: string
  zIndex?: number
  data: SeriesPoint[]
}

//eslint-disable-next-line no-unused-vars
export function getPeriodHistoricalDataFileter(period: Period): (_: Date) => boolean {
  switch (period) {
    case "daily":
      //eslint-disable-next-line no-unused-vars
      return (_: Date) => true
    case "weekly":
      return (date: Date) => date.getDay() === 0
    case "monthly":
      return (date: Date) => date.getDate() === 1
    default:
      //eslint-disable-next-line no-unused-vars
      return (_: Date) => true
  }
}

export function MakeChartSeries(
  chartData: ChartSeriesDataResponse,
  period: Period,
  compareToLabel?: string | null,
): ChartSeries[] {
  if (!chartData || !chartData.seriesData || !chartData.seriesData.length) {
    return []
  }
  const periodFilter = getPeriodHistoricalDataFileter(period)
  const firstComparePrice = chartData.seriesData[0].comparePrice
  const firstWalletValue = chartData.seriesData[0].walletValue
  const walletWorthValues = chartData.seriesData
    .filter(seriesData => periodFilter(seriesData.historyDate))
    .map(x => ({
      x: x.historyDate,
      y: (x.walletValue - firstWalletValue) / firstWalletValue,
    }))

  const chartSeries: ChartSeries[] = []
  chartSeries.push({
    name: i18next.t("HistoricalWalletsWorthSeries", { ns: "MyWalletsPage" }),
    data: walletWorthValues,
  })

  let compareToValues: {
    x: Date
    y: number
  }[] = []

  if (compareToLabel && firstComparePrice !== null) {
    compareToValues = chartData.seriesData
      .filter(seriesData => periodFilter(seriesData.historyDate))
      .map(x => ({
        x: x.historyDate,
        y: (x.comparePrice - firstComparePrice) / firstComparePrice,
      }))
    chartSeries.push({
      name: compareToLabel,
      data: compareToValues,
    })
  }

  return chartSeries
}

export function GetPrettyScale(
  minChartValue: number,
  maxChartValue: number,
  yAxisTicks: number,
): { minChartValue: number; maxChartValue: number } {
  if (minChartValue > 0) {
    return {
      minChartValue: minChartValue,
      maxChartValue: maxChartValue,
    }
  }
  const aligningSteps = yAxisTicks - 1
  const step = (maxChartValue - minChartValue) / aligningSteps
  let shortestDistanceToZero = Infinity
  for (let i = 0; i < aligningSteps; i++) {
    const value = minChartValue + step * i
    if (Math.abs(shortestDistanceToZero) > Math.abs(value)) {
      shortestDistanceToZero = value
    }
  }

  let prettyMaxVaue = maxChartValue - shortestDistanceToZero
  let prettyMinVaue = minChartValue - shortestDistanceToZero
  if (shortestDistanceToZero < 0) {
    prettyMinVaue -= step
  }
  if (shortestDistanceToZero > 0) {
    prettyMaxVaue += step
  }

  return {
    minChartValue: prettyMinVaue,
    maxChartValue: prettyMaxVaue,
  }
}
