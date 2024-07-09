import React, { useState, useEffect } from "react"
import { useTheme } from "@mui/material/styles"
import { Box, Modal, Typography, Button, Select, MenuItem, TextField } from "@mui/material"
import { useAppSelector } from "libs/redux/Store"
import { useTranslation } from "react-i18next"
import { SelectChangeEvent } from "@mui/material/Select"
import { adminUsersService } from "features/users/adminUsersService"

interface Customer {
  name: string
}

interface RoleModalProps {
  open: boolean
  onClose: () => void
  permissions: string[]
  handleRoleModalSave: (id: string | null, roleKey: string, roleValue: string) => void
}

const AddNewRoleModal: React.FC<RoleModalProps> = ({ open, onClose, permissions, handleRoleModalSave }) => {
  const [selectedPermission, setSelectedPermission] = useState<string>("")
  const [roleValue, setRoleValue] = useState<string>("")
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false)
  const [customers, setCustomers] = useState<string[]>([])
  const { t } = useTranslation("ColumnsDefs")
  const userId = useAppSelector(state => state.adminUsers.selectedUserId)
  const theme = useTheme()

  useEffect(() => {
    const fetchCustomers = async () => {
      if (selectedPermission === "CounterPartyId") {
        try {
          const response: Customer[] = await adminUsersService.getCustomers()
          const customerNames = response.map(customer => customer.name)
          setCustomers(customerNames)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchCustomers()
  }, [selectedPermission])

  const handlePermissionChange = (event: SelectChangeEvent<string>) => {
    const permission = event.target.value as string
    setSelectedPermission(permission)
    setRoleValue(permission === "CounterPartyId" ? "" : permission)
    setIsSaveEnabled(permission !== "")
  }

  const handleRoleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleValue(event.target.value)
    setIsSaveEnabled(!!event.target.value)
  }

  const handleCustomerChange = (event: SelectChangeEvent<string>) => {
    setRoleValue(event.target.value)
    setIsSaveEnabled(event.target.value !== "")
  }

  const handleSave = async () => {
    if (selectedPermission && roleValue) {
      handleRoleModalSave(userId, selectedPermission, roleValue)
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="role-modal-title"
      aria-describedby="role-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 24,
          p: 4,
          maxWidth: 420,
          width: "100%",
        }}>
        <Typography
          variant="h6"
          gutterBottom
          id="role-modal-title">
          {t("AddNewPermission", { ns: "ColumnsDefs" })}
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          id="role-modal-description">
          {t("SelectAPermission", { ns: "ColumnsDefs" })}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}>
          <Box sx={{ flexGrow: 1, minWidth: 100, width: { xs: "100%", sm: "auto" } }}>
            <Typography variant="body2">{t("Permission", { ns: "ColumnsDefs" })}</Typography>
            <Select
              value={selectedPermission}
              onChange={handlePermissionChange}
              fullWidth
              displayEmpty
              placeholder="Select Permission"
              sx={{ bgcolor: "background.default", color: "text.primary", minWidth: 50 }}>
              {permissions.map(permission => (
                <MenuItem
                  key={permission}
                  value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 200, width: { xs: "100%", sm: "auto" } }}>
            <Typography variant="body2">{t("Value", { ns: "ColumnsDefs" })}</Typography>
            {selectedPermission === "CounterPartyId" ? (
              <Select
                value={roleValue}
                onChange={handleCustomerChange}
                fullWidth
                displayEmpty
                placeholder="Select Customer"
                sx={{ bgcolor: "background.default", color: "text.primary" }}>
                {customers.map(customer => (
                  <MenuItem
                    key={customer}
                    value={customer}>
                    {customer}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                value={roleValue}
                onChange={handleRoleValueChange}
                fullWidth
                sx={{ bgcolor: "background.default", color: "text.primary" }}
                InputProps={{ style: { color: theme.palette.text.primary } }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}>
            {t("Cancel", { ns: "Common" })}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isSaveEnabled}
            sx={{
              ml: 2,
              bgcolor: isSaveEnabled ? theme.palette.primary.main : theme.palette.action.disabledBackground,
              color: isSaveEnabled ? theme.palette.primary.contrastText : theme.palette.text.disabled,
            }}>
            {t("Add", { ns: "Common" })}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddNewRoleModal
