import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { IconButton } from "@mui/material"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import i18next, { t } from "i18next"
import { IExchange } from "../../models"

interface ColumnsProps {
  handleEditClick: (id: GridRowId) => void
  handleDeleteClick: (id: GridRowId) => void
  onExpandClick: (id: GridRowId, expanded: boolean) => void
  expandedRows: GridRowId[]
}

export const getExchangeAccountColumns = ({
    handleEditClick,
    handleDeleteClick,
    expandedRows,
    onExpandClick,
  }: ColumnsProps): GridColDef<IExchange>[] => {
  return [
    {
      field: "name",
      headerName: i18next.t("ExchangeAccountName", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      minWidth: 300,
      flex: 1,
      disableColumnMenu: false,
    },
    {
        field: "actions",
        type: "actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
  
          return [
            <GridActionsCellItem
              key={2}
              icon={<Edit />}
              label={t("Edit", { ns: "Common" })}
              className="textPrimary"
              onClick={() => handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key={3}
              icon={<Delete />}
              label={t("Delete", { ns: "Common" })}
              onClick={() => handleDeleteClick(id)}
              color="inherit"
            />,
          ]
        },
      },
      {
        field: "expand",
        headerName: "",
        sortable: false,
        editable: false,
        filterable: false,
        disableColumnMenu: true,
        minWidth: 55,
        maxWidth: 55,
        renderCell: props => {
          const isExpanded = expandedRows.includes(props.id)
          return (
            <IconButton onClick={() => onExpandClick(props.id, !isExpanded)}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )
        },
      },
    
  ]
}
