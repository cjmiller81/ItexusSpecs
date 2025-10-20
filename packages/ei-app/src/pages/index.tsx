import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { useGetCalendarEventsQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import NewCryptoCalendar from "@/features/Dashboard/CryptoCalendar/NewCryptoCalendar";
import CryptoCalendar from "@/features/Dashboard/CryptoCalendar/CryptoCalendar";
import { CryptoNewsTile } from "@/features/Dashboard/CryptoNewsTile/CryptoNewsTile";
import { useNews } from "@/features/Dashboard/CryptoNewsTile/useNews";
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
import { fetchWallets, fetchWalletsPortfolio, useOry, PasswordResetModal } from "components";
import { AnimatedStartTourButton } from "../components/AnimatedStartTourButton";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const TOUR_ID = "home_v1";

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
  const wallets = useAppSelector(state => state.wallets.wallets);
  const portfolioWalletData = useAppSelector(state => state.wallets.portfolioWalletData);
  const statusFetchingWallets = useAppSelector(state => state.wallets.statusFetchingWallets);
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

  const { data: poolsData, isLoading: isPoolsLoading } = useGetPoolsQuery();
  const isMediumScreen = useMediaQuery("(min-width:900px) and (max-width:1200px)");
  const { news, loadMore, isLoading, setMarket, market } = useNews();
  const [topTokens, setTopTokens] = useState<TopTokenData[] | null>(null);
  const [isFetchingTopTokens, setIsFetchingTopTokens] = useState<boolean>(false);
  const { data: calendarEvents } = useGetCalendarEventsQuery({
    page: 0,
    max: 150,
    fromDate: moment(selectedDate[0]).utc().toDate(),
    toDate: moment(selectedDate[1]).utc().toDate(),
  })
  const newsRef = useRef(news);
  const retryNewsRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  newsRef.current = news;
}, [news]);

