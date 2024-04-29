import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export interface IPositionTableRow {
  id?: number;
  orderNumber: string;
  type: string;
  status: string;
  symbol: string;
  qty: number;
  disabled?: boolean;
}

interface PositionTableProps {
  data: IPositionTableRow[];
}

const PositionTable: React.FC<PositionTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Order #</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Symbol</TableCell>
            <TableCell align="left">Qty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: IPositionTableRow, key) => (
            <TableRow
              key={key}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell
                sx={{
                  color: row.disabled ? "rgba(255, 255, 255, 0.5)" : "inherit",
                }}
                align="left"
              >
                {row.orderNumber}
              </TableCell>
              <TableCell
                sx={{
                  color: row.disabled ? "rgba(255, 255, 255, 0.5)" : "inherit",
                }}
                align="left"
              >
                {row.type}
              </TableCell>
              <TableCell
                sx={{
                  color: row.disabled ? "rgba(255, 255, 255, 0.5)" : "inherit",
                }}
                align="left"
              >
                {row.status}
              </TableCell>
              <TableCell
                sx={{
                  color: row.disabled ? "rgba(255, 255, 255, 0.5)" : "inherit",
                }}
                align="left"
              >
                {row.symbol}
              </TableCell>
              <TableCell
                sx={{
                  color: row.disabled ? "rgba(255, 255, 255, 0.5)" : "inherit",
                }}
                align="left"
              >
                {row.qty}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PositionTable;
