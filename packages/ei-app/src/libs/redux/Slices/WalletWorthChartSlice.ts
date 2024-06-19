import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { PayloadAction } from "@reduxjs/toolkit"
import { Period, Status, createAppSlice, toTotalTokensBalances, walletsApi } from "components"
import i18next from "i18next"
import { RootState } from "../RootReducer"
import { ChartSeries, GetPrettyScale, getPeriodHistoricalDataFileter } from "./ChartSlicesCommon"
import { getHistoricalWalletWorthChartData } from "./Shared"

interface WalletsChartState {
  chartData?: ChartSeriesDataResponse
  statstatusFetchingHistoricalData: Status
  walletWorthSeriesSelected: boolean
  compareSymbolSeriesSelected: boolean
  period: Period
  chartSeries: ChartSeries[]
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
          endDate: Date
          tokenId?: string | null
          compareLabel?: string | null
        },
        thunkApi,
      ): Promise<ChartSeriesDataResponse> => {
        const state = thunkApi.getState() as RootState
        const response = await walletsApi.getHistoricalWalletData(
          toTotalTokensBalances(state.wallets.selectedWallets),
          payload.startDate,
          payload.endDate,
          payload.tokenId,
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
  makeChartSeries(state)
  CalculateMinMax(state)
  const { maxChartValue, minChartValue } = GetPrettyScale(state.minChartValue, state.maxChartValue, state.yAxisTicks)
  state.minChartValue = minChartValue
  state.maxChartValue = maxChartValue
}

function makeChartSeries(state: WalletsChartState) {
  if (!state.chartData) {
    return
  }
  const periodFilter = getPeriodHistoricalDataFileter(state.period)
  const firstComparePrice = state.chartData.seriesData[0].comparePrice

  const walletWorthValues = getHistoricalWalletWorthChartData(state.chartData.seriesData, state.period)

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
    compareToValues = state.chartData.seriesData
      .filter(seriesPoint => periodFilter(seriesPoint.historyDate))
      .map(x => ({
        x: x.historyDate,
        y: ((x.comparePrice - firstComparePrice) / firstComparePrice) * 100,
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

export const { fetchHistoricalWalletData, setPeriod, selectSeries } = walletWorthChartSlice.actions
