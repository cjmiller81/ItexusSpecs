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
  setToDate
} from "@/libs/redux/Slices/MarketCapEqualWeightChartSlice"
import { setCapital, setPrefilteredData, setTokens } from "@/libs/redux/Slices/MarketCapEqualWeightModelingSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack } from "@mui/material"
import { AppAccordionSection } from "components"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function MarketCapEqualWeightedPage() {
  const {
    chartSeries,
    maxChartValue,
    minChartValue,
    period,
    yAxisTicks,
    startDate,
    endDate,
    symbolOption,
    statstatusFetchingMarcetCapData,
  } = useAppSelector(state => state.marketCapEqualWeightChart);
  const dispatch = useAppDispatch();

  const { tokensCount, totalCapital, weight, tableData, prefilteredData } = useAppSelector(
    state => state.MarketCapEqualWeightModeling,
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
        persisKey="EqualWeightedPrefilterTokens"
        onFilteredTokensChanged={filteredTokenData => dispatch(setPrefilteredData(filteredTokenData))}
      />

      <IndexModelingSection
        persistKey="EqualWeightedIndexModeling"
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value));
        }}
        weighted={weight * 100}
        maxTokens={prefilteredData.length}
        capital={totalCapital}
        tokens={tokensCount || 0}
        isEqualWeight
        tableAssets={tableData}
        title={t("IndexModeling")}
      />

      <AppAccordionSection
        persistKey="EqualWeightedHistoricalWalletsWorth"
        defaultExpanded
        title={t("EqualWeightedChartTitle")}>
        <HistoricalWalletsWorth
          sx={{ mt: 4, width: "100%" }}
          onFetchPage={fetchLookupPage}
          sumbitButtonText={t("RunTest")}
          chartAxisTicks={yAxisTicks}
          chartSeries={chartSeries}
          fromDate={startDate}
          toDate={endDate}
          chartDataLoading={statstatusFetchingMarcetCapData === "loading"}
          lookupOption={symbolOption}
          lookupLoading={false}
          maxChartValue={maxChartValue}
          minChartValue={minChartValue}
          onChartSubmit={() => dispatch(fetchHistoricalCapWeightedData({ tokensIds: tableData.map(t => t.id) }))}
          onFromDateChange={date => dispatch(setFromDate({ fromDate: date }))}
          onToDateChange={date => dispatch(setToDate({ toDate: date }))}
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
