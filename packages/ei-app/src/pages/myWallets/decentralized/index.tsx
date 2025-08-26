import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth";
import { fetchHistoricalWalletData, selectSeries, setPeriod } from "@/libs/redux/Slices/WalletWorthChartSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import {
  LookUpOption,
  StyledAddWalletButton,
  Wallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  fetchWalletsPortfolio,
  selectWallets,
  toTableTokensModel,
  updateWallet,
} from "components";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MyWalletsSectionForPage } from "../../../../../components/src/features/myWallets/MyWalletsSectionForPage";
import { ChartSeries } from "@/libs/redux/Slices/ChartSlicesCommon";
import { WalletsOverviewPanel } from "@/features/MyWallets/WalletsOverviewPanel";


export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets } = useAppSelector(
    state => state.wallets,
  );
  const { chartData, chartSeries, maxChartValue, minChartValue, period, yAxisTicks, statstatusFetchingHistoricalData } =
    useAppSelector(state => state.walletWorthChart);
  

  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(moment().subtract(30, "day").toDate());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [isDatesValid, setIsDatesValid] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [totalAmount,setTotalAmount] = useState<number>(0);
  const [valueChartSeries, setValueChartSeries] = useState<ChartSeries[]>([]);
  const theme = useTheme();
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false);
  const { t } = useTranslation("MyWalletsPage");

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

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const addresses = wallets.map(w => w.address);
      dispatch(fetchWalletsPortfolio(addresses));
    }
  }, [wallets, dispatch]);

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

  const calculateTotalUsdAmount = (selectedWallets: Wallet[]): number => {
    let totalUsdAmount = 0;

    try {
      selectedWallets.forEach(wallet => {
        if (wallet.chainAssets) {
          wallet.chainAssets.forEach(chainAsset => {
            const tableAssets = toTableTokensModel(chainAsset);

            tableAssets.forEach(asset => {
              if (asset.usdAmount) {
                totalUsdAmount += asset.usdAmount;
              }
            });
          });
        }
      });
    } catch (error) {
      console.error('Error calculating total USD amount:', error);
    }

    return totalUsdAmount;
  };

  useEffect(() => {
    if (selectedWallets.length) {
      const addresses = selectedWallets.map(w => w.address);
      dispatch(fetchWalletsPortfolio(addresses)).then(() => {
        fetchHistoricalData();
      });
      setTotalAmount(calculateTotalUsdAmount(selectedWallets));
    } else {
      setTotalAmount(0);
    }
  }, [selectedWallets, dispatch, fetchHistoricalData]);

  useEffect(() => {
    if (wallets === null) {
      dispatch(fetchWallets(null));
    }
  }, [dispatch, wallets]);

  const onChartRefresh = () => {
    if (selectedWallets.length > 0) {
      const addresses = selectedWallets.map(w => w.address);
      dispatch(fetchWalletsPortfolio(addresses)).then(() => {
        fetchHistoricalData();
      });
    } else {
      fetchHistoricalData();
    }
  };

  useEffect(() => {
    dispatch(fetchTotalWalletsWorthData({}));
  }, [dispatch, selectedWallets]);

  const onRowsChanged = (rows: Wallet[]) => {
    dispatch(selectWallets(rows));
  };

  const onUpdateWallet = (wallet: Wallet) => {
    dispatch(updateWallet(wallet));
  };

  return (
    <Stack>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 5 }}>
        {t("WalletsWeb3")}
      </Typography>

     <Grid container spacing={4} alignItems="flex-start">
      <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <StyledAddWalletButton
            variant="contained"
            sx={{
              width: "max-content",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              [theme.breakpoints.between('md','lg')]: {
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

          <WalletsOverviewPanel />
        </Stack>
      </Grid>

      <Grid item xs={12} md={9}>
        <Grid
          item
          sx={{
            minHeight: "500px",
            borderRadius: "10px",
            boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
            backgroundColor:
              theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
            padding: 2,
            paddingTop:"20px"
          }}
        >
          <Typography sx={{fontWeight:"500"}}>
            {t("HistoricalWalletsWorth")}
          </Typography>
          <HistoricalWalletsWorth
            sx={{ mt: 4 }}
            onFetchPage={fetchLookupPage}
            chartDataLoading={statstatusFetchingHistoricalData === "loading"}
            lookupOption={symbolOption}
            chartAxisTicks={yAxisTicks}
            chartSeries={chartSeries}
            valueSeries={valueChartSeries}
            fromDate={fromDate}
            toDate={toDate}
            onDatesValidChanged={setIsDatesValid}
            lookupLoading={false}
            maxChartValue={maxChartValue}
            minChartValue={minChartValue}
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
        onUpdateWallet={onUpdateWallet}
        selectedWalletsIds={selectedWallets.map(wallet => wallet.address)}
        totalWalletsWorthData={totalWalletsWorthData}
        loading={statusFetchingWallets === "loading"}
        wallets={wallets}
        onSelectedRowsChanged={rows => onRowsChanged(rows)}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
        totalAmount = {totalAmount}
        addWalletModalOpen={addWalletModalOpen}
        setAddWalletModalOpen={setAddWalletModalOpen} 
      />
    </Stack>
  );
}
