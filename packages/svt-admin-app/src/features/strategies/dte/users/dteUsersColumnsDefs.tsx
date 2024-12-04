import i18next from "@/libs/i18n/i18n"
import CancelIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import { 
  GridActionsCellItem,
  GridCellParams, 
  GridColDef, 
  GridRenderCellParams, 
  GridRowId, 
  GridRowModes, 
  GridRowModesModel, 
  GridValidRowModel, 
  GridValueFormatterParams, 
} from "@mui/x-data-grid"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Theme, lighten } from "@mui/system"
import { IDteStrategy, ITimestamp, ITradeQuantity } from "./types"
import { Chip } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DeleteIcon from '@mui/icons-material/Delete';

export function getColumns(
  handleSaveClick: (id: GridRowId) => void,
  handleEditClick: (id: GridRowId) => void,
  handleDeleteClick: (id: GridRowId) => void,
  handleCancelClick: (id: GridRowId) => void,
  handleViewClick: (id: GridRowId) => void,
  handleSetSelection: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
  theme: Theme,
  currentUserId?: string
) {
  const columns: GridColDef<IDteStrategy>[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Details",
      width: 60,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="0"
              icon={<SaveIcon />}
              label={i18next.t("Save", { ns: "Common" })}
              sx={{
                color: "primary.main",
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="3"
              icon={<CancelIcon />}
              label={i18next.t("Cancel", { ns: "Common" })}
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />
          ]
        }
        
        const selectedIconColor = lighten(theme.palette.text.primary, 0.4)
        return [
          <GridActionsCellItem
            key="3"
            icon={<VisibilityIcon sx={{fill: currentUserId !== id ? selectedIconColor : theme.palette.text.primary}} />}
            label={i18next.t("View", { ns: "Common" })}
            className="textPrimary"
            onClick={() => 
              { 
                handleViewClick(id);
                handleSetSelection(id);
              }
            }
            color="inherit"
          />,
        ]
      },
    },
    {
      field: "userId",
      headerName: i18next.t("Id", { ns: "ColumnsDefs" }),
      minWidth: 140,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "exchangeUsername",
      headerName: i18next.t("ExchangeUsername", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "accountNumber",
      headerName: i18next.t("AccountNumber", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "connectionStatus",
      headerName: i18next.t("Connected", { ns: "ColumnsDefs" }),
      minWidth: 120,
      editable: true,
      type: "boolean",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value) {
          return <Chip 
                    variant="outlined" 
                    color="success" 
                    label={i18next.t("Connected", { ns: "ColumnsDefs" })} 
                    size="small" 
                    icon={<CheckIcon />} 
                    sx={{ color: "#85a560", border: "1px solid" }}/>;
        } else {
          return <Chip 
                    variant="outlined" 
                    color="error" 
                    label={i18next.t("Disconnected", { ns: "ColumnsDefs" })}
                    size="small" 
                    icon={<ReportProblemIcon />} />;
        }
      },
    },
    {
      field: "removed",
      headerName: i18next.t("Removed", { ns: "ColumnsDefs" }),
      minWidth: 110,
      editable: true,
      type: "boolean",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value) {
          return <Chip 
                    variant="outlined" 
                    color="error" 
                    label={i18next.t("Removed", { ns: "ColumnsDefs" })}
                    size="small" 
                    icon={<DeleteIcon />}/>;
        } else {
          return <></>
        }
      },
    },
    {
      field: "active",
      headerName: i18next.t("Active", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "boolean",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value) {
          return <Chip 
                    variant="outlined" 
                    color="success" 
                    label={i18next.t("Active", { ns: "ColumnsDefs" })}
                    size="small" 
                    icon={<CheckIcon />} 
                    sx={{ color: "#85a560", border: "1px solid" }}/>;
        } else {
          return <Chip 
                    variant="outlined" 
                    color="error" 
                    label={i18next.t("Inactive", { ns: "ColumnsDefs" })}
                    size="small" 
                    icon={<ReportProblemIcon />} />;
        }
      },
    },
    {
      field: "botStatus",
      headerName: i18next.t("BotStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
      cellClassName: (param: GridCellParams<GridValidRowModel>) => {
        if (param.value && (param.value as string).toLowerCase().indexOf("error") > -1) {
          return "dark-yellow"
        }
        return "";
      }
    },
    {
      field: "lastUpdatedAt",
      headerName: i18next.t("LastUpdated", { ns: "ColumnsDefs" }),
      minWidth: 150,
      editable: true,
      type: "date",
      flex: 1,
      valueFormatter: (param: GridValueFormatterParams<ITimestamp>) => {
        if (param.value) {
          return new Date(param.value.seconds * 1000).toLocaleString()
        }
        return "";
      }
    },
    {
      field: "tradeQty",
      headerName: i18next.t("TradeQty", { ns: "ColumnsDefs" }),
      minWidth: 140,
      editable: true,
      type: "number",
      flex: 1,
      valueFormatter: (param: GridValueFormatterParams<ITradeQuantity>) => {
        if(param.value) {
          return Number(`${param.value.units}.${param.value.nanos}`)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return null;
      },
    },
    {
      field: "entryOrderStatus",
      headerName: i18next.t("EntryStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "nextEntryTimestamp",
      headerName: i18next.t("NextEntryTime", { ns: "ColumnsDefs" }),
      minWidth: 150,
      editable: true,
      type: "date",
      flex: 1,
      valueFormatter: (param: GridValueFormatterParams<ITimestamp>) => {
        if (param.value) {
          return new Date(param.value.seconds * 1000).toLocaleString()
        }
        return "";
      }
    },
    {
      field: "targetOrderStatus",
      headerName: i18next.t("TargetStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "stopOrderStatus",
      headerName: i18next.t("CloseStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "nextEndOfDayCloseTimestamp",
      headerName: i18next.t("EndofDayCloseTime", { ns: "ColumnsDefs" }),
      minWidth: 150,
      editable: true,
      type: "date",
      flex: 1,
      valueFormatter: (param: GridValueFormatterParams<ITimestamp>) => {
        if (param.value) {
          return new Date(param.value.seconds * 1000).toLocaleString()
        }
        return "";
      }
    },
    {
      field: "userMessage",
      headerName: i18next.t("Message", { ns: "ColumnsDefs" }),
      minWidth: 150,
      editable: true,
      type: "string",
      flex: 1,
    }
  ]

  return columns
}