useEffect(() => {
  const retryNewsFetch = () => {
    const currentNews = newsRef.current;
    const isNewsEmpty = !currentNews || currentNews.length === 0;

    if (isNewsEmpty && !isLoading) {
      loadMore();
    }
  };

  retryNewsFetch();

  retryNewsRef.current = setInterval(() => {
    retryNewsFetch();
  }, 3000)

  return () => {
    if (retryNewsRef.current) clearInterval(retryNewsRef.current);
  };
}, [loadMore, isLoading]);

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null));
  }, [wallets,dispatch]);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const addresses = wallets.map(w => w.address);
         dispatch(fetchWalletsPortfolio(addresses));
    }
  }, [wallets, dispatch]);

  useEffect(() => {
    if (!wallets || wallets.length === 0) return;
    if (!portfolioWalletData || portfolioWalletData.length === 0) return;

    dispatch(fetchHistoricalWalletData());
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
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("WelcomeToElanInsights")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("CryptoDataMiningAnalyticsDecisionModeling")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#ei-profile-button",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("ProfileSettings")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("ClickHereToAccessYourProfile")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#ei-news-filter",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("FilterNewsAndCalendarEvents")}</Typography>
      ),
      position: "right"
    },
    {
      selector: "#ei-platform-menu",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("PlatformStrategies")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("PlatformsContainStrategies")}</Typography>
        </Box>
      ),
      position: "right"
    },
    {
      selector: "#ei-tools-section",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("AdvancedTools")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("ToolsEnableCustomizedAnalysis")}</Typography>
        </Box>
      ),
      position: "left"
    },
    {
      selector: "#ei-investing-card",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("SnapshotOfTheInvestingStrategy")}</Typography>
      ),
      position: "top"
    },
    {
      selector: "#ei-income-card",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("SnapshotOfTheIncomeStrategy")}</Typography>
      ),
      position: "top"
    },
    {
      selector: "#ei-theme-toggle",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("ChangeBetweenLightAndDarkModes")}</Typography>
      ),
      position: "left"
    },
    {
      selector: "#homepage",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("ThankYouTitle")}</Typography>
          <Typography sx={{ color: "#4a5568", whiteSpace: "pre-line" }}>{t("ThankYouText")}</Typography>
        </Box>
      ),
      position: "top"
    }
  ];

  const viewed = typeof window !== "undefined" ? localStorage.getItem(`EI_TOUR_${TOUR_ID}_VIEWED`) === "1" : true;

  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ ...base, borderRadius: 12, padding: 16, background: "#f7f5f2", color: "#1a1a1a" }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        badge: (base) => ({ ...base, display: "none" }),
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
        sx={{ marginTop: 0 }}>
        <Grid
          item
          xs={12}
          md={6}
          lg={5}>
          <WalletWorthTile
            loading={statusFetchingWallets === "loading" || statusTotalWalletWorthChartData === "loading"}
            icon={<AccountBalanceWalletIcon />}
            chartDataGrowth={totalWalletWorthChartData}
            chartDataValue={totalWalletWorthValueChartData}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          sx={{ marginBottom: "10px" }}
          id="ei-investing-card">
          <TopTokensTile
            loading={isFetchingTopTokens}
            title={t("TopTokensTile")}
            icon={<AutoGraphIcon />}
            tableAssets={topTokens}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={2}>
          <CryptoNewsTile
            onNewsSourceChange={setMarket}
            news={news}
            newsSource={market}
            onLoadMoreNews={loadMore}
            isLoading={isLoading}
            title={t("CryptoNewsTile")}
            icon={<NewspaperIcon />}
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
            lg={2}>
            <CryptoCalendar
              loading={false}
              title={t("CryptoCalendarTitle", { ns: "CryptoCalendar" })}
              icon={<CalendarMonthOutlinedIcon sx={{ color: "primary.main" }} />}
              calendarData={calendarEvents?.body || []}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              onFetchPage={fetchLookupPage}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}>
            <CryptoNewsAPIFeed />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}>
            <NewCryptoCalendar
              loading={false}
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
  const viewed = typeof window !== "undefined" ? localStorage.getItem(`EI_TOUR_${TOUR_ID}_VIEWED`) === "1" : true;
  const [tourWasOpened, setTourWasOpened] = useState(false);


  useEffect(() => {
    try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_STEP`, String(currentStep)); } catch { /* noop */ }
    if (currentStep >= totalSteps - 1) {
      try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_VIEWED`, "1"); } catch { /* noop */ }
    }
  }, [currentStep, totalSteps]);

  useEffect(() => {
    if (!isOpen && tourWasOpened) {
      try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_VIEWED`, "1"); } catch { /* noop */ }
    } else if (isOpen) {
      setTourWasOpened(true);
    }
  }, [isOpen, currentStep, tourWasOpened]);

  useEffect(() => {
    const recoveryCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('postRecoveryRedirect='));

    if (recoveryCookie) {
      try {
        localStorage.removeItem(`EI_TOUR_${TOUR_ID}_VIEWED`);
        localStorage.removeItem(`EI_TOUR_${TOUR_ID}_STEP`);
      } catch { /* noop */ }
    }
  }, []);


  useEffect(() => {
    if (currentStep === 0 && !isOpen) {
      // Don't mark as viewed on initial load
    }
  }, []);

  useEffect(() => {
    const savedStep = Number(localStorage.getItem(`EI_TOUR_${TOUR_ID}_STEP`) || 0);
    const hasOpenModals = showPasswordResetModal || showWelcomeModal;

    if (hasOpenModals) {
      return;
    }

    if (!viewed && !isOpen) {
      const timer = setTimeout(() => {
        const stillNoModals = !showPasswordResetModal && !showWelcomeModal;
        const stillNotViewed = localStorage.getItem(`EI_TOUR_${TOUR_ID}_VIEWED`) !== "1";

        if (stillNoModals && stillNotViewed && !isOpen) {
          if (!isNaN(savedStep)) setCurrentStep(savedStep);
          setIsOpen(true);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [showPasswordResetModal, showWelcomeModal, viewed, isOpen, setCurrentStep, setIsOpen]);

  return null;
};
