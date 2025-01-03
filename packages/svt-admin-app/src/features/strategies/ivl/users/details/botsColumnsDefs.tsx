import { GridColDef } from "@mui/x-data-grid";
import { Bot } from "./bot";
import { Button, styled, lighten, darken } from "@mui/material";
import i18next from "@/libs/i18n/i18n";

export const getBotColumnsDefs = (
  handleStartClick: (bot: Bot) => void,
  handleStopClick: (bot: Bot) => void,
  handleResetClick: (bot: Bot) => void,
): GridColDef<Bot>[] => [
  {
    field: "isStarted",
    headerName: "Is Started",
    type: "boolean",
    flex: 1.5,
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
    valueGetter: params => (params.row.capitalAllocation ? JSON.stringify(params.row.capitalAllocation.units) : "N/A"),
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
    field: "startBot",
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
    headerName: i18next.t("StartBot", { ns: "ColumnsDefs" }),
    width: 120,
    renderCell: params => {
      return (
        <StyledCellButton
          onClick={e => {
            handleStartClick(params.row);
          }}
          variant="contained"
          sx={{
            ":hover": {
              backgroundColor: theme => lighten(theme.palette.success.light, 0.1),
            },
            color: theme => theme.palette.success.main,
            backgroundColor: theme => theme.palette.success.light,
          }}>
          {i18next.t("StartBot", { ns: "ColumnsDefs" })}
        </StyledCellButton>
      );
    },
  },
  {
    field: "stopBot",
    headerName: i18next.t("StopBot", { ns: "ColumnsDefs" }),
    width: 120,
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
    renderCell: params => {
      return (
        <StyledCellButton
          onClick={e => {
            handleStopClick(params.row);
          }}
          variant="contained"
          sx={{
            ":hover": {
              backgroundColor: theme => lighten(theme.palette.error.light, 0.1),
            },
            color: theme => theme.palette.error.main,
            backgroundColor: theme => theme.palette.error.light,
          }}>
          {i18next.t("StopBot", { ns: "ColumnsDefs" })}
        </StyledCellButton>
      );
    },
  },
  {
    field: "resetBot",
    headerName: i18next.t("ResetBot", { ns: "ColumnsDefs" }),
    width: 120,
    disableColumnMenu: true,
    headerAlign: "center",
    sortable: false,
    renderCell: params => {
      return (
        <StyledCellButton
          onClick={e => {
            handleResetClick(params.row);
          }}
          variant="contained"
          sx={{
            ":hover": {
              backgroundColor: theme =>
                theme.palette.mode === "dark"
                  ? darken(theme.palette.warning.light, 0.5)
                  : lighten(theme.palette.warning.light, 0.6),
            },
            color: theme =>
              theme.palette.mode === "dark"
                ? darken(theme.palette.warning.main, 0.1)
                : lighten(theme.palette.warning.main, 0.1),
            backgroundColor: theme =>
              theme.palette.mode === "dark"
                ? darken(theme.palette.warning.light, 0.6)
                : lighten(theme.palette.warning.light, 0.7),
          }}>
          {i18next.t("ResetBot", { ns: "ColumnsDefs" })}
        </StyledCellButton>
      );
    },
  },
];

const StyledCellButton = styled(Button)(({ theme }) => ({
  borderRadius: "0px",
  padding: "0px 0px",
  minHeight: "23px",
  marginBottom: "-1px",
  fontSize: "12px",
  textDecoration: "capitalize",
  width: "100%",
  height: "max-content",
  boxShadow: "none",
  ":hover": {
    boxShadow: "none",
  },
}));
