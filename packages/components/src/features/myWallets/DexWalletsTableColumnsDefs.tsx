import Cancel from "@mui/icons-material/Cancel"
import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import RemoveRedEye from "@mui/icons-material/RemoveRedEye"
import Save from "@mui/icons-material/Save"
import { Checkbox, Fade, IconButton } from "@mui/material"
import { GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel } from "@mui/x-data-grid"
import i18next, { t } from "i18next"
import { ChangeEvent } from "react"
import { AppToolTip } from "../../components"
import { Wallet } from "../../models"
import CustomTooltip from "../../components/common/CustomTooltip"
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

interface ColumnsProps {
  handleSaveClick: (id: GridRowId) => void
  handleEditClick: (id: GridRowId) => void
  handleCancelClick: (id: GridRowId) => void
  handleDeleteClick: (id: GridRowId) => void
  onExpandClick: (id: GridRowId, expanded: boolean) => void
  gridRowModesModel: GridRowModesModel
  expandedRows: GridRowId[]
}

export const getDexWalletsColumns = ({
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
      headerName: i18next.t("WalletAddress", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: false,
      filterable: false,
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "walletName",
      headerName: i18next.t("WalletName", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: true,
      type: "text",
      filterable: false,
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "value",
      headerName: i18next.t("Value", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: true,
      type: "text",
      filterable: false,
      minWidth: 60,
      maxWidth: 120,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "isPersonal",
      headerName: i18next.t("PersonalPublic", { ns: "ColumnsDefs" }),
      sortable: false,
      editable: true,
      filterable: false,
      align: "center",
      width: 150,
      disableColumnMenu: true,
      renderEditCell: props => {
        const { id, value, api, field } = props
        const handleChange = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
          api.setEditCellValue({ id, field, value: checked })
        }

        return (
          <Checkbox
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
            <RemoveRedEye />
          </AppToolTip>
        ) : (
          <Checkbox
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
              icon={<Save />}
              label={t("Save", { ns: "Common" })}
              sx={{
                color: "primary.main",
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={1}
              icon={<Cancel />}
              label={i18next.t("Cancel", { ns: "Common" })}
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

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
      width: 50,
      renderCell: (params) => {
        const isExpanded = expandedRows.includes(params.id);
        return (
          <CustomTooltip title={t("ToggleView", { ns: "Common" })} arrow>
            <IconButton
              size="small"
              sx={{
                cursor: "pointer",
                pointerEvents: "auto",
                transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)",
                padding: 0.5
              }}
              onClick={(e) => {
                e.stopPropagation();
                onExpandClick(params.id, !isExpanded);
              }}
            >
              <ArrowBackIosNewOutlinedIcon
                sx={{
                  fontSize: 16,
                  "& path": {
                    stroke: "currentColor",
                    strokeWidth: 2,
                    fill: "currentColor",
                  },
                }}
              />
            </IconButton>
          </CustomTooltip>
        );
      }
    },
  ]
}
