import fetchLookupPage from "@/features/Common/fetchLookupPage";
import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth";
import { fetchHistoricalWalletData, selectSeries, setPeriod } from "@/libs/redux/Slices/WalletWorthChartSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Stack } from "@mui/material";
import {
  LookUpOption,
  Wallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  fetchWalletsPortfolio,
  selectWallets,
  updateWallet,
} from "components";
import { useLifiChainMap } from "@/common/lifiChainContext";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MyWalletsSectionForPage } from "../../../../components/src/features/myWallets/MyWalletsSectionForPage";

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, portfolioWalletData } = useAppSelector(
    state => state.wallets,
  );
  const { chartSeries, maxChartValue, minChartValue, period, yAxisTicks, statstatusFetchingHistoricalData } =
    useAppSelector(state => state.walletWorthChart);
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(moment().subtract(30, "day").toDate());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [isDatesValid, setIsDatesValid] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [totalAmount,setTotalAmount] = useState<number>(0);
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false);

  const { t } = useTranslation("MyWalletsPage");

  const fetchHistoricalData = () => {
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
  };

  const calculateTotalUsdAmount = (selectedWallets: Wallet[]): number => {
    let totalUsdAmount = 0;

    selectedWallets.forEach(wallet => {
      const portfolioWallet = portfolioWalletData.find(p => p.walletAddress === wallet.address);
      if (portfolioWallet) {
        totalUsdAmount += portfolioWallet.totalValueUSD;
      }
    });

    return totalUsdAmount;
  };

  useEffect(() => {
    if (selectedWallets.length) {
      fetchHistoricalData();
      setTotalAmount(calculateTotalUsdAmount(selectedWallets));
    } else {
      setTotalAmount(0);
    }
  }, [selectedWallets, portfolioWalletData]);

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null));
  }, [dispatch, wallets]);

  const { lifiChainMap } = useLifiChainMap();

  useEffect(() => {
    if (wallets && wallets.length > 0 && lifiChainMap) {
      const addresses = wallets.map(w => w.address);
      dispatch(fetchWalletsPortfolio({ addresses, lifiChainMap }));
    }
  }, [wallets, dispatch, lifiChainMap]);

  const onChartRefresh = () => {
    fetchHistoricalData();
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

      <HistoricalWalletsWorth
        sx={{ mt: 4 }}
        onFetchPage={fetchLookupPage}
        chartDataLoading={statstatusFetchingHistoricalData === "loading"}
        lookupOption={symbolOption}
        chartAxisTicks={yAxisTicks}
        chartSeries={chartSeries}
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
        onToggleSeries={seriesIndex => dispatch(selectSeries({ seriesIndex: seriesIndex }))}
        submitButtonDisabled={!fromDate || !selectedWallets.length}
        title={t("HistoricalWalletsWorth")}
      />
    </Stack>
  );
}
