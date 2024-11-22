import i18next from "@/libs/i18n/i18n";
import CancelIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Theme, lighten } from "@mui/system";
import { IUserAccountConnection } from "@/features/strategies/users/types";

export function getColumns(
  handleSaveClick: (id: GridRowId) => void,
  handleCancelClick: (id: GridRowId) => void,
  handleViewClick: (id: GridRowId) => void,
  handleSetSelection: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
  theme: Theme,
  currentUserId?: string,
) {
  const columns: GridColDef<IUserAccountConnection>[] = [
    {
      field: "actions",
      type: "actions",
      headerName: i18next.t("Details", { ns: "ColumnsDefs" }),
      maxWidth: 70,
      cellClassName: "actions",
      getActions: props => {
        const id = props.id;
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

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
            />,
          ];
        }

        const selectedIconColor = lighten(theme.palette.text.primary, 0.4);
        return [
          <GridActionsCellItem
            key="3"
            icon={
              <VisibilityIcon sx={{ fill: currentUserId !== id ? selectedIconColor : theme.palette.text.primary }} />
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
      field: "userId",
      headerName: i18next.t("Id", { ns: "ColumnsDefs" }),
      minWidth: 80,
      editable: true,
      type: "string",
      flex: 0,
    },
    {
      field: "exchangeUsername",
      headerName: i18next.t("ExchangeUsername", { ns: "ColumnsDefs" }),
      minWidth: 80,
      editable: true,
      type: "string",
      flex: 0,
    },
    {
      field: "status",
      headerName: i18next.t("ConnectionStatus", { ns: "ColumnsDefs" }),
      minWidth: 85,
      editable: true,
      type: "string",
      flex: 0,
      cellClassName: (param: GridCellParams<GridValidRowModel>) => {
        if (param.value === "Disconnected") {
          return "red";
        }
        return "";
      },
    },
  ];

  return columns;
}
