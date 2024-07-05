import CryptoCalendar from "@/features/CryptoCalendar/CryptoCalendat";
import { CryptoNewsTile } from "@/features/Dashboard/CryptoNewsTile";
import { IncomeTile } from "@/features/Dashboard/IncomeTile";
import { TopTokenData, TopTokensTile } from "@/features/Dashboard/TopTokensTile";
import { TradingViewTile } from "@/features/Dashboard/TradingViewTile";
import { UpdatesTile } from "@/features/Dashboard/UpdatesTile";
import { WalletWorthTile } from "@/features/Dashboard/WalletWorthTile";
import { useMockGetCalendarEventsByDate } from "@/libs/redux/Apis/CryptoCalendarApi";
import { useMockGetAllNews } from "@/libs/redux/Apis/NewsApi";
import { fetchCoins } from "@/libs/redux/Slices/AllTokensTableSlice";
import { fetchHistoricalWalletData } from "@/libs/redux/Slices/DashboardSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CodeIcon from "@mui/icons-material/Code";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Grid, Stack, Typography } from "@mui/material";
import { fetchWallets, useOry } from "components";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { session } = useOry();
  const firstName = session?.identity?.traits.name.first;
  const { t } = useTranslation("HomePage");
  const wallets = useAppSelector(state => state.wallets.wallets);
  const firstLoad = useAppSelector(state => state.wallets.firstLoad);
  const statusFetchingWallets = useAppSelector(state => state.wallets.statusFetchingWallets);
  const statusTotalWalletWorthChartData = useAppSelector(state => state.dashboard.statusTotalWalletWorthChartData);
  const totalWalletWorthChartData = useAppSelector(state => state.dashboard.totalWalletWorthChartData);
  const allCoins = useAppSelector(state => state.allTokensTable.allTokens);
  const fetchingTokensStatus = useAppSelector(state => state.allTokensTable.fetchingTokensStatus);
  const dispatch = useAppDispatch();
  // const { data: calendarEvents, isLoading: isLoadingCalendarEvents } = useGetCalendarEventsByDateQuery({
  //   date: moment(new Date()).format("YYYY-MM-DD"),
  // })
  const { data: cryptoCalendarData, isLoading: cryptoCalendarIsLoading } = useMockGetCalendarEventsByDate();
  //const { data, isLoading } = useGetAllNewsQuery()
  const { data, isLoading } = useMockGetAllNews();
  useEffect(() => {
    dispatch(fetchCoins({}));
  }, []);

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null));
  }, [firstLoad]);

  useEffect(() => {
    if (!wallets.length) return;

    dispatch(fetchHistoricalWalletData());
  }, [wallets]);

  const coinsMemorized = useMemo(() => {
    const newTableData = allCoins.slice(0, 10);
    const calculatedData = newTableData.map<TopTokenData>(data => {
      return {
        tokenId: data.id,
        iconUrl: data.lURI,
        id: data.id,
        marketCap: data.mCap,
        symbol: data.sym,
        price: data.price,
        fulDilVal: data.fulDilVal,
      };
    });

    return calculatedData;
  }, [allCoins]);

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
        container>
        <Grid
          xs={4.5}
          item>
          <WalletWorthTile
            loading={statusFetchingWallets === "loading" || statusTotalWalletWorthChartData === "loading"}
            title={t("WalletsWorthTile")}
            icon={<AccountBalanceWalletIcon />}
            chartData={totalWalletWorthChartData}></WalletWorthTile>
        </Grid>
        <Grid
          xs={4.5}
          item>
          <TopTokensTile
            loading={fetchingTokensStatus === "loading"}
            title={t("TopTokensTile")}
            icon={<AutoGraphIcon />}
            tableAssets={coinsMemorized}></TopTokensTile>
        </Grid>
        <Grid
          xs={3}
          item>
          <CryptoNewsTile
            loading={isLoading}
            title={t("CryptoNewsTile")}
            icon={<NewspaperIcon />}
            news={data?.items?.length ? data.items.slice(0, 30) : []}></CryptoNewsTile>
        </Grid>

        <Grid
          item
          xs={3}>
          <IncomeTile
            icon={<CurrencyExchangeIcon />}
            title={t("IncomeTile")}></IncomeTile>
        </Grid>

        <Grid
          item
          xs={6}>
          <TradingViewTile
            icon={<SyncAltIcon />}
            title={t("TradingTile")}></TradingViewTile>
        </Grid>

        <Grid
          xs={3}
          item>
          <Stack spacing={2}>
            <CryptoCalendar
              loading={cryptoCalendarIsLoading}
              title={t("CryptoCalendarTitle", { ns: "CryptoCalendar" })}
              icon={<CalendarMonthOutlinedIcon />}
              calendarData={cryptoCalendarData.body || []}
            />
            <UpdatesTile
              icon={<CodeIcon />}
              title={t("UpdatesTile")}
              version={process.env.APP_VERSION as string}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
