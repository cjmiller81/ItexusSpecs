import HistoryDataTable from "@/features/tables/history-data-table/HistoryDataTable";
import { fetchHistoryData } from "@/features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export const accountNumber = "EC_TEST";

const TradeHistory: React.FC = () => {
  const rows = useAppSelector(state => state.rfq.historyData);
  const { t } = useTranslation("TradeHistory");
  const [toDate, setToDate] = useState<Date | null>(moment().add(1, "d").toDate());
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate());
  const dispatch = useAppDispatch();
  const isPad = useMediaQuery("(max-width: 850px)");

  useEffect(() => {
    if (fromDate && toDate)
      dispatch(
        fetchHistoryData({
          accountNumber: accountNumber,
          fromDate,
          toDate,
        }),
      );
  }, [fromDate, toDate]);

  const onUpdateHistory = async () => {
    const newToDate = moment().add(1, "d").toDate();
    const newFromDate = moment().add(-1, "M").toDate();
    setToDate(newToDate);
    setFromDate(newFromDate);
    handleHistoryRequest(newFromDate, newToDate);
  };

  const handleHistoryRequest = (fromDate: Date, toDate: Date) => {
    dispatch(fetchHistoryData({ accountNumber: accountNumber, fromDate, toDate }));
  };

  const getHistoryData = async () => {
    if (fromDate && toDate) handleHistoryRequest(fromDate, toDate);
  };

  return (
    <>
      <Typography
        sx={{ mt: isPad ? "80px !important" : "16px !important" }}
        variant="h3">
        {t("TradeHistory")}
      </Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <Grid
          item
          xs={12}>
          <HistoryDataTable
            title={t("TradeHistory")}
            fileName={t("TradeHistoryCsvFileName")}
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            rows={rows}
            handleHistoryRequest={onUpdateHistory}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TradeHistory;
