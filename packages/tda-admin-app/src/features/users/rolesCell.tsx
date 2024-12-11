import React, { useEffect, useState } from "react"
import { useTheme } from "@mui/material/styles"
import { useTranslation } from "react-i18next"
import { useAppSelector, useAppDispatch } from "libs/redux/Store"
import { Box, Chip, Modal, Button, Typography, IconButton } from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import CancelIcon from "@mui/icons-material/Cancel"
import { setSelectedUserId } from "features/users/adminUsersSlice"

const RolesCell = ({ id, handleDeleteRole, fetchPermissions, setIsRoleModalOpen }) => {
  const [roles, setRoles] = useState<string[]>([])
  const [deleteRoleKey, setDeleteRoleKey] = useState<string | null>(null)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { adminUsers } = useAppSelector(state => state.adminUsers)
  const theme = useTheme()
  const { t } = useTranslation("ColumnsDefs")

  useEffect(() => {
    if (adminUsers && Array.isArray(adminUsers)) {
      const user = adminUsers.find(user => user.id === id)
      if (user && user.metadata_public && user.metadata_public.role) {
        setRoles(user.metadata_public.role.split(","))
      } else {
        setRoles([])
      }
    } else {
      setRoles([])
    }
  }, [adminUsers, id])

  const handleDeleteClick = (roleKey: string) => {
    setDeleteRoleKey(roleKey)
    setIsConfirmationOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteRoleKey) {
      await handleDeleteRole(id, deleteRoleKey)
      const updatedRoles = roles.filter(role => role !== deleteRoleKey)
      setRoles(updatedRoles)
      setIsConfirmationOpen(false)
      setDeleteRoleKey(null)
    }
  }

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false)
    setDeleteRoleKey(null)
  }

  const handleModalClose = () => {
    setIsConfirmationOpen(false)
  }

  const handleAddRoleClick = userId => {
    dispatch(setSelectedUserId(userId))
    fetchPermissions()
    setIsRoleModalOpen(true)
  }

  const renderMetadataChips = metadata_public => {
    if (!metadata_public) {
      return null
    }

    return Object.entries(metadata_public).map(([key, value], index) => (
      <Box
        key={index}
        sx={{ margin: 0.7 }}>
        <Chip
          label={key === value ? value : `${key}: ${value}`}
          onDelete={() => handleDeleteClick(key)}
          deleteIcon={<CancelIcon style={{ color: theme.palette.error.main }} />}
          variant="outlined"
          sx={{ borderRadius: "16px", padding: "4px 8px", marginRight: "8px" }}
        />
      </Box>
    ))
  }

  if (!adminUsers || !Array.isArray(adminUsers)) {
    return null
  }

  const user = adminUsers.find(user => user.id === id)
  const metadata_public = user ? user.metadata_public : {}

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <Box
        sx={{ alignItems: "center", overflowX: "auto", flexWrap: "wrap", gap: 1, flexGrow: 1, paddingRight: "40px" }}>
        {renderMetadataChips(metadata_public)}
      </Box>
      <Box sx={{ flexShrink: 0, marginLeft: "auto" }}>
        <IconButton
          size="small"
          onClick={() => handleAddRoleClick(id)}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Modal
        open={isConfirmationOpen}
        onClose={handleModalClose}
        aria-labelledby="delete-role-modal"
        aria-describedby="confirm-delete-role">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            borderRadius: "16px",
          }}>
          <Typography
            variant="h6"
            gutterBottom>
            {t("ConfirmDeletion", { ns: "ColumnsDefs" })}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom>
            {t("DeleteThisPermission", { ns: "ColumnsDefs" })}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmDelete}>
              {t("Confirm", { ns: "Common" })}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseConfirmation}>
              {t("Cancel", { ns: "Common" })}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default RolesCell
