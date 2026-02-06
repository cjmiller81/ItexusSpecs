import { HistoricalWalletData } from "@/models/Wallet/HistoricalWalletData"
import { PayloadAction } from "@reduxjs/toolkit"
import { Period, Status, createAppSlice, toTotalTokensBalancesFromPortfolio, walletsApi } from "components"
import i18next from "i18next"
import { RootState } from "../RootReducer"
import { ChartSeries, GetPrettyScale, getPeriodHistoricalDataFileter } from "./ChartSlicesCommon"
import { getHistoricalWalletWorthChartData } from "./Shared"
import { 
  getCurrentTokensValueFromZapper, 
  updateChartDataWithCurrentDayValue, 
  shouldUpdateCurrentDayValue 
} from "components"

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
        
        const selectedWalletAddresses = state.wallets.selectedWallets.map(wallet => wallet.address);
        const filteredPortfolioData = state.wallets.portfolioWalletData.filter(
          portfolio => selectedWalletAddresses.includes(portfolio.walletAddress)
        );
        
        const tokensBalances = toTotalTokensBalancesFromPortfolio(filteredPortfolioData);
        
        const response = await walletsApi.getHistoricalWalletData(
          tokensBalances,
          payload.startDate,
          payload.endDate,
          payload.tokenId,
        )

        const shouldUpdate = shouldUpdateCurrentDayValue ? shouldUpdateCurrentDayValue(payload.endDate) : false;
        if (shouldUpdate) {
          const selectedWalletAddresses = state.wallets.selectedWallets.map(wallet => wallet.address)
          const currentTokensValue = getCurrentTokensValueFromZapper ? getCurrentTokensValueFromZapper(
            filteredPortfolioData,
            selectedWalletAddresses
          ) : 0
          
          const updatedResponse = updateChartDataWithCurrentDayValue ? updateChartDataWithCurrentDayValue(response, currentTokensValue) : response
          return { seriesData: updatedResponse, comareToLabel: payload.compareLabel }
        }

        return { seriesData: response, comareToLabel: payload.compareLabel }
      },
      {
        pending: state => {
          state.statstatusFetchingHistoricalData = "loading"
        },
        fulfilled: (state, action) => {
          state.statstatusFetchingHistoricalData = "idle"
          state.chartData = action.payload
          state.chartCompareToLabel = state.chartData?.comareToLabel ?? null
          CalculateChartSeries(state)
        },
        rejected: (state, action) => {
          console.error('fetchHistoricalWalletData failed:', action.error);
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
  if (!state.chartData || !state.chartData.seriesData) {
    return
  }
  const periodFilter = getPeriodHistoricalDataFileter(state.period)
  const firstDataPoint = state.chartData.seriesData[0]
  const firstComparePrice = firstDataPoint?.comparePrice ?? null
  const firstWalletValue = firstDataPoint?.walletValue ?? 0

  const walletWorthValues = state.chartData.seriesData
    .filter(seriesPoint => periodFilter(seriesPoint.historyDate))
    .map(x => ({
      x: x.historyDate,
      y: firstWalletValue !== 0 ? ((x.walletValue - firstWalletValue) / firstWalletValue) * 100 : 0,
    }))

  if (walletWorthValues.length === 0) {
    state.chartSeries = []
    return
  }

  state.chartSeries = []
  state.chartSeries.push({
    name: i18next.t("HistoricalWalletsWorthSeries", { ns: "MyWalletsPage" }),
    data: walletWorthValues,
  })

  let compareToValues: {
    x: Date
    y: number
  }[] = []

  if (state.chartCompareToLabel && firstComparePrice !== null && firstComparePrice !== 0) {
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
    ...(state.walletWorthSeriesSelected && state.chartSeries[0] ? state.chartSeries[0].data.map(x => x.y) : []),
    ...(state.compareSymbolSeriesSelected && state.chartSeries.length > 1 && state.chartSeries[1] ? state.chartSeries[1].data.map(x => x.y) : []),
  ]
  
  if (selectedSeriesValues.length > 0) {
    state.maxChartValue = Math.max(...selectedSeriesValues)
    state.minChartValue = Math.min(...selectedSeriesValues)
    state.minChartValue = state.minChartValue > 0 ? 0 : state.minChartValue
  } else {
    state.maxChartValue = 10
    state.minChartValue = 0
  }
}

export const { fetchHistoricalWalletData, setPeriod, selectSeries } = walletWorthChartSlice.actions
