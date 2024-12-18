import i18next from "@/libs/i18n/i18n"
import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import { GridActionsCellItem, GridCellParams, GridColDef, GridRowId, GridRowModes, GridRowModesModel, GridTreeNodeWithRender, GridValidRowModel, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid"
import { IvlUser } from "./IvlUser"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Theme, lighten, useTheme } from "@mui/system"
import moment from "moment"
import { ITradeQuantity } from "../../dte/users/types"

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
  const columns: GridColDef<IvlUser>[] = [
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
      minWidth: 100,
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
      headerName: i18next.t("ConnectionStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
      cellClassName: (param: GridCellParams<GridValidRowModel>) => {
        if (param.value === "Disconnected") {
          return "red"
        }
        return "";
      }
    },
    {
      field: "botStatus",
      headerName: i18next.t("BotStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
      cellClassName: (param: GridCellParams<GridValidRowModel>) => {
        if (param.value === "error" || param.value === "" || param.value === " ") {
          return "dark-yellow"
        }
        return "";
      }
    },
    {
      field: "lastUpdatedAt",
      headerName: i18next.t("Last Updated", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
      valueGetter: (param) => {
        if (param.row.lastUpdatedAt?.seconds === 0) {
          return null;
        }

        return (param.value && param.value?.seconds) ? moment.unix(param.value.seconds).toDate() : "";
      }
    },
    {
      field: "tradeQty",
      headerName: i18next.t("OpenQty", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
      valueFormatter: (param: GridValueFormatterParams<ITradeQuantity>) => {
        if(param.value) {
          return param.value.units;
        }
        return null;
      },
    },
  ]

  return columns
}
