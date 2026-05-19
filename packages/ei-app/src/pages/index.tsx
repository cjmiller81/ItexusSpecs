import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { useGetCalendarEventsQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import NewCryptoCalendar from "@/features/Dashboard/CryptoCalendar/NewCryptoCalendar";
import CryptoCalendar from "@/features/Dashboard/CryptoCalendar/CryptoCalendar";
import { CryptoNewsTile } from "@/features/Dashboard/CryptoNewsTile/CryptoNewsTile";
import { IncomeTile } from "@/features/Dashboard/Incomes/IncomeTile";
import { TopTokenData, TopTokensTile } from "@/features/Dashboard/TopTokensTile";
import { TradingViewTile } from "@/features/Dashboard/TradingViewTile";
import { WalletWorthTile } from "@/features/Dashboard/WalletWorthTile";
import { CryptoNewsAPIFeed } from "@/features/Dashboard/CryptoNewsAPIFeed";
import { useGetPoolsQuery } from "@/features/Income/DefiApi";
import { filteredTokensApi } from "@/features/Investing/filteredTokensApi";
import { fetchHistoricalWalletData } from "@/libs/redux/Slices/DashboardSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Box, Grid, Typography, useMediaQuery, Button } from "@mui/material";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import {
  fetchWallets,
  fetchWalletsPortfolio,
  useOry,
  PasswordResetModal,
  updateTourStatusAsync,
  fetchReactourSettingsAsync,
  Require2FA,
  useSubscription,
} from "components";
import { useLifiChainMap } from "@/common/lifiChainContext";
import { AnimatedStartTourButton } from "../components/AnimatedStartTourButton";
import moment from "moment";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const TOUR_ID = "home_v1";
const TOUR_NAME = "home";

const StartTourButton = () => {
  return (
    <AnimatedStartTourButton
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
    />
  );
};

const SurveyButton = () => {
  return (
    <Button
      variant="contained"
      size="small"
      sx={{
        ml: 2,
        textTransform: "none",
        backgroundColor: "#219a83",
        color: "white",
        "&:hover": {
          backgroundColor: "#219a83"
        }
      }}
      onClick={() => {
        // Open survey link in new tab: https://forms.gle/NhcLMGVZZyphnsK8A
        window.open("https://forms.gle/NhcLMGVZZyphnsK8A", "_blank");
      }}
    >
      Survey Link
    </Button>
  );
};

