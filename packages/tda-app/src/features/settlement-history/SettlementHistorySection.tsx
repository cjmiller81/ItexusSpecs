import { MainCardProps } from "@/components/MainCard";
import moment from "moment";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import mockData from "../tables/settlement-table/mock-data";
import SettlementTable from "../tables/settlement-table/SettlementTable";

type Props = Omit<MainCardProps, "children" | "title"> & {};

export const SettlementHistorySection: FC<Props> = ({ ...props }) => {
  const { t } = useTranslation("SettlementHistory");
  return (
    <>
      <SettlementTable
        sx={{ width: "100%", borderRadius: "10px" }}
        fileName={t("FileName")}
        fromDate={moment().add(-1, "M").toDate()}
        toDate={moment().toDate()}
        handleHistoryRequest={() => {}}
        onFromDateChange={() => {}}
        onToDateChange={() => {}}
        rows={mockData}
        title={t("Title")}
        {...props}
      />
    </>
  );
};

export default SettlementHistorySection;
