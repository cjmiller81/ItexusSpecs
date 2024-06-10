import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded"
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import Button from "@mui/material/Button"
import { Box, BoxProps, Stack } from "@mui/system"
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TablePagination } from "components/third-party/react-table"
import moment from "moment"
import DownloadSvgIcon from "public/assets/images/rfq/csv-download.svg"
import { FC, ReactNode } from "react"
import MainCard from "../MainCard"
import ScrollX from "../ScrollX"
import { HistoryDataParsed } from "./HistoryDataParsed"

const columns: ColumnDef<HistoryDataParsed>[] = [
  {
    accessorKey: "transactTime",
    header: "Transact Time",
    cell: props =>
      moment(props.getValue() as Date)
        .local()
        .format("YYYY-MM-DD HH:mm:ss"),
  },
  { accessorKey: "symbol", header: "Symbol" },
  { accessorKey: "side", header: "Side" },
  { accessorKey: "filledQty", header: "Filled Quantity" },
  { accessorKey: "filledPrice", header: "Filled Price" },
  { accessorKey: "status", header: "Status" },
]

interface RFQTableProps extends BoxProps {
  rows: HistoryDataParsed[]
  handleHistoryRequest: (fromDate: Date, toDate: Date) => void
  fromDate: Date | null
  toDate: Date | null
  onFromDateChange: (date: Date | null) => void
  onToDateChange: (date: Date | null) => void
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
  const handleToDateChange = (newToDate: Date | null) => {
    if (fromDate && newToDate && newToDate < fromDate) {
      onToDateChange(null)
    } else {
      onToDateChange(newToDate)
    }
  }

  const handleFromDateChange = (newToDate: Date | null) => {
    onFromDateChange(newToDate)
    if (toDate && newToDate && toDate < newToDate) {
      onFromDateChange(null)
    }
  }

  const handleDownloadCsv = () => {
    // Create the CSV content from the data array
    let csvContent = "Timestamp, Symbol, Side, Quantity, Price, TradeStatus\n"
    rows?.forEach((item, key) => {
      csvContent += `${item.transactTime},${item.symbol},${item.side},${item.filledQty},${item.filledPrice},${item.status}\n`
    })

    // Create a Blob object from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "Symbol_Data.csv"

    // Simulate a click on the anchor element to trigger the download
    link.click()
  }

  const handleHistory = () => {
    if (toDate && fromDate) handleHistoryRequest(fromDate, toDate)
  }

  return (
    <Box {...props}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MainCard
          content={false}
          sx={{ bgcolor: "primary.lighter", position: "relative" }}>
          <ReactTable
            data={rows}
            columns={columns}
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
  )
}

function TableHeader({
  handleDownloadCsv,
  fromDate,
  toDate,
  handleHistory,
  handleToDateChange,
  handleFromDateChange,
}: {
  handleDownloadCsv: () => void
  handleHistory: () => void
  fromDate: Date | null
  toDate: Date | null
  handleToDateChange: (date: Date | null) => void
  handleFromDateChange: (date: Date | null) => void
}) {
  return (
    <Stack
      direction="row"
      alignItems="center">
      <DownloadSvgIcon
        onClick={handleDownloadCsv}
        style={{ cursor: "pointer" }}
        width="24px"
        height="24px"></DownloadSvgIcon>
      <DesktopDatePicker
        sx={{ ml: 0.5, minWidth: "150px" }}
        label="From Date*"
        format="MM/dd/yyyy"
        value={fromDate}
        maxDate={toDate ?? undefined}
        onChange={handleFromDateChange}
      />
      <DesktopDatePicker
        sx={{ ml: 1, minWidth: "150px" }}
        label="To Date*"
        format="MM/dd/yyyy"
        value={toDate}
        minDate={fromDate ?? undefined}
        onChange={handleToDateChange}
      />
      <Button
        sx={{ ml: 4, minWidth: "150px" }}
        variant="contained"
        disabled={!(fromDate && toDate)}
        onClick={handleHistory}>
        Run History
      </Button>
      <HistoryRoundedIcon
        onClick={handleHistory}
        sx={{ cursor: "pointer", ml: theme => theme.spacing(0.5) }}
      />
    </Stack>
  )
}

function ReactTable({
  data,
  columns,
  header,
}: {
  data: HistoryDataParsed[]
  columns: ColumnDef<HistoryDataParsed>[]
  header: ReactNode
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

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
                        {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
  )
}

export default RFQTable
