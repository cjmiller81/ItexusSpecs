import i18next from "@/libs/i18n/i18n";
import { Button, darken, lighten, styled } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { StrategyBot } from "../types";

export function getBotColumnsDefs(
  handleStartClick: (row: StrategyBot) => void,
  handleStopClick: (row: StrategyBot) => void,
  handleResetClick: (row: StrategyBot) => void,
  handleForceExitClick: (row: StrategyBot) => void,
) {

  const isForceExitActive = (row: StrategyBot) => {
    return row.active 
    || (row.hasEntryOrderStatus && (!row.hasTargetOrderStatus || row.targetOrderStatus === 'working'))
  }

  const columns: GridColDef<StrategyBot>[] = [
    {
      field: "active",
      headerName: i18next.t("Active", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "boolean",
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
            disabled={params.row.active}
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
            disabled={!params.row.active}
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
          disabled={!params.row.active}
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

    {
      field: "flattenBot",
      headerName: i18next.t("FlattenBot", { ns: "ColumnsDefs" }),
      width: 120,
      disableColumnMenu: true,
      headerAlign: "center",
      sortable: false,
      renderCell: params => {
        return (
          <StyledCellButton
            disabled={!isForceExitActive(params.row)}
            onClick={e => {
              handleForceExitClick(params.row);
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
            {i18next.t("ForceExit", { ns: "ColumnsDefs" })}
          </StyledCellButton>
        );
      },
    },
    {
      field: "masterSymbol",
      headerName: i18next.t("TradeSymbol", { ns: "ColumnsDefs" }),
      minWidth: 80,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "tradeQty",
      headerName: i18next.t("TradeQty", { ns: "ColumnsDefs" }),
      minWidth: 100,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      type: "number",
      flex: 1,
      valueGetter: (params) => params.value.units
    },
    {
      field: "entryOrderStatus",
      headerName: i18next.t("EntryOrderStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "targetOrderStatus",
      headerName: i18next.t("TargetOrderStatus", { ns: "ColumnsDefs" }),
      minWidth: 110,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      type: "string",
      flex: 1,
    },
  ];

  return columns;
}

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
