import i18next from "@/libs/i18n/i18n";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowModesModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Theme, lighten } from "@mui/system";
import { Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Timestamp } from "./users/types";

export function getMechanical0DteSpxColumns(
  handleViewClick: (id: GridRowId) => void,
  handleSetSelection: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
  theme: Theme,
  currentRowId?: string
) {
  const columns: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Details",
      width: 60,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const selectedIconColor = lighten(theme.palette.text.primary, 0.4);
        return [
          <GridActionsCellItem
            key="view"
            icon={
              <VisibilityIcon
                sx={{ fill: currentRowId !== id ? selectedIconColor : theme.palette.text.primary }}
              />
            }
            label={i18next.t("View", { ns: "Common" })}
            className="textPrimary"
            onClick={() => {
              handleViewClick(id);
              handleSetSelection(id);
            }}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "strategyId",
      headerName: i18next.t("Strategy ID", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: false,
      type: "string",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "accountNumber",
      headerName: i18next.t("Account Number", { ns: "ColumnsDefs" }),
      minWidth: 120,
      editable: false,
      type: "string",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "botStatus",
      headerName: i18next.t("Bot Status", { ns: "ColumnsDefs" }),
      minWidth: 120,
      editable: false,
      type: "string",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "connectionStatus",
      headerName: i18next.t("Connection Status", { ns: "ColumnsDefs" }),
      minWidth: 120,
      editable: false,
      type: "boolean",
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <Chip variant="outlined" color="success" label="Connected" size="small" icon={<CheckIcon />} />
        ) : (
          <Chip variant="outlined" color="error" label="Disconnected" size="small" icon={<ReportProblemIcon />} />
        ),
    },
    {
      field: "masterSymbol",
      headerName: i18next.t("Master Symbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: false,
      type: "string",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "lastUpdatedAt",
      headerName: i18next.t("Last Updated", { ns: "ColumnsDefs" }),
      minWidth: 150,
      editable: false,
      type: "date",
      flex: 1,
      headerAlign: "left",
      align: "left",
      valueFormatter: (param: GridValueFormatterParams<Timestamp>) => {
        if (param.value) {
          return new Date(param.value.seconds * 1000).toLocaleString();
        }
        return "";
      },
    },
  ];
  return columns;
}
