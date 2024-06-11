import i18next from "@/libs/i18n/i18n"
import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import { IFifoUser } from "./iFifoUser"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Theme, lighten } from "@mui/system"

export function getColumns(
  handleSaveClick: (id: GridRowId) => void,
  handleEditClick: (id: GridRowId) => void,
  handleDeleteClick: (id: GridRowId) => void,
  handleCancelClick: (id: GridRowId) => void,
  handleViewClick: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
  theme: Theme,
  currentUserId?: string
) {
  const columns: GridColDef<IFifoUser>[] = [
    {
      field: "id",
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
      field: "connectionStatus",
      headerName: i18next.t("ConnectionStatus", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "botCount",
      headerName: i18next.t("BotCount", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
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
            key="4"
            icon={<EditIcon />}
            label={i18next.t("Edit", { ns: "Common" })}
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="5"
            icon={<DeleteIcon />}
            label={i18next.t("Delete", { ns: "Common" })}
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="3"
            icon={<VisibilityIcon sx={{fill: currentUserId !== id ? selectedIconColor : theme.palette.text.primary}} />}
            label={i18next.t("View", { ns: "Common" })}
            className="textPrimary"
            onClick={() => handleViewClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return columns
}
