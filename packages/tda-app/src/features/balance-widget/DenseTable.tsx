import MainCard, { MainCardProps } from "@/components/MainCard";
import { Box, Collapse } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/system";
import {
  ColumnDef,
  ColumnDefResolved,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface ReactTableProps<T> extends Omit<MainCardProps, "children"> {
  columns: ColumnDefResolved<T>[];
  data: T[];
  isOpen?: boolean;
}

export default function DenseTable<T>({
  columns,
  data,
  title,
  sx,
  secondary,
  isOpen = true,
  ...props
}: ReactTableProps<T>) {
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <MainCard
      sx={{
        ".MuiCardHeader-root": {
          padding: 1,
        },
        height: "fit-content",
        right: 73,
        width: "250px",
        ...sx,
        "@media (max-width: 1485px)": {
          width: "230px",
          right: 50,
        },
        "@media (max-width: 1250px)": {
          width: "180px",
          right: 5,
        },
        "@media (max-width: 767px)": {
          width: "200px",
        },
      }}
      {...props}
      content={false}
      title={title}
      secondary={secondary}>
      <Box>
        <Collapse
          in={isOpen}
          timeout="auto"
          unmountOnExit>
          <TableContainer
            component={Paper}
            sx={{ overflowX: "hidden" }}>
            <Table size="small">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                  <DenseTableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableCell
                        key={header.id}
                        {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </DenseTableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <DenseTableRow key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <TableCell
                          key={cell.id}
                          {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </DenseTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
    </MainCard>
  );
}

const DenseTableRow = styled(TableRow)(({ theme }) => ({
  ".MuiTableCell-root": {
    paddingLeft: "8px !important",
    paddingRight: "95px !important",
    fontSize: "11px !important",
    "@media (max-width: 1250px)": {
      paddingRight: "30px !important",
    },
  },
  ".MuiTableCell-head": {
    fontSize: "9px !important",
  },
}));
