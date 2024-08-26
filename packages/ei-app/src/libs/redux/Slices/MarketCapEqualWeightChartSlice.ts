import { CapHistoricalWeightedDate } from "@/models/Wallet/CapHistoricalWeightedDate";
import { PayloadAction } from "@reduxjs/toolkit";
import { LookUpOption, Period, Status, createAppSlice, walletsApi } from "components";
import i18next from "i18next";
import { RootState } from "../RootReducer";
import { ChartSeries, GetPrettyScale, getPeriodHistoricalDataFileter } from "./ChartSlicesCommon";

export interface MarketCapEqualWeightChartState {
  chartData?: ChartSeriesDataResponse;
  statstatusFetchingMarcetCapData: Status;
  indexSeriesSelected: boolean;
  compareSymbolSeriesSelected: boolean;
  period: Period;
  chartSeries: ChartSeries[];
  chartCompareToLabel?: string | null;
  minChartValue: number;
  maxChartValue: number;
  yAxisTicks: number;
  startDate: Date | null;
  endDate: Date | null;
  symbolOption?: LookUpOption | null;
}

export interface ChartSeriesDataResponse {
  seriesData: CapHistoricalWeightedDate[];
  comareToLabel?: string | null;
}

export const initialState: MarketCapEqualWeightChartState = {
  chartData: undefined,
  period: "daily",
  chartSeries: [],
  statstatusFetchingMarcetCapData: "idle",
  indexSeriesSelected: true,
  compareSymbolSeriesSelected: true,
  minChartValue: 0,
  maxChartValue: 10,
  yAxisTicks: 6,
  startDate: null,
  endDate: new Date(),
};

export const marketCapEqualWeightChartSlice = createAppSlice({
  name: "marketCapEqualWeightChart",
  initialState: { ...initialState },
  reducers: create => ({
    resetState: create.reducer(state => {
      state = { ...initialState };
    }),
    setPeriod: create.reducer((state, action: PayloadAction<{ period: Period }>) => {
      state.period = action.payload.period;
      calculateChartSeries(state);
    }),
    setFromDate: create.reducer((state, action: PayloadAction<{ fromDate: Date | null }>) => {
      state.startDate = action.payload.fromDate;
    }),
    setToDate: create.reducer((state, action: PayloadAction<{ toDate: Date | null }>) => {
      state.endDate = action.payload.toDate;
    }),
    setCompareOption: create.reducer((state, action: PayloadAction<{ compareToOption: LookUpOption | null }>) => {
      state.symbolOption = action.payload.compareToOption;
    }),
    selectSeries: create.reducer((state, action: PayloadAction<{ seriesIndex: 0 | 1 }>) => {
      if (action.payload.seriesIndex === 0) state.indexSeriesSelected = !state.indexSeriesSelected;
      if (action.payload.seriesIndex === 1) state.compareSymbolSeriesSelected = !state.compareSymbolSeriesSelected;
      calculateChartSeries(state);
    }),
    fetchHistoricalCapWeightedData: create.asyncThunk(
      async ({ tokensAllocation }: { tokensAllocation: number }, thunkApi): Promise<ChartSeriesDataResponse> => {
        return fetchChartData((thunkApi.getState() as RootState).marketCapEqualWeightChart, tokensAllocation);
      },
      {
        pending: state => {
          state.statstatusFetchingMarcetCapData = "loading";
        },
        fulfilled: (state, action) => {
          state.statstatusFetchingMarcetCapData = "idle";
          state.chartData = action.payload;
          state.chartCompareToLabel = state.chartData.comareToLabel;
          calculateChartSeries(state);
        },
        rejected: state => {
          state.statstatusFetchingMarcetCapData = "failed";
        },
      },
    ),
  }),
});

export async function fetchChartData(state: MarketCapEqualWeightChartState, tokensAllocation: number) {
  if (!state.startDate) {
    throw "startDate is not set";
  }

  const response = await walletsApi.getHistoricalCapWeightedWalletData(
    state.startDate,
    state.endDate || new Date(),
    tokensAllocation,
    state.symbolOption?.id,
  );
  return {
    seriesData: response,
    comareToLabel: state.symbolOption?.label,
  };
}

function calculateChartSeries(state: MarketCapEqualWeightChartState) {
  if (!state.chartData?.seriesData?.length) {
    return;
  }

  state.chartSeries = makeChartSeries(
    state.chartData,
    state.period,
    data => data.capEqualWeightedIndex,
    state.chartCompareToLabel,
  );

  const { minValue, maxValue } = calculateMinMax(state);
  const { minChartValue, maxChartValue } = GetPrettyScale(minValue, maxValue, state.yAxisTicks);
  state.minChartValue = minChartValue;
  state.maxChartValue = maxChartValue;
}

export function makeChartSeries(
  chartData: ChartSeriesDataResponse,
  period: Period,
  mainValueSelector: (data: CapHistoricalWeightedDate) => number,
  compareToLabel?: string | null,
): ChartSeries[] {
  if (!chartData || !chartData.seriesData || !chartData.seriesData.length) {
    return [];
  }
  const periodFilter = getPeriodHistoricalDataFileter(period);
  const firstComparePrice = chartData.seriesData[0].comparePrice;
  const firstCapWeightIndexValue = mainValueSelector(chartData.seriesData[0]);
  const capEqualWeightedIndexValues = chartData.seriesData
    .filter(seriesData => periodFilter(seriesData.capWeightedDate))
    .map(x => ({
      x: x.capWeightedDate,
      y: ((mainValueSelector(x) - firstCapWeightIndexValue) / firstCapWeightIndexValue) * 100,
    }));

  const chartSeries: ChartSeries[] = [];
  chartSeries.push({
    name: i18next.t("Index", { ns: "MarketCapEqualWeight" }),
    data: capEqualWeightedIndexValues,
  });

  let compareToValues: {
    x: Date;
    y: number;
  }[] = [];

  if (compareToLabel && firstComparePrice !== null) {
    compareToValues = chartData.seriesData
      .filter(seriesData => periodFilter(seriesData.capWeightedDate))
      .map(x => ({
        x: x.capWeightedDate,
        y: ((x.comparePrice - firstComparePrice) / firstComparePrice) * 100,
      }));

    chartSeries.push({
      name: compareToLabel,
      data: compareToValues,
    });
  }

  return chartSeries;
}

export function calculateMinMax(state: MarketCapEqualWeightChartState): { minValue: number; maxValue: number } {
  const selectedSeriesValues = [
    ...(state.indexSeriesSelected ? state.chartSeries[0].data.map(seriesPoint => seriesPoint) : []),
    ...(state.compareSymbolSeriesSelected && state.chartSeries.length > 1
      ? state.chartSeries[1].data.map(seriesPoint => seriesPoint)
      : []),
  ].map(seriesPoint => seriesPoint.y);

  const maxValue = Math.max(...selectedSeriesValues);
  let minValue = Math.min(...selectedSeriesValues);
  minValue = minValue > 0 ? 0 : minValue;

  return {
    minValue: minValue,
    maxValue: maxValue,
  };
}

export const {
  fetchHistoricalCapWeightedData,
  setToDate,
  setPeriod,
  setCompareOption,
  setFromDate,
  selectSeries,
  resetState,
} = marketCapEqualWeightChartSlice.actions;
