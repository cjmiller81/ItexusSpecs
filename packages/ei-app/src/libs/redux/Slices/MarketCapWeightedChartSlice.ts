import { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import { Period } from "@/containers/MyWallets/WalletsTable"
import { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../RootReducer"
import { createAppSlice } from "../createAppSlice"
import { GetPrettyScale } from "./ChartSlicesCommon"
import { ChartSeriesDataResponse, MarketCapEqualWeightChartState, calculateMinMax, fetchChartData, initialState, makeChartSeries } from "./MarketCapEqualWeightChartSlice"

export const marketCapWeightedChartSlice = createAppSlice({
  name: "marketCapWeightedChart",
  initialState,
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
      async (_, thunkApi): Promise<ChartSeriesDataResponse> => {
        return fetchChartData(thunkApi.getState() as RootState)
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

export const { fetchHistoricalCapWeightedData, setToDate, setPeriod, setCompareOption, setFromDate, selectSeries, resetState } =
  marketCapWeightedChartSlice.actions
