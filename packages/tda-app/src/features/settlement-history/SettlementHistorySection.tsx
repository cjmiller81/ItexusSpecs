import { MainCardProps } from "@/components/MainCard";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SettlementTable from "../tables/settlement-table/SettlementTable";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { fetchTransactions } from "../tables/settlement-table/settlementSlice";

type Props = Omit<MainCardProps, "children" | "title"> & {};

export const SettlementHistorySection: FC<Props> = ({ ...props }) => {
  const { t } = useTranslation("SettlementHistory");
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate());
  const [toDate, setToDate] = useState<Date | null>(moment().toDate());
  const { transactions } = useAppSelector(state => state.settlements);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (fromDate && toDate) {
      dispatch(fetchTransactions({fromDate, toDate}))
    }
  }, [dispatch, fromDate, toDate])

  return (
    <>
      <SettlementTable
        sx={{ width: "100%", borderRadius: "10px" }}
        fileName={t("FileName")}
        fromDate={fromDate}
        toDate={toDate}
        handleHistoryRequest={() => {}}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        rows={transactions}
        title={t("Title")}
        {...props}
      />
    </>
  );
};

export default SettlementHistorySection;
