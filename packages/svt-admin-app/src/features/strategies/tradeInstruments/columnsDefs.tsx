import i18next from "@/libs/i18n/i18n"
import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import { TradeInstrumentsRow } from "./tradeInstrumentsRow"
import { symbolListOptions } from "../../../mocks/symbolListOptions"

export function getColumns(
  handleSaveClick: (id: GridRowId) => void,
  handleEditClick: (id: GridRowId) => void,
  handleDeleteClick: (id: GridRowId) => void,
  handleCancelClick: (id: GridRowId) => void,
  rowModesModel: GridRowModesModel,
) {

  const columns: GridColDef<TradeInstrumentsRow>[] = [
    {
      field: "masterSymbol",
      headerName: i18next.t("MasterSymbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "singleSelect",
      valueOptions: symbolListOptions
    },
    {
      field: "masterTickATRMultiple",
      headerName: i18next.t("MasterTickATRMultiple", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "atrPeriod",
      headerName: i18next.t("AtrPeriod", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "tradeSymbol",
      headerName: i18next.t("TradeSymbol", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      flex: 1,
      type: "singleSelect",
      valueOptions: symbolListOptions,
    },
    {
      field: "targetMultiple",
      headerName: i18next.t("TargetMultiple", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "stopMultiple",
      headerName: i18next.t("StopMultiple", { ns: "ColumnsDefs" }),
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
              key="0"
              icon={<SaveIcon />}
              label={i18next.t("Save", { ns: "Common" })}
              sx={{
                color: "primary.main",
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="1"
              icon={<CancelIcon />}
              label={i18next.t("Cancel", { ns: "Common" })}
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key="2"
            icon={<EditIcon />}
            label={i18next.t("Edit", { ns: "Common" })}
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="3"
            icon={<DeleteIcon />}
            label={i18next.t("Delete", { ns: "Common" })}
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return columns
}
