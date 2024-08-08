import BalanceWidgetSection from "@/features/balance-widget/BalanceWidgetSection";
import { TileSection } from "@/features/trading/rfq/TileSection";
import CurrencyDropdown from "@/features/trading/rfq/components/CurrencyDropdown";
import HistoryDataTable from "@/features/trading/rfq/history-data-table/HistoryDataTable";
import { fetchPairs } from "@/features/trading/rfq/slices/currenciesSlice";
import { fetchExecutionHistoryData } from "@/features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const accountNumber = "EC_TEST";

export default function SpotRFQPage() {
  const [symbol1, setSymbol1] = useState<string | null>(null);
  const [symbol2, setSymbol2] = useState<string | null>(null);
  const [toDate, setToDate] = useState<Date | null>(moment().add(1, "d").toDate());
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate());
  const historyData = useAppSelector(state => state.rfq.executionHistoryData);
  const { pairs } = useAppSelector(state => state.currencies);
  const dispatch = useAppDispatch();
  const isRelativeBalances = useMediaQuery("(max-width: 1070px)");
  const { t } = useTranslation("SpotRFQPage");

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    getHistoryData();
    dispatch(fetchPairs({}));
  }, []);

  useEffect(() => {
    if (fromDate && toDate)
      dispatch(
        fetchExecutionHistoryData({
          accountNumber: accountNumber,
          fromDate,
          toDate,
        }),
      );
  }, [fromDate, toDate]);

  const getHistoryData = async () => {
    if (fromDate && toDate) handleHistoryRequest(fromDate, toDate);
  };

  const onUpdateHistory = async () => {
    const newToDate = moment().add(1, "d").toDate();
    const newFromDate = moment().add(-1, "M").toDate();
    setToDate(newToDate);
    setFromDate(newFromDate);
    handleHistoryRequest(newFromDate, newToDate);
  };

  const handleHistoryRequest = (fromDate: Date, toDate: Date) => {
    dispatch(fetchExecutionHistoryData({ accountNumber: accountNumber, fromDate, toDate }));
  };

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      alignItems="center"
      direction="column">
      <Grid
        item
        xs={12}>
        <BalanceWidgetSection
          width={theme => (isRelativeBalances ? "100%" : theme.spacing(24))}
          direction={isRelativeBalances ? "row" : "column"}
          sx={{
            top: 0,
            position: "absolute",
            right: 0,
            ...(isRelativeBalances && {
              position: "relative",
            }),
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}>
        <Typography
          variant="h5"
          noWrap
          align="center">
          Request for Quote Portal
        </Typography>
        <Typography
          variant="body2"
          align="center">
          Click Initiate RFQ to instantly receive a quote
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        md={5}
        justifyContent="center">
        <Stack
          direction="row"
          gap={2}>
          <Stack>
            <CurrencyDropdown
              mt={1}
              symbol1={symbol1}
              symbol2={symbol2}
              pairs={pairs}
              onSymbol1Change={symbol => setSymbol1(symbol)}
              onSymbol2Change={symbol => setSymbol2(symbol)}
            />

            <TileSection
              symbol1={symbol1}
              symbol2={symbol2}
              accountNumber={accountNumber}
              onUpdateHistory={onUpdateHistory}
              sx={{ mt: 5, height: "300px" }}
            />
          </Stack>
        </Stack>
      </Grid>

      <Grid
        item
        xs={5}
        justifyContent="center">
        <HistoryDataTable
          title={t("RecentTransactions")}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          mt={5}
          rows={historyData}
          handleHistoryRequest={handleHistoryRequest}
        />
      </Grid>
    </Grid>
  );
}
