import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { IndexModelingSection } from "@/features/Investing/IndexModelingSection";
import { IndexResultsSection } from "@/features/Investing/IndexResultsSection";
import PrefilterTokensSection from "@/features/Investing/PrefilterTokensSection";
import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth";
import { HistoricalWalletsWorthMarketCap } from "@/features/MyWallets/HistoricalWalletsWorthMarketCap";
import { InfoBadge } from "@/components/InfoBadge";
import {
  fetchHistoricalCapWeightedData,
  resetState,
  selectSeries,
  setCompareOption,
  setFromDate,
  setPeriod,
  setToDate,
} from "@/libs/redux/Slices/MarketCapWeightedChartSlice";
import {
  defaultTotalTokensCount,
  fetchIndexModelingTokens,
  setCapital,
  setTokens,
} from "@/libs/redux/Slices/MarketCapWeightedModelingSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { setAccordionState, updateTourStatusAsync, fetchReactourSettingsAsync } from "components";
import { Wallet } from "@/models/Wallet/Wallet";
import { Box, Stack, Typography, Button } from "@mui/material";
import { AppAccordionSection } from "components";
import { createStore } from "devextreme-aspnet-data-nojquery";
import DataSource from "devextreme/data/data_source";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../../components/AnimatedStartTourButton";

const transformFilter = (filter: any): any => {
  if (!filter || !Array.isArray(filter)) {
    return filter;
  }

  if (filter.length === 3 && filter[1] === 'between' && Array.isArray(filter[2])) {
    const [field, , values] = filter;
    const [minValue, maxValue] = values;
    
    return [
      [field, '>=', minValue],
      'and',
      [field, '<=', maxValue]
    ];
  }

  return filter.map((item: any) => {
    if (Array.isArray(item)) {
      return transformFilter(item);
    }
    return item;
  });
};

