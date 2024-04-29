import React, { useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Radio } from "@mui/material";
import { ExchangeAccount } from "../../../../../services/tradingPlatformService";

interface AccountsTableProps {
  accountNumber: string;
  data: ExchangeAccount[];
  onChange: (accntNum: string) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accountNumber, data, onChange }) => {
  const handleRowOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    if (checked) {
      onChange(event.target.value)
    } else {
      onChange("")
    }
  }, [onChange]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Selected</TableCell>
            <TableCell align="left">Account #</TableCell>
            <TableCell align="left">Balance</TableCell>
            <TableCell align="left">Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: ExchangeAccount) => (
            <TableRow
              key={row.accountNumber}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                <Radio
                  checked={accountNumber === row.accountNumber}
                  onChange={handleRowOnChange}
                  value={row.accountNumber}
                  disabled={(row.isClosed || !row.isMargin) || false}
                />
              </TableCell>
              <TableCell
                sx={{
                  color: (row.isClosed || !row.isMargin) ? "rgba(255, 255, 255, 0.5)" : "inherit",
                  textDecoration: (row.isClosed || !row.isMargin) ? "line-through" : "none",
                }}
                align="left"
              >
                {row.accountNumber}
              </TableCell>
              <TableCell
                sx={{
                  color: (row.isClosed || !row.isMargin) ? "rgba(255, 255, 255, 0.5)" : "inherit",
                  textDecoration: (row.isClosed || !row.isMargin) ? "line-through" : "none",
                }}
                align="left"
              >
                {row.accountBalance}
              </TableCell>
              <TableCell
                sx={{
                  color: (row.isClosed || !row.isMargin) ? "rgba(255, 255, 255, 0.5)" : "inherit",
                  textDecoration: (row.isClosed || !row.isMargin) ? "line-through" : "none",
                }}
                align="left"
              >
                {row.isMargin ? "Margin" : "Cash"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountsTable;
