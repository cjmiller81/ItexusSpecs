import { Stack } from "@chakra-ui/react";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import YesNoDialog from "../modals/Modals/YesNoDialog";

export type StrategyStatus = "Running" | "Suspended"
export interface IPositionTableRow {
  id: string
  account: string | null
  fifoFeed: string
  tradeSymbol: string
  tradeQty: number
  status: StrategyStatus
}

interface PositionTableProps {
  data: IPositionTableRow[]
  onStop: (id: IPositionTableRow) => void
  onDelete: (id: IPositionTableRow) => void
  onStart: (id: IPositionTableRow) => void
  isMutating: boolean
}

const PositionTable: React.FC<PositionTableProps> = ({ onStop, onStart, onDelete, data, isMutating }) => {
  const [strategyToDelete, setStrategyToDelete] = useState<null | IPositionTableRow>(null)
  return (
    <>
      <YesNoDialog open={Boolean(strategyToDelete)}
      onAgree={() => {
        setStrategyToDelete(null)
        onDelete(strategyToDelete!)
      }}
      onClose={() => setStrategyToDelete(null)}
      title="Delete strategy"
      content="Are you sure you want to delete the selected strategy?" />

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table">
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
                }}>
                <TableCell align="left">{row.account}</TableCell>
                <TableCell align="left">{row.fifoFeed}</TableCell>
                <TableCell align="left">{row.tradeSymbol}</TableCell>
                <TableCell align="left">{row.tradeQty}</TableCell>
                <TableCell
                  width={110}
                  align="left">
                  {row.status}
                </TableCell>
                <TableCell align="center">
                  <Stack
                    direction="row"
                    justifyContent="center">
                    {row.status === "Running" ? (
                      <Button
                        onClick={() => onStop(row)}
                        disabled={isMutating}
                        size="small">
                        Stop
                      </Button>
                    ) : (
                      <Button
                        sx={{ color: "success.main" }}
                        onClick={() => onStart(row)}
                        disabled={isMutating}
                        size="small">
                        Start
                      </Button>
                    )}
                    <Button
                      sx={{ color: "error.light" }}
                      onClick={() => setStrategyToDelete(row)}
                      disabled={isMutating}
                      size="small">
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default PositionTable
