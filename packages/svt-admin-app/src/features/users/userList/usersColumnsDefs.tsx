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
import { Theme, lighten, Box } from "@mui/system";
import { IUserAccountConnection } from "@/features/strategies/users/types";

export function getColumns(
  handleSaveClick: (id: GridRowId) => void,
  handleCancelClick: (id: GridRowId) => void,
  handleViewClick: (id: GridRowId) => void,
  handleSetSelection: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
  theme: Theme,
  currentUserId?: string,
  isMobile?: boolean,
) {
  const columns: GridColDef<IUserAccountConnection>[] = [
    {
      field: "actions",
      type: "actions",
      headerName: i18next.t("Details", { ns: "ColumnsDefs" }),
      maxWidth: 90,
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
      minWidth: isMobile ? 60 : 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "exchangeUsername",
      headerName: i18next.t("ExchangeUsername", { ns: "ColumnsDefs" }),
      minWidth: isMobile ? 80 : 120,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "status",
      headerName: i18next.t("ConnectionStatus", { ns: "ColumnsDefs" }),
      minWidth: 125,
      editable: true,
      type: "string",
      flex: 1,
      cellClassName: (params: GridCellParams<GridValidRowModel>) =>
        params.value === "disconnected" ? "disconnected-cell" : "",
      renderCell: (params: GridCellParams<GridValidRowModel>) => {
        const value = params.value as string;
        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              mr: "10px",
              bgcolor: value === "disconnected" ? "red" : "inherit",
              color: value === "disconnected" ? "white" : "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}>
            {value}
          </Box>
        );
      },
    },
  ];

  return columns;
}
