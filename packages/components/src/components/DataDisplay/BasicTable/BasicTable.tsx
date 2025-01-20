import React, { useState } from "react";
import { styled } from "@mui/material";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import TablePagination from "@mui/material/TablePagination";

export function BasicTable({ rows, columns, ...props }: DataGridProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedRows = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ width: "100%" }}>
      <StyledDataGrid
        rows={paginatedRows}
        columns={columns}
        rowCount={rows.length}
        paginationMode="server"
        pagination
        hideFooter
        {...props}
      />
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}

const StyledDataGrid = styled(DataGrid)(({}) => ({
  ".MuiDataGrid-cellContent": {
    fontSize: "14px",
  },
  ".MuiDataGrid-columnHeaderTitle": {
    fontWeight: 500,
    fontSize: "14px",
  },
  ".MuiDataGrid-cell.MuiDataGrid-cell--editing": {
    padding: "0 10px",
  },
}));
