import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { IndexModelingSection } from "@/features/Investing/IndexModelingSection";
import { IndexResultsSection } from "@/features/Investing/IndexResultsSection";
import PrefilterTokensSection from "@/features/Investing/PrefilterTokensSection";
import { HistoricalWalletsWorthMarketCap } from "@/features/MyWallets/HistoricalWalletsWorthMarketCap";
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
import { defaultTotalTokensCount } from "@/libs/redux/Slices/MarketCapWeightedModelingSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Wallet } from "@/models/Wallet/Wallet";
import { Box, Stack, Typography } from "@mui/material";
import { InfoBadge } from "@/components/InfoBadge";
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
    state => state.marketCapEqualWeightModeling,
  );
  const [take, setCurrentTake] = useState<number>(tokensCount ?? 0);
  const [indexModelRequestPromise, setIndexModelRequestPromise] = useState<any>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const { t } = useTranslation(["MarketCapPage", "Common"]);

  useEffect(() => {
    dispatch(resetState());
  }, []);

  useEffect(() => {
    if (tokensCount && prefilteredData.length >= tokensCount) {
      return;
    }

    const additionalPageSize = 10;
    const currentTake = tokensCount
      ? Math.max(tokensCount, prefilteredData.length + additionalPageSize)
      : defaultTotalTokensCount;

    if (currentTake > 0 && (!take || currentTake !== take)) {
      setCurrentTake(currentTake);
    }
  }, [tokensCount]);

  useEffect(() => {
    if (take > 0) {
      refreshIndexModelingData(take);
    }
  }, [currentSorter, currentFilter, take]);

  const onWalletChange = (wallet: Wallet | null) => {
    setSelectedWallet(wallet); 
  };

  const refreshIndexModelingData = currentTake => {
    if (!indexModelRequestPromise) {
      var requestPromise = dispatch(
        fetchIndexModelingTokens({
          filter: currentFilter,
          sort: currentSorter,
          take: currentTake,
        }),
      );

      setIndexModelRequestPromise(requestPromise);
    } else {
      indexModelRequestPromise.then(() => {
        dispatch(
          fetchIndexModelingTokens({
            filter: currentFilter,
            sort: currentSorter,
            take: currentTake,
          }),
        );

        setIndexModelRequestPromise(null);
      });
    }
  };

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

  const onSorterChanged = (sorter: any) => {
    setCurrentSorter(sorter ? JSON.stringify(sorter) : "[]");
  };

  const onFilterChanged = (filter: any) => {
    setCurrentFilter(filter ? JSON.stringify(filter) : "[]");
  };

  return (
    <Stack gap={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: "bold" }}>
          {t("MarketCapEqualWeight")}
        </Typography>
        <InfoBadge
          title="What's Market Cap Investing"
          tooltipContent={
            <>
              <strong style={{ color: '#60a5fa' }}>Market Cap Explained</strong>
              <br /><br />
              See this <a href="https://www.investopedia.com/terms/s/sp500.asp" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>article</a> to learn about Market Cap Weighted Index investing
              <br /><br />
              For further information, please also see this <a href="https://www.investopedia.com/index-rebalancing-7972596" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>article</a>
            </>
          }
        />
      </Box>

      <PrefilterTokensSection
        persisKey="EqualWeightedPrefilterTokens"
        dataSource={dataSource}
        onSorterChanged={onSorterChanged}
        onFilterChanged={onFilterChanged}
      />

      <IndexModelingSection
        persistKey="EqualWeightedIndexModeling"
        onTokensChange={value => {
          dispatch(setTokens(value));
        }}
        weighted={weight * 100}
        tokens={tokensCount || 0}
        isEqualWeight
        tableAssets={tableData}
        title={t("IndexModeling")}
      />

      <AppAccordionSection
        persistKey="EqualWeightedHistoricalWalletsWorth"
        defaultExpanded
        title={t("EqualWeightedChartTitle")}
        tooltip={t("ToggleView", { ns: "Common" })}>
        <HistoricalWalletsWorthMarketCap
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
    
    {showPanel?
      <IndexResultsSection
        title={t("IndexResults")}
        tableAssets={tableData}
        onWalletChange={onWalletChange}
        onCapitalChange={value => dispatch(setCapital(value))}
        capital={totalCapital}
        onTokensChange={value => {
          dispatch(setTokens(value));
        }}
        tokens={tokensCount || 0}
      /> :""}
    </Stack>
  );
}
