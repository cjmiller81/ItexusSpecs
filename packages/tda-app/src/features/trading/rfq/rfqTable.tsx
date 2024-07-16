import React from "react";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Box, BoxProps, Stack } from "@mui/system";
import { LocalizationProvider, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table";
import { TablePagination } from "components/third-party/react-table";
import moment from "moment";
import { FC, ReactNode, useState } from "react";
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import MainCard from "@/components/MainCard";
import ScrollX from "@/components/ScrollX";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { PickersShortcutsItem } from "@mui/x-date-pickers/PickersShortcuts";
import { DateRange, DateRangeValidationError } from "@mui/x-date-pickers-pro/models";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { useTheme } from "@mui/material/styles";

const renderStatusChip = (status: string) => {
  switch (status) {
    case "Filled":
      return (
        <Chip
          label="Filled"
          color="success"
          variant="outlined"
          icon={<CheckCircleOutlineIcon />}
          sx={{ borderRadius: 30 }}
        />
      );
    case "Open":
      return (
        <Chip
          label="Open"
          color="info"
          variant="outlined"
          icon={<InfoOutlinedIcon />}
          sx={{ borderRadius: 30 }}
        />
      );
    case "Rejected":
      return (
        <Chip
          label="Rejected"
          color="error"
          variant="outlined"
          icon={<ErrorOutlineIcon />}
          sx={{ borderRadius: 30 }}
        />
      );
    default:
      return <Chip label={status} />;
  }
};

const columns: ColumnDef<HistoryDataParsed>[] = [
  {
    accessorKey: "transactTime",
    header: "Trade Time",
    cell: props =>
      moment(props.getValue() as Date)
        .local()
        .format("YYYY-MM-DD HH:mm:ss"),
  },
  { accessorKey: "symbol", header: "Pair" },
  {
    accessorKey: "side",
    header: "Action",
    cell: props => {
      const action = props.getValue() as string;
      let bgColor = "transparent";
      let textColor = "inherit";

      if (action === "Buy") {
        bgColor = "rgba(149, 222, 100, 0.2)";
        textColor = "success.dark";
      } else if (action === "Sell") {
        bgColor = "rgba(222, 100, 100, 0.2)";
        textColor = "error.dark";
      }

      return (
        <Box
          sx={{
            borderRadius: 10,
            px: 2,
            py: 0.4,
            color: textColor,
            bgcolor: bgColor,
            maxWidth: "max-content",
          }}>
          {action}
        </Box>
      );
    },
  },
  {
    accessorKey: "filledQty",
    header: "Quantity",
    cell: props => {
      const value = Number(props.getValue() as string);
      return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    },
  },
  {
    accessorKey: "filledPrice",
    header: "Price",
    cell: props => {
      const value = Number(props.getValue() as string);
      return value.toFixed(5);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: props => renderStatusChip(props.getValue() as string),
  },
  { accessorKey: "orderId", header: "Order ID" },
];

interface RFQTableProps extends BoxProps {
  rows: HistoryDataParsed[];
  handleHistoryRequest: (fromDate: Date, toDate: Date) => void;
  fromDate: Date | null;
  toDate: Date | null;
  onFromDateChange: (date: Date | null) => void;
  onToDateChange: (date: Date | null) => void;
}

export const RFQTable: FC<RFQTableProps> = ({
  rows,
  handleHistoryRequest,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  ...props
}) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "transactTime", desc: true }]);

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

  return (
    <Box {...props}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MainCard
          content={false}
          sx={{ bgcolor: "primary.lighter", position: "relative", width: 1100 }}>
          <ReactTable
            data={rows}
            columns={columns}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            header={
              <TableHeader
                {...{
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
    </Box>
  );
};

function TableHeader({
  handleDownloadCsv,
  fromDate,
  toDate,
  handleHistory,
  handleToDateChange,
  handleFromDateChange,
}: {
  handleDownloadCsv: () => void;
  handleHistory: () => void;
  fromDate: Date | null;
  toDate: Date | null;
  handleToDateChange: (date: Date | null) => void;
  handleFromDateChange: (date: Date | null) => void;
}) {
  const { t } = useTranslation("ProfilePage");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDateChange = (
    newValue: DateRange<dayjs.Dayjs>,
    shortcuts: PickerChangeHandlerContext<DateRangeValidationError>,
  ) => {
    let newFromDate = newValue[0] ? newValue[0].toDate() : null;
    let newToDate = newValue[1] ? newValue[1].toDate() : null;

    if (newFromDate && fromDate && newFromDate < fromDate && !shortcuts.hasOwnProperty("shortcut")) {
      newToDate = null;
    }

    handleFromDateChange(newFromDate);
    handleToDateChange(newToDate);

    if (newFromDate && newToDate) {
      handleMenuClose();
    }
  };

  const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
      label: "This Week",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("week"), today.endOf("week")];
      },
    },
    {
      label: "Last Week",
      getValue: () => {
        const today = dayjs();
        const prevWeek = today.subtract(7, "day");
        return [prevWeek.startOf("week"), prevWeek.endOf("week")];
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(7, "day"), today];
      },
    },
    {
      label: "Current Month",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("month"), today.endOf("month")];
      },
    },
    { label: "Reset", getValue: () => [null, null] },
  ];

  return (
    <Stack
      direction="row"
      alignItems="center">
      <Box sx={{ margin: "0 127px" }}>
        <Button
          onClick={handleMenuOpen}
          sx={{
            ml: 0.5,
            minWidth: "300px",
            color: theme.palette.grey[700],
            border: "1px solid",
            borderColor: theme.palette.grey[500],
            alignItems: "center",
            "&:hover": {
              borderColor: theme.palette.grey[100],
              color: theme.palette.grey[700],
              border: "1px solid",
              backgroundColor: theme.palette.grey[100],
            },
          }}
          variant="outlined">
          <span style={{ flex: 1, textAlign: "center", fontSize: 14 }}>
            {fromDate && toDate
              ? `${dayjs(fromDate).format("MM/DD/YYYY")}\u00A0—\u00A0${dayjs(toDate).format("MM/DD/YYYY")}`
              : "Select Date Range"}
          </span>
          <InsertInvitationIcon sx={{ ml: 1, color: theme.palette.grey[600], marginLeft: 0 }} />
        </Button>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}>
          <MenuItem>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateRangePicker
                slotProps={{
                  shortcuts: {
                    items: shortcutsItems,
                  },
                  actionBar: { actions: [] },
                }}
                calendars={2}
                value={[dayjs(fromDate), dayjs(toDate)]}
                onChange={(newValue, selectedShortcut) => handleDateChange(newValue, selectedShortcut)}
              />
            </LocalizationProvider>
          </MenuItem>
        </Menu>
      </Box>
      <Button
        sx={{ ml: 4, minWidth: "150px" }}
        variant="contained"
        disabled={!(fromDate && toDate)}
        onClick={handleHistory}>
        Run History
      </Button>
      <HistoryRoundedIcon
        onClick={handleHistory}
        sx={{
          cursor: "pointer",
          "&:hover": {
            color: "primary.main",
          },
          ml: theme => theme.spacing(0.5),
        }}
      />
      <Button
        onClick={handleDownloadCsv}
        sx={{ display: "flex", gap: 0.5, alignItems: "center", padding: "0 1" }}>
        <DownloadOutlined style={{ cursor: "pointer", fontSize: 20 }} />
        <Typography>{t("Export")}</Typography>
      </Button>
    </Stack>
  );
}

function ReactTable({
  data,
  columns,
  sorting,
  onSortingChange,
  header,
}: {
  data: HistoryDataParsed[];
  columns: ColumnDef<HistoryDataParsed>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  header: ReactNode;
}) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  return (
    <MainCard
      title={"Recent Transactions"}
      content={false}
      secondary={header}>
      <ScrollX>
        <Stack>
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableCell
                        key={header.id}
                        {...header.column.columnDef.meta}
                        sortDirection={
                          header.column.getIsSorted()
                            ? header.column.getIsSorted() === "desc"
                              ? "desc"
                              : "asc"
                            : false
                        }>
                        {header.isPlaceholder ? null : (
                          <TableSortLabel
                            active={!!header.column.getIsSorted()}
                            direction={
                              header.column.getIsSorted()
                                ? header.column.getIsSorted() === "desc"
                                  ? "desc"
                                  : "asc"
                                : "asc"
                            }
                            onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />
          <Box sx={{ p: 2 }}>
            <TablePagination
              {...{
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount,
              }}
            />
          </Box>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

export default RFQTable;
