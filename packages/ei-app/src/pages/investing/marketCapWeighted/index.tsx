import fetchLookupPage from "@/features/Common/fetchLookupPage"
import { IndexModelingSection } from "@/features/Investing/IndexModelingSection"
import PrefilterTokensSection from "@/features/Investing/PrefilterTokensSection"
import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth"
import { fetchCoins } from "@/libs/redux/Slices/AllTokensTableSlice"
import {
  fetchHistoricalCapWeightedData,
  resetState,
  selectSeries,
  setCompareOption,
  setFromDate,
  setPeriod,
  setToDate,
} from "@/libs/redux/Slices/MarketCapWeightedChartSlice"
import { setCapital, setPrefilteredData, setTokens } from "@/libs/redux/Slices/MarketCapWeightedModelingSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack } from "@mui/material"
import { AppAccordionSection } from "components"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function MarketCapWeightedPage() {
  const {
    chartSeries,
    maxChartValue,
    minChartValue,
    period,
    yAxisTicks,
    startDate,
    symbolOption,
    statstatusFetchingMarcetCapData,
    endDate,
  } = useAppSelector(state => state.marketCapWeightedChart);
  const dispatch = useAppDispatch();

  const { tokensCount, totalCapital, weight, tableData, prefilteredData } = useAppSelector(
    state => state.MarketCapWeightedModeling,
  );

  const { t } = useTranslation("MarketCapPage");

  useEffect(() => {
    dispatch(resetState());
    dispatch(fetchCoins({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={2}>
      <PrefilterTokensSection
        persisKey="WeightedPrefilterTokens"
        onFilteredTokensChanged={filteredTokenData => dispatch(setPrefilteredData(filteredTokenData))}
      />

      <IndexModelingSection
        persistKey="WeightedIndexModeling"
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value));
        }}
        weighted={weight * 100}
        capital={totalCapital}
        maxTokens={prefilteredData.length}
        tokens={tokensCount || 0}
        tableAssets={tableData}
        title={t("IndexModeling")}
      />

      <AppAccordionSection
        persistKey="WeightedHistoricalWalletsWorth"
        defaultExpanded
        title={t("WeightedChartTitle")}>
        <HistoricalWalletsWorth
          onFetchPage={fetchLookupPage}
          toDate={endDate}
          sx={{ mt: 4, width: "100%" }}
          sumbitButtonText={t("RunTest")}
          chartAxisTicks={yAxisTicks}
          chartSeries={chartSeries}
          fromDate={startDate}
          chartDataLoading={statstatusFetchingMarcetCapData === "loading"}
          lookupOption={symbolOption}
          lookupLoading={false}
          maxChartValue={maxChartValue}
          minChartValue={minChartValue}
          onChartSubmit={() => dispatch(fetchHistoricalCapWeightedData({ tokensIds: tableData.map(t => t.id) }))}
          onToDateChange={date => dispatch(setToDate({ toDate: date }))}
          onFromDateChange={date => dispatch(setFromDate({ fromDate: date }))}
          onOptionChange={option => dispatch(setCompareOption({ compareToOption: option }))}
          onPeriodChange={period => dispatch(setPeriod({ period: period }))}
          period={period}
          onToggleSeries={index => dispatch(selectSeries({ seriesIndex: index }))}
          submitButtonDisabled={!startDate}
          title={""}
        />
      </AppAccordionSection>
    </Stack>
  );
}
