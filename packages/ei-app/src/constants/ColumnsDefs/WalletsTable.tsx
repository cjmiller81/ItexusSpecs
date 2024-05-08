import { AppToolTip } from "components"
import { Wallet } from "components"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import SaveIcon from "@mui/icons-material/Save"
import { Checkbox, Fade, IconButton } from "@mui/material"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import i18next, { t } from "i18next"
import { ChangeEvent } from "react"

i18next.setDefaultNamespace("ColumnsDefs")

interface ColumnsProps {
  handleSaveClick: (id: GridRowId) => void
  handleEditClick: (id: GridRowId) => void
  handleCancelClick: (id: GridRowId) => void
  handleDeleteClick: (id: GridRowId) => void
  onExpandClick: (id: GridRowId, expanded: boolean) => void
  gridRowModesModel: GridRowModesModel
  expandedRows: GridRowId[]
}

export const getWalletsColumns = ({
  handleSaveClick,
  handleEditClick,
  handleCancelClick,
  handleDeleteClick,
  gridRowModesModel,
  expandedRows,
  onExpandClick,
}: ColumnsProps): GridColDef<Wallet>[] => {
  return [
    {
      field: "address",
      headerName: t("WalletAddress"),
      sortable: false,
      editable: false,
      filterable: false,
      width: 400,
      disableColumnMenu: true,
    },
    {
      field: "walletName",
      headerName: t("WalletName"),
      sortable: false,
      editable: true,
      type: "text",
      filterable: false,
      width: 500,
      flex: 1,
      disableColumnMenu: true,
    },

    {
      field: "isPersonal",
      headerName: t("PersonalPublic"),
      sortable: false,
      editable: true,
      filterable: false,
      width: 80,
      disableColumnMenu: true,
      renderEditCell: props => {
        const { id, value, api, field } = props
        const handleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
          api.setEditCellValue({ id, field, value: checked })
        }

        return (
          <Checkbox
            sx={{ ml: "11px" }}
            onChange={handleChange}
            checked={value}></Checkbox>
        )
      },
      renderCell: props => {
        return !props.row.isPersonal ? (
          <AppToolTip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 200 }}
            title={t("PublicEye", { ns: "Tooltips" })}>
            <RemoveRedEyeIcon sx={{ ml: "20px" }} />
          </AppToolTip>
        ) : (
          <Checkbox
            sx={{ ml: "11px" }}
            disabled={true}
            checked={props.row.isPersonal}></Checkbox>
        )
      },
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = gridRowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={0}
              icon={<SaveIcon />}
              label={t("Save", { ns: "Common" })}
              sx={{
                color: "primary.main",
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={1}
              icon={<CancelIcon />}
              label={t("Cancel", { ns: "Common" })}
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key={2}
            icon={<EditIcon />}
            label={t("Edit", { ns: "Common" })}
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={3}
            icon={<DeleteIcon />}
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
