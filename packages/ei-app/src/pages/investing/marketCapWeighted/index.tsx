import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { IndexModelingSection } from "@/features/Investing/IndexModelingSection";
import PrefilterTokensSection from "@/features/Investing/PrefilterTokensSection";
import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth";
import {
  fetchHistoricalCapWeightedData,
  resetState,
  selectSeries,
  setCompareOption,
  setFromDate,
  setPeriod,
  setToDate,
} from "@/libs/redux/Slices/MarketCapWeightedChartSlice";
import { fetchIndexModelingTokens, setCapital, setTokens } from "@/libs/redux/Slices/MarketCapWeightedModelingSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Stack } from "@mui/material";
import { AppAccordionSection } from "components";
import { createStore } from "devextreme-aspnet-data-nojquery";
import DataSource from "devextreme/data/data_source";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const [currentSorter, setCurrentSorter] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>(null);

  const { tokensCount, totalCapital, weight, tableData, prefilteredData } = useAppSelector(
    state => state.marketCapWeightedModeling,
  );

  const { t } = useTranslation("MarketCapPage");

  const dataSource = useMemo(
    () =>
      new DataSource({
        store: createStore({
          key: "id",
          cacheRawData: true,
          loadUrl: `${process.env.BACKEND_API_URL}/tokensV2`,

          onBeforeSend: (method, ajaxOptions) => {
            ajaxOptions.xhrFields = { withCredentials: true };
          },
        }),
        paginate: true,
        pageSize: 20,
      }),
    [],
  );

  useEffect(() => {
    dispatch(resetState());
  }, []);

  useEffect(() => {
    dispatch(
      fetchIndexModelingTokens({
        filter: currentFilter,
        sort: currentSorter,
      }),
    );
  }, [currentSorter, currentFilter]);

  const onSorterChanged = (sorter: any) => {
    setCurrentSorter(sorter ? JSON.stringify(sorter) : "[]");
  };

  const onFilterChanged = (filter: any) => {
    setCurrentFilter(filter ? JSON.stringify(filter) : "[]");
  };

  return (
    <Stack gap={2}>
      <PrefilterTokensSection
        dataSource={dataSource}
        onSorterChanged={onSorterChanged}
        onFilterChanged={onFilterChanged}
        persisKey="WeightedPrefilterTokens"
      />

      <IndexModelingSection
        persistKey="WeightedIndexModeling"
        onCapitalChange={value => dispatch(setCapital(value))}
        onTokensChange={value => {
          dispatch(setTokens(value));
        }}
        weighted={weight * 100}
        capital={totalCapital}
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
