import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import { FifoSignalRow } from "./fifoSignalRow"
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
      headerName: "ATR Min",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "atrMax",
      headerName: "ATR Max",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula1Start",
      headerName: "Formula 1 Start",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula2Start",
      headerName: "Formula 2 Start",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula1Slope",
      headerName: "Formula 1 Slope",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "formula2Slope",
      headerName: "Formula 2 Slope",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "masterSymbol",
      headerName: "Tick ATR MEffect",
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "stopMultiple",
      headerName: "Tick ATR Multiple",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "targetMultiple",
      headerName: "Tick Base",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickAtrMEffect",
      headerName: "Tick Reset Percent",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickAtrMultiple",
      headerName: "Stop Multiple",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickBase",
      headerName: "Target Multiple",
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tickResetPercent",
      headerName: "Tick Reset Percent",
      minWidth: 100,
      editable: true,
      type: "number",
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
