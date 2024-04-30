import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Stack } from "@chakra-ui/react";
import { Button } from "@mui/material";

export interface IPositionTableRow {
  id: string;
  account: string | null;
  fifoFeed: string;
  tradeSymbol: string;
  tradeQty: number;
  status: string;
}

interface PositionTableProps {
  data: IPositionTableRow[];
  onStop: (id: string) => void
  onDelete: (id: string) => void
}

const PositionTable: React.FC<PositionTableProps> = ({ onStop, onDelete, data }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Account #</TableCell>
            <TableCell align="left">FIFO Feed</TableCell>
            <TableCell align="left">Trade Symbol</TableCell>
            <TableCell align="left">Trade Qty</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
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
                align="left"
              >
                {row.account}
              </TableCell>
              <TableCell
                align="left"
              >
                {row.fifoFeed}
              </TableCell>
              <TableCell
                align="left"
              >
                {row.tradeSymbol}
              </TableCell>
              <TableCell
                align="left"
              >
                {row.tradeQty}
              </TableCell>
              <TableCell
                align="left"
              >
                {row.status}
              </TableCell>
              <TableCell
                align="center"
              >
                <Stack direction="row" justifyContent="center">
                  <Button onClick={() => onStop(row.id)} size="small">Stop</Button>
                  <Button sx={{color: "error.light"}} onClick={() => onDelete(row.id)} size="small">Delete</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PositionTable;
