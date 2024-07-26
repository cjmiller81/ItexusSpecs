import { PayloadAction } from "@reduxjs/toolkit"
import { LookUpOption, Period, createAppSlice } from "components"
import { RootState } from "../RootReducer"
import { GetPrettyScale } from "./ChartSlicesCommon"
import {
  ChartSeriesDataResponse,
  MarketCapEqualWeightChartState,
  calculateMinMax,
  fetchChartData,
  initialState,
  makeChartSeries,
} from "./MarketCapEqualWeightChartSlice"

export const marketCapWeightedChartSlice = createAppSlice({
  name: "marketCapWeightedChart",
  initialState: {...initialState},
  reducers: create => ({
    resetState: create.reducer(state => {
      state = { ...initialState }
    }),
    setPeriod: create.reducer((state, action: PayloadAction<{ period: Period }>) => {
      state.period = action.payload.period
      calculateChartSeries(state)
    }),
    setFromDate: create.reducer((state, action: PayloadAction<{ fromDate: Date | null }>) => {
      state.startDate = action.payload.fromDate
    }),
    setToDate: create.reducer((state, action: PayloadAction<{ toDate: Date | null }>) => {
      state.endDate = action.payload.toDate
    }),
    setCompareOption: create.reducer((state, action: PayloadAction<{ compareToOption: LookUpOption | null }>) => {
      state.symbolOption = action.payload.compareToOption
    }),
    selectSeries: create.reducer((state, action: PayloadAction<{ seriesIndex: 0 | 1 }>) => {
      if (action.payload.seriesIndex === 0) state.indexSeriesSelected = !state.indexSeriesSelected
      if (action.payload.seriesIndex === 1) state.compareSymbolSeriesSelected = !state.compareSymbolSeriesSelected
      calculateChartSeries(state)
    }),
    fetchHistoricalCapWeightedData: create.asyncThunk(
      async ({ tokensAllocation }: { tokensAllocation: number }, thunkApi): Promise<ChartSeriesDataResponse> => {
        return fetchChartData((thunkApi.getState() as RootState).marketCapWeightedChart, tokensAllocation)
      },
      {
        pending: state => {
          state.statstatusFetchingMarcetCapData = "loading"
        },
        fulfilled: (state, action) => {
          state.statstatusFetchingMarcetCapData = "idle"
          state.chartData = action.payload
          state.chartCompareToLabel = state.chartData.comareToLabel
          calculateChartSeries(state)
        },
        rejected: state => {
          state.statstatusFetchingMarcetCapData = "failed"
        },
      },
    ),
  }),
})

function calculateChartSeries(state: MarketCapEqualWeightChartState) {
  if (!state.chartData?.seriesData?.length) {
    return
  }

  state.chartSeries = makeChartSeries(
    state.chartData,
    state.period,
    data => data.capWeightedIndex,
    state.chartCompareToLabel,
  )
  const { minValue, maxValue } = calculateMinMax(state)
  const { minChartValue, maxChartValue } = GetPrettyScale(minValue, maxValue, state.yAxisTicks)
  state.minChartValue = minChartValue
  state.maxChartValue = maxChartValue
}

export const {
  fetchHistoricalCapWeightedData,
  setToDate,
  setPeriod,
  setCompareOption,
  setFromDate,
  selectSeries,
  resetState,
} = marketCapWeightedChartSlice.actions
