import { Stack } from "@chakra-ui/react";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import YesNoDialog from "../modals/Modals/YesNoDialog";
import { StrategySettings } from "../../../../../services/tradingPlatformService";

import "./PositionTable.scss";

export type StrategyStatus = "Running" | "Suspended";
export interface IPositionTableRow {
  id: string;
  entryOrderStatus: string;
  targetOrderStatus: string;
  account: string | null;
  tradeSymbol: string;
  tradeQty: number;
  status: StrategyStatus;
  strategySetting?: StrategySettings | null;
  nextEntryTimestamp?: {
    seconds: number,
    nanos: number
  } | null;
  nextEndOfDayCloseTimestamp?: {
    seconds: number,
    nanos: number
  } | null;
  userMessage?: string | null;
}

interface PositionTableProps {
  data: IPositionTableRow[];
  onStop: (id: IPositionTableRow) => void;
  onDelete: (id: IPositionTableRow) => void;
  onStart: (id: IPositionTableRow) => void;
  onEdit: (id: IPositionTableRow) => void;
  onForceExit: (id: IPositionTableRow) => void;
  isMutating: boolean;
}

const PositionTable: React.FC<PositionTableProps> = ({ onStop, onStart, onEdit, onDelete, onForceExit, data, isMutating }) => {
  const [strategyToDelete, setStrategyToDelete] = useState<null | IPositionTableRow>(null);
  const [isForceExitApplied, setForceExitApplied] = useState<boolean>(false);

  useEffect(() => {
    setForceExitApplied(false);
  }, [data]);

  const onForceExitClick = (id: IPositionTableRow) => {
    setForceExitApplied(true);
    onForceExit(id);
  }

  return (
    <>
      <YesNoDialog
        open={Boolean(strategyToDelete)}
        onAgree={() => {
          setStrategyToDelete(null);
          onDelete(strategyToDelete!);
        }}
        onClose={() => setStrategyToDelete(null)}
        title="Delete strategy"
        content="Are you sure you want to delete the selected strategy?"
      />

      <TableContainer component={Paper} className="positionTableStyling">
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Account #</TableCell>
              <TableCell align="left">Trade Symbol</TableCell>
              <TableCell align="left">Trade Qty</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: IPositionTableRow, key) => (
              <>
                <TableRow
                  key={key}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}>
                  <TableCell align="left">{row.account}</TableCell>
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
                        <>
                          <Button
                            sx={{ color: "success.main" }}
                            onClick={() => onStart(row)}
                            disabled={isMutating}
                            size="small">
                            Start
                          </Button>
                          <Button
                            sx={{ color: "white" }}
                            onClick={() => onEdit(row)}
                            disabled={isMutating}
                            size="small">
                            Edit
                          </Button>
                        </>
                      )}
                      {row.entryOrderStatus === "Filled"
                        && row.targetOrderStatus === "Working"
                        && !isForceExitApplied
                        ? (
                          <Button
                          sx={{ color: "error.dark" }}
                          onClick={() => onForceExitClick(row)}
                          disabled={isMutating}
                          size="small">
                          FORCE EXIT
                        </Button>
                        )
                        : (
                          <Button
                            sx={{ color: "error.light" }}
                            onClick={() => setStrategyToDelete(row)}
                            disabled={isMutating}
                            size="small">
                            Delete
                          </Button>
                        )
                      }
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {(row.userMessage && row.userMessage.length > 0) ? (
                    <TableCell colSpan={3} align="left">
                      <span className="errorMessage">
                        {row.userMessage}
                      </span>
                    </TableCell>
                  ) : (
                    <TableCell colSpan={3} align="left">
                    </TableCell>
                  )}
                  {
                    row.status === "Running" && row.nextEndOfDayCloseTimestamp && row.nextEndOfDayCloseTimestamp.seconds > 0
                      ? (
                        <TableCell colSpan={2} align="left">
                          <span>
                            Close Position Time: {(new Date(row.nextEndOfDayCloseTimestamp.seconds * 1000)).toLocaleString()}
                          </span>
                        </TableCell>
                      ) : (
                        row.status === "Running" && row.nextEntryTimestamp && row.nextEntryTimestamp.seconds > 0 ? (
                          <TableCell colSpan={2} align="left">
                            <span>
                            Next Entry Time: {(new Date(row.nextEntryTimestamp.seconds * 1000)).toLocaleString()}
                            </span>
                          </TableCell>
                        ) : (
                          <TableCell colSpan={2} align="left">
                          </TableCell>
                        )
                      )
                  }
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PositionTable;