const TOUR_ID = "mCap_v1";
const TOUR_NAME = "mCap";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  
  const openAllAccordions = () => {
    const accordionKeys = ['WeightedPrefilterTokens', 'WeightedIndexModeling', 'WeightedHistoricalWalletsWorth', 'IndexResultsSection'];
    accordionKeys.forEach(key => {
      dispatch(setAccordionState({ key, open: true }));
    });
  };
  
  const handleClick = async () => {
    openAllAccordions();
    
    try {
      const latestSettings = await dispatch(fetchReactourSettingsAsync()).unwrap();
      const savedStep = latestSettings?.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;
      setCurrentStep(isNaN(savedStep) ? 0 : savedStep);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to fetch tour data:', error);
      setCurrentStep(0);
      setIsOpen(true);
    }
  };
  
  return (
    <AnimatedStartTourButton 
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
      onClick={handleClick}
    />
  );
};

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
  const [indexModelRequestPromise, setIndexModelRequestPromise] = useState<any>(null);
  const { tokensCount, totalCapital, weight, tableData, prefilteredData } = useAppSelector(
    state => state.marketCapWeightedModeling,
  );
  const [take, setCurrentTake] = useState<number>(tokensCount ?? 0);


  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const { t } = useTranslation(["MarketCapPage", "Common"]);

  const steps: StepType[] = [
    {
      selector: "#mcw_strategy",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourMCWStrategyTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourMCWStrategyText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#table_header .dx-header-row, #table_header .dx-datagrid-headers",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourQuickSortTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourQuickSortText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: ".dx-datagrid-filter-panel-text",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourCurrentFilterText")}</Typography>
      ),
      position: "left"
    },
    {
      selector: "#filter_presets",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourPrebuiltFiltersText")}</Typography>
      ),
      position: "right"
    },
    {
      selector: "#filter_builder_btn",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourCustomFiltersTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourCustomFiltersText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#export_button",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourExportText")}</Typography>
      ),
      position: "left"
    },
    {
      selector: "#modeling_section",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourModelingTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourModelingText")}</Typography>
        </Box>
      ),
      position: "top"
    },
    {
      selector: "#filter_presets",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourPrebuiltFiltersStep8Text")}</Typography>
      ),
      position: "right"
    },
    {
      selector: "#historical_chart",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourHistoricalText", { currentYear: new Date().getFullYear() })}</Typography>
      ),
      position: "bottom"
    },
    {
      selector: "#performance_metric",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourPerformanceTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourPerformanceText")}</Typography>
        </Box>
      ),
      position: "top"
    },
  ];



  const dataSource = useMemo(
    () =>
      new DataSource({
        store: createStore({
          key: "id",
          cacheRawData: true,
          loadUrl: `${process.env.BACKEND_API_URL}/tokensV2`,

          onBeforeSend: (method, ajaxOptions) => {
            ajaxOptions.xhrFields = { withCredentials: true };
            
            if (ajaxOptions.data && ajaxOptions.data.filter !== undefined) {
              try {
                if (ajaxOptions.data.filter === null || ajaxOptions.data.filter === "null") {
                  ajaxOptions.data.filter = "[]";
                } else {
                  const originalFilter = JSON.parse(ajaxOptions.data.filter);
                  const transformedFilter = transformFilter(originalFilter);
                  ajaxOptions.data.filter = JSON.stringify(transformedFilter);
                }
              } catch (error) {
                console.error('Error transforming filter in DataSource:', error);
                ajaxOptions.data.filter = "[]"; // Fallback to empty array
              }
            }
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

  const onSorterChanged = (sorter: any) => {
    setCurrentSorter(sorter ? JSON.stringify(sorter) : "[]");
  };

  const onFilterChanged = (filter: any) => {
    setCurrentFilter(filter ? JSON.stringify(filter) : "[]");
  };

  const onWalletChange = (wallet: Wallet | null) => {
    setSelectedWallet(wallet);
  };

  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: "32px 24px 24px 24px", 
          background: "#f7f5f2",
          color: "#1a1a1a", 
          minWidth: 400, 
          maxWidth: 500,
          paddingTop: "40px"
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        badge: (base) => ({ ...base, display: "none" }),
        close: (base) => ({ 
          ...base, 
          top: "12px", 
          right: "12px",
          zIndex: 1000
        }),
      }}
    >
      <>
        <TourStateSync totalSteps={steps.length} />
        <Stack gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }} id="mcw_strategy">
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold" }}>
              {t("MarketCapWeighted")}
            </Typography>
            <InfoBadge
              title="What's Market Cap Investing"
              tooltipContent={
                <>
                  <strong style={{ color: '#219a83' }}>{t("MarketCapExplained")}</strong>
                  <br /><br />
                  {t("SeeThis")} <a href="https://www.investopedia.com/terms/s/sp500.asp" target="_blank" rel="noopener noreferrer" style={{ color: '#219a83', textDecoration: 'underline' }}>{t("Article")}</a> {t("ToLearnAboutMarketCapWeightedIndexInvesting")}
                  <br /><br />
                  {t("ForFurtherInformationPleaseAlsoSeeThis")} <a href="https://www.investopedia.com/index-rebalancing-7972596" target="_blank" rel="noopener noreferrer" style={{ color: '#219a83', textDecoration: 'underline' }}>{t("Article")}</a>
                </>
              }
            />
            <StartTourButton />
          </Box>

      <PrefilterTokensSection
        dataSource={dataSource}
        onSorterChanged={onSorterChanged}
        onFilterChanged={onFilterChanged}
        persisKey="WeightedPrefilterTokens"
        id="table_header"
        filterType="market-cap"
      />

      <IndexModelingSection
        persistKey="WeightedIndexModeling"
        onTokensChange={value => {
          dispatch(setTokens(value));
        }}
        weighted={weight * 100}
        tokens={tokensCount || 0}
        tableAssets={tableData}
        title={t("IndexModeling")}
        id="modeling_section"
      />

      <AppAccordionSection
        className="index-modeling-section-container"
        persistKey="WeightedHistoricalWalletsWorth"
        defaultExpanded
        title={t("WeightedChartTitle")}
        tooltip={t("ToggleView", { ns: "Common" })}>
        <HistoricalWalletsWorthMarketCap
          id="historical_chart"
          className="index-modeling-section-container"
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
      /> : ""}
        </Stack>
      </>
    </TourProvider>
  );
}

const TourStateSync = ({ totalSteps }: { totalSteps: number }) => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  const [tourWasOpened, setTourWasOpened] = useState(false);
  const reactourSettings = useAppSelector((state) => state.reactour.settings);

  useEffect(() => {
    const loadTourData = async () => {
      try {
        await dispatch(fetchReactourSettingsAsync()).unwrap();
      } catch (error) {
        console.error('Failed to fetch tour settings:', error);
      }
    };
    loadTourData();
  }, [dispatch]);

  useEffect(() => {
    if (!reactourSettings?.tours) return;
    
    const viewed = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_VIEWED`] === 1;
    
    if (!viewed && !isOpen && !tourWasOpened) {
      const stepFromDb = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;
      if (!isNaN(stepFromDb)) setCurrentStep(stepFromDb);
      setIsOpen(true);
    }
  }, [reactourSettings, isOpen, tourWasOpened, setCurrentStep, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    dispatch(updateTourStatusAsync({
      tourName: TOUR_NAME,
      update: { 
        step: currentStep,
        viewed: currentStep >= totalSteps - 1 ? true : undefined
      }
    }));
  }, [currentStep, totalSteps, isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen && tourWasOpened) {
      dispatch(updateTourStatusAsync({
        tourName: TOUR_NAME,
        update: { viewed: true }
      }));
    } else if (isOpen) {
      setTourWasOpened(true);
    }
  }, [isOpen, tourWasOpened, dispatch]);
  
  return null;
};