export default function HomePage() {
  const { session } = useOry();
  const traits = session?.identity?.traits
  const firstName = traits?.name?.first ?? "" ;
  const { t } = useTranslation("HomePage");
  const { isFreePlan, getWalletConnectionLimit } = useSubscription();
  const walletLimit = isFreePlan ? 0 : getWalletConnectionLimit("DEX");
  const allWallets = useAppSelector(state => state.wallets.wallets);
  const wallets = allWallets ? (walletLimit > 0 ? allWallets.slice(0, walletLimit) : []) : null;
  const portfolioWalletData = useAppSelector(state => state.wallets.portfolioWalletData);
  const statusFetchingWallets = useAppSelector(state => state.wallets.statusFetchingWallets);
  const statusFetchingPortfolio = useAppSelector(state => state.wallets.statusFetchingPortfolio);
  const statusTotalWalletWorthChartData = useAppSelector(state => state.dashboard.statusTotalWalletWorthChartData);
  const totalWalletWorthChartData = useAppSelector(state => state.dashboard.totalWalletWorthChartData);
  const totalWalletWorthValueChartData = useAppSelector(state => state.dashboard.totalWalletWorthValueChartData)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<[Date, Date]>([
    moment.utc().startOf("day").toDate(),
    moment.utc().add(7, "days").endOf("day").toDate(),
  ]);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const { data: poolsData, isLoading: isPoolsLoading } = useGetPoolsQuery({
    sorter: JSON.stringify([{ selector: "tvlUsd", desc: true }]),
    filter: "[]",
    skip: 0,
    take: 50,
  });
  const isMediumScreen = useMediaQuery("(min-width:900px) and (max-width:1200px)");
  const [topTokens, setTopTokens] = useState<TopTokenData[] | null>(null);
  const [isFetchingTopTokens, setIsFetchingTopTokens] = useState<boolean>(false);
  const { data: calendarEvents, isLoading: isCalendarLoading } = useGetCalendarEventsQuery({
    page: 0,
    max: 150,
    fromDate: moment(selectedDate[0]).utc().toDate(),
    toDate: moment(selectedDate[1]).utc().toDate(),
  })

  useEffect(() => {
    const recoveryCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('postRecoveryRedirect='));

    const requiresPasswordChange = router.query.requireChangePassword === 'true';

    if (recoveryCookie || requiresPasswordChange) {
      setShowPasswordResetModal(true);
    } else {
      setShowPasswordResetModal(false);
    }
  }, [router.query.requireChangePassword]);

  useEffect(() => {
    if (allWallets === null) dispatch(fetchWallets(null));
  }, [allWallets, dispatch]);

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
  }, [wallets, dispatch, lifiChainMap, statusFetchingPortfolio, portfolioWalletData]);

  useEffect(() => {
    if (!wallets || wallets.length === 0) return;
    if (!portfolioWalletData || portfolioWalletData.length === 0) return;

    dispatch(fetchHistoricalWalletData({ addresses: wallets.map(w => w.address) }));
  }, [wallets, portfolioWalletData, dispatch]);

const retryRef = useRef<ReturnType<typeof setInterval> | null>(null);
const topTokensRef = useRef<TopTokenData[] | null>(null);

