import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import { FifoSignalRow } from "./fifoSignalRow"
import i18next from "@/libs/i18n/i18n"

export function getColumns(
  handleSaveClick: (id: GridRowId) => void,
  handleEditClick: (id: GridRowId) => void,
  handleDeleteClick: (id: GridRowId) => void,
  handleCancelClick: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
) {
  const columns: GridColDef<FifoSignalRow>[] = [
    {
      field: "atrMin",
      headerName: i18next.t("ATRMin", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "atrMax",
      headerName: i18next.t("ATRMax", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula1Start",
      headerName: i18next.t("Formula1Start", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula2Start",
      headerName: i18next.t("Formula2Start", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula1Slope",
      headerName: i18next.t("Formula1Slope", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula2Slope",
      headerName: i18next.t("Formula2Slope", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickAtrMEffect",
      headerName: i18next.t("TickATRMEffect", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickAtrMultiple",
      headerName: i18next.t("TickATRMultiple", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickBase",
      headerName: i18next.t("TickBase", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickResetPercent",
      headerName: i18next.t("TickResetPercent", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "stopMultiple",
      headerName: i18next.t("StopMultiple", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "targetMultiple",
      headerName: i18next.t("TargetMultiple", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "masterSymbol",
      headerName:i18next.t("Symbol", {ns : "ColumnsDefs"}),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return columns
}
