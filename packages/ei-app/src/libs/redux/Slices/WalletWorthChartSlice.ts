import { Period } from "@/containers/MyWallets/WalletsTable"
import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { walletsApi } from "@/services/walletsService"
import { getTomorrowUtc } from "@/utils/common"
import { toTotalTokensBalances } from "@/utils/tokensTableHelpers"
import { PayloadAction } from "@reduxjs/toolkit"
import i18next from "i18next"
import { RootState } from "../RootReducer"
import { createAppSlice } from "../createAppSlice"
import { Status } from "./UiSlice"

type SeriesPoint = {
  x: any
  y: any
  //eslint-disable-next-line no-undef
  fill?: ApexFill
  fillColor?: string
  strokeColor?: string
  meta?: any
  goals?: any
  barHeightOffset?: number
  columnWidthOffset?: number
}

interface WalletsChartState {
  chartData?: ChartSeriesDataResponse
  statstatusFetchingHistoricalData: Status
  walletWorthSeriesSelected: boolean
  compareSymbolSeriesSelected: boolean
  period: Period
  chartSeries: {
    name?: string
    type?: string
    color?: string
    group?: string
    zIndex?: number
    data: SeriesPoint[]
  }[]
  chartCompareToLabel?: string | null
  minChartValue: number
  maxChartValue: number
  yAxisTicks: number
}

export interface ChartSeriesDataResponse {
  seriesData: HistoricalWalletData[]
  comareToLabel?: string | null
}

const initialState: WalletsChartState = {
  chartData: undefined,
  period: "daily",
  chartSeries: [],
  statstatusFetchingHistoricalData: "idle",
  walletWorthSeriesSelected: true,
  compareSymbolSeriesSelected: true,
  minChartValue: 0,
  maxChartValue: 10,
  yAxisTicks: 6,
}
export const walletWorthChartSlice = createAppSlice({
  name: "walletWorthChart",
  initialState,
  reducers: create => ({
    setPeriod: create.reducer((state, action: PayloadAction<{ period: Period }>) => {
      state.period = action.payload.period
      CalculateChartSeries(state)
    }),
    selectSeries: create.reducer((state, action: PayloadAction<{ seriesIndex: number }>) => {
      if (action.payload.seriesIndex === 0) state.walletWorthSeriesSelected = !state.walletWorthSeriesSelected
      if (action.payload.seriesIndex === 1) state.compareSymbolSeriesSelected = !state.compareSymbolSeriesSelected
      CalculateChartSeries(state)
    }),
    fetchHistoricalWalletData: create.asyncThunk(
      async (
        payload: {
          startDate: Date
          compareSymbol?: string | null
          compareLabel?: string | null
        },
        thunkApi,
      ): Promise<ChartSeriesDataResponse> => {
        const state = thunkApi.getState() as RootState
        const response = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.walletsReducer.wallets.selectedWallets),
          payload.startDate,
          getTomorrowUtc(),
          payload.compareSymbol,
        )
        return { seriesData: response, comareToLabel: payload.compareLabel }
      },
      {
        pending: state => {
          state.statstatusFetchingHistoricalData = "loading"
        },
        fulfilled: (state, action) => {
          state.statstatusFetchingHistoricalData = "idle"
          state.chartData = action.payload
          state.chartCompareToLabel = state.chartData.comareToLabel
          CalculateChartSeries(state)
        },
        rejected: state => {
          state.statstatusFetchingHistoricalData = "failed"
        },
      },
    ),
  }),
})

function CalculateChartSeries(state: WalletsChartState) {
  MakeChartSeries(state)
  CalculateMinMax(state)
  MakePrettyScale(state)
}

function MakeChartSeries(state: WalletsChartState) {
  if (!state.chartData || !state.chartData.seriesData || !state.chartData.seriesData.length) {
    return
  }
  const periodFilter = getPeriodHistoricalDataFileter(state.period)
  const firstComparePrice = state.chartData.seriesData[0].comparePrice
  const firstWalletValue = state.chartData.seriesData[0].walletValue
  const walletWorthValues = state.chartData.seriesData.filter(periodFilter).map(x => ({
    x: x.historyDate,
    y: (x.walletValue - firstWalletValue) / firstWalletValue,
  }))

  state.chartSeries = []
  state.chartSeries.push({
    name: i18next.t("HistoricalWalletsWorthSeries", { ns: "MyWalletsPage" }),
    data: walletWorthValues,
  })

  let compareToValues: {
    x: Date
    y: number
  }[] = []

  if (state.chartCompareToLabel && firstComparePrice !== null) {
    compareToValues = state.chartData.seriesData.filter(periodFilter).map(x => ({
      x: x.historyDate,
      y: (x.comparePrice - firstComparePrice) / firstComparePrice,
    }))
    state.chartSeries.push({
      name: state.chartCompareToLabel,
      data: compareToValues,
    })
  }
}
function CalculateMinMax(state: WalletsChartState) {
  const selectedSeriesValues = [
    ...(state.walletWorthSeriesSelected ? state.chartSeries[0].data.map(x => x) : []),
    ...(state.compareSymbolSeriesSelected && state.chartSeries.length > 1 ? state.chartSeries[1].data.map(x => x) : []),
  ].map(p => p.y)
  state.maxChartValue = Math.max(...selectedSeriesValues)
  state.minChartValue = Math.min(...selectedSeriesValues)
  state.minChartValue = state.minChartValue > 0 ? 0 : state.minChartValue
}
function MakePrettyScale(state: WalletsChartState) {
  if (state.minChartValue < 0) {
    const aligningSteps = state.yAxisTicks - 1
    const step = (state.maxChartValue - state.minChartValue) / aligningSteps
    let shortestDistanceToZero = Infinity
    for (let i = 0; i < aligningSteps; i++) {
      const value = state.minChartValue + step * i
      if (Math.abs(shortestDistanceToZero) > Math.abs(value)) {
        shortestDistanceToZero = value
      }
    }

    state.maxChartValue -= shortestDistanceToZero
    state.minChartValue -= shortestDistanceToZero
    if (shortestDistanceToZero < 0) {
      state.minChartValue -= step
    }
    if (shortestDistanceToZero > 0) {
      state.maxChartValue += step
    }
  }
}

//eslint-disable-next-line no-unused-vars
function getPeriodHistoricalDataFileter(period: Period): (_: HistoricalWalletData) => boolean {
  switch (period) {
    case "daily":
      //eslint-disable-next-line no-unused-vars
      return (_: HistoricalWalletData) => true
    case "weekly":
      return (dataPoint: HistoricalWalletData) => dataPoint.historyDate.getDay() === 0
    case "monthly":
      return (dataPoint: HistoricalWalletData) => dataPoint.historyDate.getDate() === 1
    default:
      //eslint-disable-next-line no-unused-vars
      return (_: HistoricalWalletData) => true
  }
}

export const { fetchHistoricalWalletData, setPeriod, selectSeries } = walletWorthChartSlice.actions