useEffect(() => {
  const fetchTopTokens = () => {
    setIsFetchingTopTokens(true);
    filteredTokensApi
      .getTopTokens(10)
      .then(response => {
        const calculatedData = response.data.map<TopTokenData>(data => ({
          tokenId: data.id,
          iconUrl: data.lURI,
          id: data.id,
          marketCap: data.mCap,
          symbol: data.sym,
          price: data.price,
          fulDilVal: data.fulDilVal,
        }));
        setTopTokens(calculatedData);
        topTokensRef.current = calculatedData;
      })
      .catch(console.error)
      .finally(() => setIsFetchingTopTokens(false));
  };

  fetchTopTokens();

  retryRef.current = setInterval(() => {
    const tokens = topTokensRef.current;
    if (!tokens || tokens.length === 0) {
      fetchTopTokens();
    }
  }, 3000);

  return () => {
    if (retryRef.current) clearInterval(retryRef.current);
  };
}, []);

  const steps: StepType[] = [
    {
      selector: "#ei-logo",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("WelcomeToElanInsights")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{t("CryptoDataMiningAnalyticsDecisionModeling")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#ei-profile-button",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("ProfileSettings")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{t("ClickHereToAccessYourProfile")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#ei-crypto-news",
      content: () => (
         <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("CryptoNews")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{t("FilterNewsEvents")}</Typography>
        </Box>
      ),
      position: "right"
    },
    {
      selector: "#ei-crypto-calendar",
      content: () => (
         <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("CryptoCalendar")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{t("FilterCalendarEvents")}</Typography>
        </Box>
      ),
      position: "right"
    },
    {
      selector: "#ei-platform-menu",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("PlatformStrategies")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{t("PlatformsContainStrategies")}</Typography>
        </Box>
      ),
      position: "right"
    },
    {
      selector: "#ei-tools-section",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("AdvancedTools")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{t("ToolsEnableCustomizedAnalysis")}</Typography>
        </Box>
      ),
      position: "left"
    },
    {
      selector: "#ei-investing-card",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("InvestingStrategies")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{t("SnapshotOfTheInvestingStrategy")}</Typography>
        </Box>
      ),
      position: "top"
    },
    {
      selector: "#ei-income-card",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("IncomeStrategies")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{t("SnapshotOfTheIncomeStrategy")}</Typography>
        </Box>
      ),
      position: "top"
    },
    {
      selector: "#ei-theme-toggle",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>{t("LightDarkMode")}</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{t("ChangeBetweenLightAndDarkModes")}</Typography>
        </Box>
      ),
      position: "left"
    }
  ];

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
      <Box id="homepage">
        <TourStateSync
          totalSteps={steps.length}
          showPasswordResetModal={showPasswordResetModal}
          showWelcomeModal={showWelcomeModal}
        />
        <Box display="flex" alignItems="center">
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}>
            {t("Welcome", { userName: firstName })}
          </Typography>
          <StartTourButton />
          <SurveyButton />
        </Box>

      <Grid
        mt={2}
        spacing={2}
        container
        alignItems="stretch"
        sx={{ marginTop: 0 }}>
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          sx={{ display: 'flex' }}>
        <Require2FA>
          <WalletWorthTile
            loading={statusFetchingWallets === "loading" || statusTotalWalletWorthChartData === "loading"}
            chartLoading={statusFetchingPortfolio === "loading"}
            icon={<AccountBalanceWalletIcon />}
            chartDataGrowth={totalWalletWorthChartData}
            chartDataValue={totalWalletWorthValueChartData}
            sx={{ width: '100%' }}
          />
          </Require2FA>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          id="ei-investing-card"
          sx={{ display: 'flex' }}>
          <TopTokensTile
            loading={isFetchingTopTokens}
            title={t("TopTokensTile")}
            icon={<AutoGraphIcon />}
            tableAssets={topTokens}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={2}
          id="ei-crypto-news"
          sx={{ display: 'flex' }}>
          <CryptoNewsTile
            title={t("CryptoNewsTile")}
            icon={<NewspaperIcon />}
            sx={{ width: '100%' }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          container
          spacing={2}
          justifyContent="space-between"
          id="ei-platforms-section">
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            id="ei-income-card">
            <IncomeTile
              loading={isPoolsLoading}
              data={poolsData}
              icon={<CurrencyExchangeIcon />}
              title={t("IncomeTile")}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            id="ei-tools-section">
            <TradingViewTile
              icon={<SyncAltIcon />}
              title={t("TradingTile")}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={2}
            id="ei-crypto-calendar">
            <CryptoCalendar
              loading={isCalendarLoading}
              title={t("CryptoCalendarTitle", { ns: "CryptoCalendar" })}
              icon={<CalendarMonthOutlinedIcon sx={{ color: "primary.main" }} />}
              calendarData={calendarEvents?.body || []}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              onFetchPage={fetchLookupPage}
            />
          </Grid>
        </Grid>
      </Grid>
      </Box>
      <PasswordResetModal
        open={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        onSuccess={() => {
          setShowPasswordResetModal(false);
          document.cookie = 'postRecoveryRedirect=; path=/; max-age=0';
          if (router.query.requireChangePassword) {
            router.replace('/', undefined, { shallow: true });
          }
        }}
        onWelcomeModalOpen={(isOpen) => setShowWelcomeModal(isOpen)}
      />
    </TourProvider>
  );
}

const TourStateSync = ({
  totalSteps,
  showPasswordResetModal,
  showWelcomeModal
}: {
  totalSteps: number;
  showPasswordResetModal: boolean;
  showWelcomeModal: boolean;
}) => {
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
    const hasOpenModals = showPasswordResetModal || showWelcomeModal;

    if (!viewed && !isOpen && !tourWasOpened && !hasOpenModals) {
      const stepFromDb = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;
      if (!isNaN(stepFromDb)) setCurrentStep(stepFromDb);
      setIsOpen(true);
    }
  }, [reactourSettings, isOpen, tourWasOpened, showPasswordResetModal, showWelcomeModal, setCurrentStep, setIsOpen]);

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
