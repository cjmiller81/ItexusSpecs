import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth";
import { fetchHistoricalWalletData, selectSeries, setPeriod } from "@/libs/redux/Slices/WalletWorthChartSlice";
import { useAppSelector } from "@/libs/redux/Store";
import { Grid, Stack, Typography, useTheme, Button, Box } from "@mui/material";
import {
  LookUpOption,
  StyledAddWalletButton,
  Wallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  fetchWalletsPortfolio,
  selectWallets,
  updateWallet,
  getCurrentTokensValueFromZapper,
  fetchReactourSettingsAsync,
  Require2FA,
} from "components";
import { useLifiChainMap } from "@/common/lifiChainContext";
import moment from "moment";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../../components/AnimatedStartTourButton";
import { useAppDispatch } from "@/libs/redux/Store";
import { setAccordionState, updateTourStatusAsync } from "components";
import { MyWalletsSectionForPage } from "../../../../../components/src/features/myWallets/MyWalletsSectionForPage";
import { ChartSeries } from "@/libs/redux/Slices/ChartSlicesCommon";
import { WalletsOverviewPanel } from "@/features/MyWallets/WalletsOverviewPanel";
import { FeatureAccessGuard } from "components";
import { useSubscription } from "components";

const TOUR_ID = "decentralized_v1";
const TOUR_NAME = "decentralized";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();

  const openAllAccordions = () => {
    const accordionKeys = ['WalletsOverviewPanel', 'MyWalletsSectionForPage'];
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

const TourStateSync = ({ totalSteps }: { totalSteps: number }) => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  const [tourWasOpened, setTourWasOpened] = useState(false);
  const reactourSettings = useAppSelector((state) => state.reactour.settings);

  const openAllAccordions = () => {
    const accordionKeys = ['WalletsOverviewPanel', 'MyWalletsSectionForPage'];
    accordionKeys.forEach(key => {
      dispatch(setAccordionState({ key, open: true }));
    });
  };

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
      openAllAccordions();
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

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, statusFetchingPortfolio, totalWalletsWorthData, selectedWallets, portfolioWalletData } = useAppSelector(
    state => state.wallets,
  );
  const { chartData, chartSeries, maxChartValue, minChartValue, period, yAxisTicks, statstatusFetchingHistoricalData } =
    useAppSelector(state => state.walletWorthChart);


  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(moment().subtract(30, "day").toDate());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [isDatesValid, setIsDatesValid] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [valueChartSeries, setValueChartSeries] = useState<ChartSeries[]>([]);
  const theme = useTheme();
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false);
  const { t } = useTranslation("MyWalletsPage");
  const { canConnectWallet, isFreePlan, getWalletConnectionLimit, isLoading: isSubscriptionLoading } = useSubscription();

  const fetchHistoricalData = useCallback(() => {
    if (isDatesValid && fromDate && toDate) {
      dispatch(
        fetchHistoricalWalletData({
          tokenId: symbolOption?.id,
          compareLabel: symbolOption?.label,
          startDate: fromDate,
          endDate: toDate,
        }),
      );
    }
  }, [isDatesValid, fromDate, toDate, symbolOption?.id, symbolOption?.label, dispatch]);

  const { lifiChainMap } = useLifiChainMap();

  useEffect(() => {
    if (wallets && wallets.length > 0 && lifiChainMap && statusFetchingPortfolio !== 'loading') {
      const addresses = wallets.map(w => w.address);
      const currentAddresses = portfolioWalletData.map(w => w.walletAddress);
      const addressesChanged = addresses.some(addr => !currentAddresses.includes(addr));
      if (addressesChanged || portfolioWalletData.length === 0) {
        dispatch(fetchWalletsPortfolio({ addresses, lifiChainMap }));
      }
    }
  }, [wallets, dispatch, portfolioWalletData, lifiChainMap, statusFetchingPortfolio]);

  useEffect(() => {
    if (chartData?.seriesData) {
      const valueSeries: ChartSeries = {
        name: "Value",
        data: chartData.seriesData.map(point => ({
          x: point.historyDate,
          y: point.walletValue,
        })),
      };

      setValueChartSeries([valueSeries]);
    } else {
      setValueChartSeries([]);
    }
  }, [chartData]);

  const growthZeroSeries = useMemo<ChartSeries[]>(() => {
    if (chartData?.seriesData) {
      return [{
        name: "Growth",
        data: chartData.seriesData.map(point => ({ x: point.historyDate, y: 0 })),
      }];
    }
    return [];
  }, [chartData]);

  // Ensure Value chart shows zero when no wallets are selected
  useEffect(() => {
    if (selectedWallets.length === 0) {
      if (chartData?.seriesData) {
        const zeroSeries: ChartSeries = {
          name: "Value",
          data: chartData.seriesData.map(point => ({ x: point.historyDate, y: 0 })),
        };
        setValueChartSeries([zeroSeries]);
      } else {
        setValueChartSeries([{ name: "Value", data: [] }]);
      }
    }
  }, [selectedWallets, chartData]);

  const calculateTotalUsdAmount = (selectedWallets: Wallet[]): number => {
    let totalUsdAmount = 0;

    try {
      selectedWallets.forEach(wallet => {
        const portfolioWallet = portfolioWalletData.find(p => p.walletAddress === wallet.address);
        if (portfolioWallet) {
          totalUsdAmount += portfolioWallet.totalValueUSD;
        }
      });
    } catch (error) {
      console.error('Error calculating total USD amount:', error);
    }

    return totalUsdAmount;
  };

  useEffect(() => {
    if (selectedWallets.length) {
      const selectedAddresses = selectedWallets.map(w => w.address);
      const availableAddresses = portfolioWalletData.map(w => w.walletAddress);
      const allSelectedWalletsHaveData = selectedAddresses.every(addr => availableAddresses.includes(addr));
      if (allSelectedWalletsHaveData) {
        fetchHistoricalData();
      }
    } else {
      setTotalAmount(0);
    }
  }, [selectedWallets, fetchHistoricalData, portfolioWalletData]);

  useEffect(() => {
    if (selectedWallets.length) {
      setTotalAmount(calculateTotalUsdAmount(selectedWallets));
    } else {
      setTotalAmount(0);
    }
  }, [selectedWallets, portfolioWalletData]);

  useEffect(() => {
    if (wallets === null) {
      dispatch(fetchWallets(null));
    }
  }, [dispatch, wallets]);

  useEffect(() => {
    if (isSubscriptionLoading || !wallets || !selectedWallets.length) return;

    if (isFreePlan) {
      dispatch(selectWallets([]));
      return;
    }

    const limit = getWalletConnectionLimit("DEX");
    if (limit <= 0) return;

    const accessibleAddresses = new Set(wallets.slice(0, limit).map(w => w.address));
    const validSelection = selectedWallets.filter(w => accessibleAddresses.has(w.address));

    if (validSelection.length !== selectedWallets.length) {
      dispatch(selectWallets(validSelection));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFreePlan, isSubscriptionLoading, wallets]);

  const onChartRefresh = () => {
    if (selectedWallets.length > 0) {
      const allAddresses = wallets?.map(w => w.address) || [];
      if (lifiChainMap) {
        dispatch(fetchWalletsPortfolio({ addresses: allAddresses, lifiChainMap })).then(() => {
          fetchHistoricalData();
        });
      }
    } else {
      fetchHistoricalData();
    }
  };

  useEffect(() => {
    if (selectedWallets.length > 0 && portfolioWalletData.length > 0) {
      const selectedAddresses = selectedWallets.map(w => w.address);
      const availableAddresses = portfolioWalletData.map(w => w.walletAddress);
      const allSelectedWalletsHaveData = selectedAddresses.every(addr => availableAddresses.includes(addr));

      if (allSelectedWalletsHaveData) {
        dispatch(fetchTotalWalletsWorthData({}));
      }
    }
  }, [dispatch, selectedWallets, portfolioWalletData]);

  const onRowsChanged = (rows: Wallet[]) => {
    dispatch(selectWallets(rows));
  };

  const onUpdateWallet = (wallet: Wallet) => {
    dispatch(updateWallet(wallet));
  };

  const steps: StepType[] = [
    {
      selector: "#wallet_header",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourWalletSectionTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourWalletSectionText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#wallet_link_info",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourWalletLinkRequirementTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourWalletLinkRequirementText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#wallet_selector",
      content: () => (
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourWalletMultipleText")}</Typography>
      ),
      position: "right"
    },
    {
      selector: "#wallet_chart",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourWalletChartTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourWalletChartText")}</Typography>
        </Box>
      ),
      position: "top"
    }
  ];

  return (
    <Require2FA>
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
          close: (base) => ({
            ...base,
            width: 14,
            height: 14,
            padding: '10px',
            boxSizing: 'content-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: 10,
            right: 8,
            cursor: 'pointer',
          }),
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
          <Stack>
            <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
              <Typography
                id="wallet_header"
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}>
                {t("WalletsWeb3")}
              </Typography>
              <StartTourButton />
            </Box>

            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
                <Stack spacing={2} sx={{ minWidth: 0 }}>
                  <FeatureAccessGuard
                    feature="walletConnectionDEX"
                    currentCount={wallets?.length || 0}
                  >
                    <StyledAddWalletButton
                      id="wallet_link_info"
                      variant="contained"
                      sx={{
                        width: "max-content",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        [theme.breakpoints.between('md', 'lg')]: {
                          fontSize: "0.8125rem",
                          paddingLeft: 12,
                          paddingRight: 12,
                          paddingTop: 6,
                          paddingBottom: 6,
                        },
                      }}
                      onClick={() => setAddWalletModalOpen(true)}
                    >
                      {t("AddWalletWeb3", { ns: "MyWalletsSection" })}
                    </StyledAddWalletButton>
                  </FeatureAccessGuard>

                  <WalletsOverviewPanel />
                </Stack>
              </Grid>

              <Grid item xs={12} md={9}>
                <Grid
                  id="wallet_chart"
                  item
                  sx={{
                    minHeight: "500px",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "#f7f5f2",
                    padding: 2,
                    paddingTop: "20px"
                  }}
                >
                  <Typography sx={{ fontWeight: "500" }}>
                    {t("HistoricalWalletsWorth")}
                  </Typography>
                  <HistoricalWalletsWorth
                    sx={{ mt: 4 }}
                    onFetchPage={fetchLookupPage}
                    chartDataLoading={statstatusFetchingHistoricalData === "loading"}
                    chartLoading={statusFetchingPortfolio === "loading"}
                    lookupOption={symbolOption}
                    chartAxisTicks={yAxisTicks}
                    chartSeries={selectedWallets.length === 0 ? growthZeroSeries : chartSeries}
                    valueSeries={valueChartSeries}
                    fromDate={fromDate}
                    toDate={toDate}
                    onDatesValidChanged={setIsDatesValid}
                    lookupLoading={false}
                    maxChartValue={selectedWallets.length === 0 ? 10 : maxChartValue}
                    minChartValue={selectedWallets.length === 0 ? 0 : minChartValue}
                    onChartSubmit={onChartRefresh}
                    onFromDateChange={date => setFromDate(date)}
                    onToDateChange={date => setToDate(date)}
                    onOptionChange={option => setSymbolOption(option)}
                    onPeriodChange={period => dispatch(setPeriod({ period: period }))}
                    period={period}
                    onToggleSeries={seriesIndex => dispatch(selectSeries({ seriesIndex }))}
                    submitButtonDisabled={!fromDate || !selectedWallets.length}
                    title={""}
                  />
                </Grid>
              </Grid>
            </Grid>

            <MyWalletsSectionForPage
              id="wallet_selector"
              onUpdateWallet={onUpdateWallet}
              selectedWalletsIds={selectedWallets.map(wallet => wallet.address)}
              totalWalletsWorthData={totalWalletsWorthData}
              loading={statusFetchingWallets === "loading"}
              wallets={wallets}
              onSelectedRowsChanged={rows => onRowsChanged(rows)}
              onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
              totalAmount={totalAmount}
              addWalletModalOpen={addWalletModalOpen}
              setAddWalletModalOpen={setAddWalletModalOpen}
            />
          </Stack>
        </>
      </TourProvider>
    </Require2FA>
  );
}
