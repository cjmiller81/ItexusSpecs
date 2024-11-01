import MainCard, { MainCardProps } from "@/components/MainCard";
import { useTheme } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { FC, useMemo, useState } from "react";
import { TableHeader } from "./Header";
import { ReactTable } from "../ReactTable";
import { getStatusLabelText } from "./StatusChip";
import { getHistoryDataTableColumns } from "./columns";
import { formatFilledPrice, formatFilledQty, formatOrderId, formatTransactTime } from "../dataFormatters";

interface RFQTableProps extends Omit<MainCardProps, "children"> {
  rows: HistoryDataParsed[];
  fileName: string;
  handleHistoryRequest: (fromDate: Date, toDate: Date) => void;
  fromDate: Date | null;
  toDate: Date | null;
  onFromDateChange: (date: Date | null) => void;
  onToDateChange: (date: Date | null) => void;
  title: string;
}

export const HistoryDataTable: FC<RFQTableProps> = ({
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
  const [sorting, setSorting] = useState<SortingState>([{ id: "transactTime", desc: true }]);
  const theme = useTheme();
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

    // Create the CSV content from the data array
    let csvContent = "Timestamp, Symbol, Side, Quantity, Price, TradeStatus\n";
    rows?.forEach((item, key) => {
      csvContent += `${item.transactTime},${item.symbol},${item.side},${item.filledQty},${item.filledPrice},${item.status}\n`;
    });

    // Create a Blob object from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    link.download = `${fileName}_${formattedDate}.csv`;

    link.click();
  };

  const columns = useMemo(() => getHistoryDataTableColumns(theme), []);

  const handleDownloadPdf = () => {
    const tableColumns = columns as { accessorKey: string; header: string }[];
    const doc = new jsPDF();
    autoTable(doc, {
      head: [tableColumns.map(column => column.header)],
      body: rows.map(row =>
        tableColumns.map(({ accessorKey }) => {
          let value = row[accessorKey];
          if (accessorKey === "transactTime") return formatTransactTime(value);
          if (accessorKey === "id") return formatOrderId(value);
          if (accessorKey === "filledQty") return formatFilledQty(value);
          if (accessorKey === "filledPrice") return formatFilledPrice(value);
          if (accessorKey === "status") return getStatusLabelText(value);
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MainCard
        content={false}
        sx={{ bgcolor: "primary.lighter", position: "relative", ...sx, borderRadius: "10px" }}
        {...props}>
        <ReactTable
          title={title}
          data={rows}
          columns={getHistoryDataTableColumns(theme)}
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

export default HistoryDataTable;
