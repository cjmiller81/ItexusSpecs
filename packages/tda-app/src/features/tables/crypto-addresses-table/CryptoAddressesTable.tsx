import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { Stack, styled } from "@mui/system";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderGroup,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import ScrollX from "components/ScrollX";
import MainCard from "components/MainCard";
import useMediaQuery from "@mui/material/useMediaQuery";

const CryptoAddressesTable = <TData extends object>({
  data,
  columns,
  sorting,
  onSortingChange,
  header,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  header?: ReactNode;
}) => {
  const table = useReactTable<TData>({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });
  const isPad = useMediaQuery("(max-width: 850px)");

  return (
    <StyledMainCard
      content={false}
      secondary={header}>
      <ScrollX>
        <Stack>
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                  <TableHeaderRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <StyledHeaderCell
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
                      </StyledHeaderCell>
                    ))}
                  </TableHeaderRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      const isWalletAddress = cell.column.id === "walletAddress";
                      const displayValue =
                        isWalletAddress && isPad
                          ? truncateAddress(cell.getValue())
                          : flexRender(cell.column.columnDef.cell, cell.getContext());

                      return (
                        <StyledTableCell
                          key={cell.id}
                          {...cell.column.columnDef.meta}>
                          {displayValue}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
        </Stack>
      </ScrollX>
    </StyledMainCard>
  );
};

export default CryptoAddressesTable;

const truncateAddress = (address: any) => {
  if (typeof address === "string") {
    return address.length > 9 ? `${address.slice(0, 9)}...` : address;
  } else if (Array.isArray(address)) {
    return (
      address
        .slice(0, 9)
        .map((addr: string) => (addr.length > 9 ? `${addr.slice(0, 9)}...` : addr))
        .join(", ") + (address.length > 9 ? "..." : "")
    );
  }
  return address;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "& .MuiChip-root": {
    maxWidth: "140px",
    minWidth: "140px",
  },
  [theme.breakpoints.down("md")]: {
    padding: "4px",
    fontSize: "12px",
    ":first-of-type": {
      paddingLeft: "8px !important",
    },
    "& .MuiSvgIcon-root": {
      height: "10px",
    },

    "& .MuiChip-root": {
      maxWidth: "100px",
      minWidth: "100px",
      padding: "3px 6px",
      "& .MuiSvgIcon-root": {
        height: "20px",
      },
      span: {
        paddingLeft: "8px !important",
        paddingRight: "8px !important",
      },
    },
  },
  [theme.breakpoints.down("sm")]: {
    padding: "2px",
    paddingLeft: "2px !important",
    paddingRight: "2px !important",
    fontSize: "8px",
    ":first-of-type": {
      paddingLeft: "4px !important",
    },
    "& .MuiSvgIcon-root": {
      height: "10px",
    },

    "& .MuiChip-root": {
      maxWidth: "70px",
      minWidth: "70px",
      padding: "0px 0px",
      "& .MuiSvgIcon-root": {
        width: "14px",
      },
      span: {
        paddingLeft: "8px !important",
        paddingRight: "8px !important",
      },
    },
  },
}));

const StyledHeaderCell = styled(StyledTableCell)(() => ({
  alignContent: "left",
}));

const StyledMainCard = styled(MainCard)(({ theme }) => ({
  "& .MuiCardHeader-root": {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
}));

const TableHeaderRow = styled(TableRow)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    svg: {
      width: "11px",
    },
  },
}));
