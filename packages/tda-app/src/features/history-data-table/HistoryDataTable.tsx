import MainCard, { MainCardProps } from "@/components/MainCard";
import { useTheme } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import { FC, useState } from "react";
import { TableHeader } from "./Header";
import { ReactTable } from "./ReactTable";
import { getHistoryDataTableColumns } from "./columns";

interface RFQTableProps extends Omit<MainCardProps, "children"> {
  rows: HistoryDataParsed[];
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

    link.download = `Recent_Transactions_${formattedDate}.csv`;

    link.click();
  };

  const handleHistory = () => {
    if (toDate && fromDate) handleHistoryRequest(fromDate, toDate);
  };

  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
  };

  const updatedRows = rows.map(transaction => {
    const newStatus = transaction.status === "Error" ? "Rejected" : transaction.status;
    const shortId = transaction.id ? transaction.id.slice(0, 4) : transaction.id;

    return {
      ...transaction,
      status: newStatus,
      id: shortId,
    };
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MainCard
        content={false}
        sx={{ bgcolor: "primary.lighter", position: "relative", ...sx }}
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
                handleDownloadCsv,
                handleHistory,
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
