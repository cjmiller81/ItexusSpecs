import MainCard from "@/components/MainCard";
import ScrollX from "@/components/ScrollX";
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
import { Box, Stack, styled } from "@mui/system";
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
import { HistoryDataParsed } from "api/rfq-api/models/HistoryDataParsed";
import { TablePagination } from "components/third-party/react-table";
import { ReactNode } from "react";

export const ReactTable = ({
  data,
  columns,
  sorting,
  onSortingChange,
  header,
  title,
}: {
  data: HistoryDataParsed[];
  columns: ColumnDef<HistoryDataParsed>[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  header: ReactNode;
  title: string;
}) => {
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
    <StyledMainCard
      title={title}
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
    </StyledMainCard>
  );
};

const StyledMainCard = styled(MainCard)(({ theme }) => ({
  "& .MuiCardHeader-root": {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
}));
