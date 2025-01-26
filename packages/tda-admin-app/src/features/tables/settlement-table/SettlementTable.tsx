import MainCard, { MainCardProps } from "@/components/MainCard";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { FC, useMemo, useState } from "react";
import { formatDate, formatFilledPrice, formatTime } from "../dataFormatters";
import { ReactTable } from "../ReactTable";
import { getSettlementDataTableColumns } from "./columns";
import { TableHeader } from "./Header";
import { SettlementTableRow } from "./types";

export interface RFQTableProps extends Omit<MainCardProps, "children"> {
  rows: SettlementTableRow[];
  fileName: string;
  handleHistoryRequest: (fromDate: Date, toDate: Date) => void;
  fromDate: Date | null;
  toDate: Date | null;
  onFromDateChange: (date: Date | null) => void;
  onToDateChange: (date: Date | null) => void;
  title: string;
}

export const SettlementTable: FC<RFQTableProps> = ({
  rows,
  handleHistoryRequest,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  title,
  fileName,
  sx,
  ...props
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: false }]);

  const handleToDateChange = (newToDate: Date | null) => {
    if (fromDate && newToDate && newToDate < fromDate) {
      onToDateChange(null);
    } else {
      onToDateChange(newToDate);
    }
  };

  const handleFromDateChange = (newFromDate: Date | null) => {
    onFromDateChange(newFromDate);
    if (toDate && newFromDate && toDate < newFromDate) {
      onToDateChange(null);
    }
  };

  const handleDownloadCsv = () => {
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}_${today.getDate()}_${today.getFullYear()}`;
    let csvContent = "Type, Settlement Id, Time, Date, Amount, Currency, Status, Destination\n";
    rows?.forEach(item => {
      csvContent += `${item.type},${item.settlementId},${formatTime(item.time)},${formatDate(item.date)},${formatFilledPrice(item.amount)},${item.currency},${item.status},${item.destination}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}_${formattedDate}.csv`;
    link.click();
  };

  const handleDownloadPdf = () => {
    const tableColumns = columns as { accessorKey: string; header: string }[];
    const doc = new jsPDF();
    autoTable(doc, {
      styles: { fontSize: 9 },
      head: [tableColumns.map(column => column.header)],
      body: rows.map(row =>
        tableColumns.map(({ accessorKey }) => {
          let value = row[accessorKey];
          if (accessorKey === "time") return formatTime(value);
          if (accessorKey === "date") return formatDate(value);
          if (accessorKey === "amount") return formatFilledPrice(value);
          return value;
        }),
      ),
    });
    doc.save(`${fileName}_${moment().format("MM_DD_YYYY")}.pdf`);
  };

  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
  };

  const columns = useMemo(() => getSettlementDataTableColumns(), []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MainCard
        content={false}
        sx={{ bgcolor: "primary.lighter", position: "relative", ...sx }}
        {...props}>
        <ReactTable
          title={title}
          data={rows}
          columns={columns}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          header={
            <TableHeader
              {...{
                title,
                fromDate,
                toDate,
                handleDownloadPdf,
                handleDownloadCsv,
                handleToDateChange,
                handleFromDateChange,
              }}
            />
          }
        />
      </MainCard>
    </LocalizationProvider>
  );
};

export default SettlementTable;
