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
} from "@/libs/redux/Slices/MarketCapEqualWeightChartSlice";
import { fetchIndexModelingTokens, setCapital, setTokens } from "@/libs/redux/Slices/MarketCapEqualWeightModelingSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Stack } from "@mui/material";
import { AppAccordionSection } from "components";
import { createStore } from "devextreme-aspnet-data-nojquery";
import DataSource from "devextreme/data/data_source";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const [currentSorter, setCurrentSorter] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>(null);
  const { tokensCount, totalCapital, weight, tableData, prefilteredData } = useAppSelector(
    state => state.MarketCapEqualWeightModeling,
  );

  const { t } = useTranslation("MarketCapPage");

  useEffect(() => {
    dispatch(resetState());
  }, []);

  useEffect(() => {
    //filteredTokensApi.fetchFilteredTokens(currentSorter, currentFilter)
    dispatch(
      fetchIndexModelingTokens({
        filter: currentFilter,
        sort: currentSorter,
      }),
    );
  }, [currentSorter, currentFilter]);

  const dataSource = useMemo(
    () =>
      new DataSource({
        store: createStore({
          key: "id",
          cacheRawData: true,
          loadUrl: `${process.env.BACKEND_API_URL}/tokensV2`,

          onBeforeSend: (method, ajaxOptions) => {
            //ajaxOptions.xhrFields = { withCredentials: true };
          },
        }),
        paginate: true,
        pageSize: 20,
      }),
    [],
  );

  const onSorterChanged = (sorter: any) => {
    setCurrentSorter(sorter ? JSON.stringify(sorter) : "[]");
  };

  const onFilterChanged = (filter: any) => {
    setCurrentFilter(filter ? JSON.stringify(filter) : "[]");
  };

  return (
    <Stack gap={2}>
      <PrefilterTokensSection
        persisKey="EqualWeightedPrefilterTokens"
        dataSource={dataSource}
        onSorterChanged={onSorterChanged}
        onFilterChanged={onFilterChanged}
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
