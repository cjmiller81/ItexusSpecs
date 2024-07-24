import CurrencyDropdown from "@/features/trading/rfq/CurrencyDropdown";
import { TileSection } from "@/features/trading/rfq/TileSection";
import HistoryDataTable from "@/features/trading/rfq/history-data-table/HistoryDataTable";
import { fetchPairs } from "@/features/trading/rfq/slices/currenciesSlice";
import { fetchExecutionHistoryData } from "@/features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import BalanceWidgetSection from "features/balance-widget/BalanceWidgetSection";

export const accountNumber = "EC_TEST";

export default function SpotRFQPage() {
  const [symbol1, setSymbol1] = useState<string | null>(null);
  const [symbol2, setSymbol2] = useState<string | null>(null);
  const [toDate, setToDate] = useState<Date | null>(moment().add(1, "d").toDate());
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate());
  const historyData = useAppSelector(state => state.rfq.executionHistoryData);
  const { pairs } = useAppSelector(state => state.currencies);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    getHistoryData();
    dispatch(fetchPairs({}));
  }, []);

  const getHistoryData = async () => {
    if (fromDate && toDate) handleHistoryRequest(fromDate, toDate);
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
        container
        spacing={3}
        justifyContent="center">
        <Grid
          item
          xs={12}
          md={5}
          container
          justifyContent="center">
          <Stack sx={{ width: "100%", minWidth: "500px", mt: 3, ml: 30 }}>
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
              onUpdateHistory={getHistoryData}
              mt={2}
            />
          </Stack>
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
          container
          alignItems="center"
          justifyContent="center">
          <BalanceWidgetSection
            sx={{
              top: 0,
              "@media (min-width: 1022px)": {
                position: "absolute",
                right: "-70px",
              },
              "@media (max-width: 1022px)": {
                position: "relative",
                right: "0",
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid
        item
        xs={5}
        container
        justifyContent="center">
        <HistoryDataTable
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
