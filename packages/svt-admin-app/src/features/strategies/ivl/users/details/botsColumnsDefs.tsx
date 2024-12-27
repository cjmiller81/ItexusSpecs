import { GridColDef } from "@mui/x-data-grid";
import { Bot } from "./bot";

export const getBotColumnsDefs = (
  handleStartClick: (bot: Bot) => void,
  handleStopClick: (bot: Bot) => void,
  handleResetClick: (bot: Bot) => void,
): GridColDef<Bot>[] => [
  {
    field: "isStarted",
    headerName: "Is Started",
    type: "boolean",
    flex: 1,
  },
  {
    field: "entryOrderSymbol",
    headerName: "Entry Symbol",
    flex: 1,
  },
  {
    field: "exitOrderSymbol",
    headerName: "Exit Symbol",
    flex: 1,
  },
  {
    field: "exchangeUsername",
    headerName: "Exchange Username",
    flex: 1,
  },
  {
    field: "accountNumber",
    headerName: "Account Number",
    flex: 1,
  },
  {
    field: "riskTolerance",
    headerName: "Risk Tolerance",
    type: "number",
    flex: 1,
  },
  {
    field: "capitalAllocation",
    headerName: "Capital Allocation",
    valueGetter: params => (params.row.capitalAllocation ? JSON.stringify(params.row.capitalAllocation) : "N/A"),
    flex: 1,
  },
  {
    field: "closingOnly",
    headerName: "Closing Only",
    type: "boolean",
    flex: 1,
  },
  {
    field: "userMessage",
    headerName: "User Message",
    flex: 2,
  },
  {
    field: "actions",
    headerName: "Actions",
    renderCell: params => (
      <div>
        <button onClick={() => handleStartClick(params.row)}>Start</button>
        <button onClick={() => handleStopClick(params.row)}>Stop</button>
        <button onClick={() => handleResetClick(params.row)}>Reset</button>
      </div>
    ),
    sortable: false,
    flex: 1.5,
  },
];
