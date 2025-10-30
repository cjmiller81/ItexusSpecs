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
import { setAccordionState, updateTourStatusAsync, fetchReactourSettingsAsync } from "components";
import { Wallet } from "@/models/Wallet/Wallet";
import { Box, Stack, Typography, Button } from "@mui/material";
import { InfoBadge } from "@/components/InfoBadge";
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


const TOUR_ID = "mCapEqual_v1";
const TOUR_NAME = "mCapEqual";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  
  const openAllAccordions = () => {
    const accordionKeys = ['EqualWeightedPrefilterTokens', 'EqualWeightedIndexModeling', 'EqualWeightedHistoricalWalletsWorth', 'IndexResultsSection'];
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
                  ajaxOptions.data.filter = "[]"; 
                }
              }
            },
          }),
          paginate: true,
          pageSize: 20,
        }),
      [],
    );

  const steps: StepType[] = [
    {
      selector: "#mcew_strategy",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourMCEWStrategyTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourMCEWStrategyText")}</Typography>
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
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourCurrentFilterText")}</Typography>
      ),
      position: "left"
    },
    {
      selector: "#filter_presets",
      content: () => (
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourPrebuiltFiltersText")}</Typography>
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
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourExportText")}</Typography>
      ),
      position: "left"
    },
    {
      selector: "#modeling_section",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourModelingTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourModelingTextMCEW")}</Typography>
        </Box>
      ),
      position: "top"
    },
    {
      selector: "#historical_chart",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourHistoricalTextMCEW")}</Typography>
      ),
      position: "bottom"
    },
    {
      selector: "#token_selector",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourTokenCountTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourTokenCountTextMCEW")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#performance_metric",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourPerformanceTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourPerformanceTextMCEW")}</Typography>
        </Box>
      ),
      position: "top"
    }
  ];

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


  const onSorterChanged = (sorter: any) => {
    setCurrentSorter(sorter ? JSON.stringify(sorter) : "[]");
  };

  const onFilterChanged = (filter: any) => {
    setCurrentFilter(filter ? JSON.stringify(filter) : "[]");
  };

  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: 16, 
          background: "#f7f5f2", 
          color: "#6b7280",
          fontSize: "0.95rem",
          lineHeight: 1.8
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
      }}
      showBadge={false}
      components={{
        Content: (props: any) => {
          const step = steps[props.currentStep];
          // @ts-ignore - content() signature varies
          const content = typeof step?.content === 'function' ? step.content() : step?.content;
          
          return (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', 
                  color: '#fff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: 14,
                  flexShrink: 0,
                  marginTop: "-2px"
                }}>
                  {(props.currentStep ?? 0) + 1}
                </Box>
                <Box sx={{ flex: 1, color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  {content || null}
                </Box>
              </Box>
            </Box>
          );
        },
        Navigation: ({ setCurrentStep, currentStep, steps, setIsOpen }) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: steps?.length || 0 }).map((_, i) => (
                <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: i <= currentStep ? '#3b82f6' : '#e2e8f0' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {currentStep > 0 && (
                <Button
                  variant="contained"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  sx={{ 
                    background: '#f7f5f2', 
                    color: '#4a5568', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: 'none', 
                    textTransform: 'none',
                    '&:hover': { background: '#f0ece5', boxShadow: 'none' } 
                  }}
                >
                  Prior
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  if (currentStep === (steps?.length || 0) - 1) {
                    setIsOpen(false);
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                sx={{ background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', color: '#fff', boxShadow: 'none', textTransform: 'none' }}
              >
                {currentStep === (steps?.length || 0) - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )
      }}
    >
      <>
        <TourStateSync totalSteps={steps.length} />
        <Stack gap={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }} id="mcew_strategy">
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
        persisKey="EqualWeightedPrefilterTokens"
        dataSource={dataSource}
        onSorterChanged={onSorterChanged}
        onFilterChanged={onFilterChanged}
        id="table_header"
        filterType="market-cap-equal"
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
        id="modeling_section"
      />

      <AppAccordionSection
        persistKey="EqualWeightedHistoricalWalletsWorth"
        defaultExpanded
        title={t("EqualWeightedChartTitle")}
        tooltip={t("ToggleView", { ns: "Common" })}>
        <HistoricalWalletsWorthMarketCap
          id="historical_chart"
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
