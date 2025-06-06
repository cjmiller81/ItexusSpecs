import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { useGetCalendarEventsQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import CryptoCalendar from "@/features/Dashboard/CryptoCalendar/CryptoCalendar";
import { CryptoNewsTile } from "@/features/Dashboard/CryptoNewsTile/CryptoNewsTile";
import { useNews } from "@/features/Dashboard/CryptoNewsTile/useNews";
import { IncomeTile } from "@/features/Dashboard/Incomes/IncomeTile";
import { TopTokenData, TopTokensTile } from "@/features/Dashboard/TopTokensTile";
import { TradingViewTile } from "@/features/Dashboard/TradingViewTile";
import { WalletWorthTile } from "@/features/Dashboard/WalletWorthTile";
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
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { fetchWallets, useOry } from "components";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { session } = useOry();
  const firstName = session?.identity?.traits.name.first;
  const { t } = useTranslation("HomePage");
  const wallets = useAppSelector(state => state.wallets.wallets);
  const statusFetchingWallets = useAppSelector(state => state.wallets.statusFetchingWallets);
  const statusTotalWalletWorthChartData = useAppSelector(state => state.dashboard.statusTotalWalletWorthChartData);
  const totalWalletWorthChartData = useAppSelector(state => state.dashboard.totalWalletWorthChartData);
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<[Date, Date]>([
    moment().startOf("day").toDate(),
    moment().endOf("day").toDate(),
  ]);

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
    if (!wallets?.length) return;

    dispatch(fetchHistoricalWalletData());
  }, [wallets,dispatch]);

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

  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold" }}>
        {t("Welcome", { userName: firstName })}
      </Typography>

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
            title={t("WalletsWorthTile")}
            icon={<AccountBalanceWalletIcon />}
            chartData={totalWalletWorthChartData}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          sx={{ marginBottom: "10px" }}>
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
          justifyContent="space-between">
          <Grid
            item
            xs={12}
            md={6}
            lg={4}>
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
            lg={6}>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: isMediumScreen ? "row" : "column",
                gap: 2,
              }}>
              <CryptoCalendar
                loading={false}
                title={t("CryptoCalendarTitle", { ns: "CryptoCalendar" })}
                icon={<CalendarMonthOutlinedIcon />}
                calendarData={calendarEvents?.body || []}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                sx={{ flex: isMediumScreen ? 4 : 1 }}
                onFetchPage={fetchLookupPage}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
