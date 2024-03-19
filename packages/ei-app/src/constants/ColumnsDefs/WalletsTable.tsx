import { ExpandLess, ExpandMore } from "@mui/icons-material"
import DeleteIcon from "@mui/icons-material/Delete"
import { IconButton } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import i18next, { t } from "i18next"

i18next.setDefaultNamespace("ColumnsDefs")

export const getWalletsColumns = (): GridColDef[] => {
  return [
    {
      field: "address",
      headerName: t("WalletAddress"),
      sortable: false,
      editable: false,
      filterable: false,
      width: 500,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "trash",
      headerName: "",
      flex: 1,
      sortable: false,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 55,
      maxWidth: 55,
      renderCell: () => {
        return (
          <IconButton>
            <DeleteIcon />
          </IconButton>
        )
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
        return <IconButton>{props.row.expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
      },
    },
  ]
}
