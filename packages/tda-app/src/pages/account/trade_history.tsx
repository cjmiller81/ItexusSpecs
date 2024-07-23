import { HistoryDataTable } from "@/features/trading/rfq/history-data-table/HistoryDataTable";
import { fetchHistoryData } from "@/features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const accountNumber = "EC_TEST";

const TradeHistory: React.FC = () => {
  const rows = useAppSelector(state => state.rfq.historyData);

  const [toDate, setToDate] = useState<Date | null>(moment().add(1, "d").toDate());
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate());
  const dispatch = useAppDispatch();

  useEffect(() => {
    getHistoryData();
  }, []);

  const handleHistoryRequest = (fromDate: Date, toDate: Date) => {
    dispatch(fetchHistoryData({ accountNumber: accountNumber, fromDate, toDate }));
  };

  const getHistoryData = async () => {
    if (fromDate && toDate) handleHistoryRequest(fromDate, toDate);
  };

  return (
    <HistoryDataTable
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      rows={rows}
      handleHistoryRequest={handleHistoryRequest}
    />
  );
};

export default TradeHistory;
