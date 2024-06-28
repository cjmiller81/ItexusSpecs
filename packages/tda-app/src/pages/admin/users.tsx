import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import { fetchAdminUsers, updateAdminUser } from "features/users/adminUsersSlice"
import { useAppDispatch, useAppSelector } from "libs/redux/Store"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DataGrid, GridEventListener, GridRowEditStopReasons, GridRowModesModel } from "@mui/x-data-grid"
import { adminUsersService } from "features/users/adminUsersService"
import { IAdminUser } from "features/users/iAdminUser"
import { getColumns } from "features/users/usersColumnsDefs"

export default function Users() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const { adminUsers } = useAppSelector(state => state.adminUsers)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userId = router.query.userId ? router.query.userId[0] : undefined
  const [currentUser, setCurrentUser] = useState<IAdminUser | undefined>()
  const [permissions, setPermissions] = useState<string[]>([])
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAdminUsers())
  }, [dispatch])

  useEffect(() => {
    if (adminUsers && !currentUser) {
      const currentUser = adminUsers.find(user => user.id === userId)
      setCurrentUser(currentUser)
    }
  }, [adminUsers, userId])

  useEffect(() => {
    if (!currentUser) {
      const targetUrl = `/admin/users`
      if (router.asPath !== targetUrl) {
        router.push(targetUrl, undefined, { shallow: true })
      }
      return
    }
  }, [currentUser, router])

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const processRowUpdate = (newRow: IAdminUser) => {
    dispatch(updateAdminUser(newRow))
    return { ...newRow }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const fetchPermissions = async () => {
    try {
      const permissions = await adminUsersService.getPermissions()
      setPermissions(permissions)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteRole = async (userId: string, roleKey: string) => {
    try {
      const user = adminUsers.find(user => user.id === userId)
      if (!user) {
        throw new Error(`User with id ${userId} not found.`)
      }
      const updatedMetadataPublic = { ...user.metadata_public }
      delete updatedMetadataPublic[roleKey]
      const deleteRole = { [`metadata_public/${roleKey}`]: null }
      await adminUsersService.updateRoles(userId, deleteRole)
      dispatch(fetchAdminUsers())
    } catch (error) {
      console.error(error)
    }
  }

  const handleRoleModalSave = async (id: string, selectedPermission: string, roleValue: string) => {
    try {
      const roleKey = `metadata_public/${selectedPermission}`
      await adminUsersService.updateRoles(id, { [roleKey]: roleValue })
      fetchPermissions()
      dispatch(fetchAdminUsers())
      setIsRoleModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const columns = getColumns(
    handleDeleteRole,
    fetchPermissions,
    permissions,
    setIsRoleModalOpen,
    isRoleModalOpen,
    handleRoleModalSave,
  )

  return (
    <StyledRoot sx={{ padding: 0 }}>
      <DataGrid<IAdminUser>
        slots={{
          footer: () => <></>,
        }}
        rowSelection={false}
        checkboxSelection={false}
        sx={{
          borderColor: theme => theme.palette.divider,
          "& .MuiDataGrid-cell": {
            borderColor: theme => theme.palette.divider,
          },
          "& .MuiDataGrid-columnHeader": {
            borderColor: theme => theme.palette.divider,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottomColor: theme => theme.palette.divider,
          },
        }}
        rows={adminUsers}
        columns={columns}
        editMode="row"
        getRowId={row => row.id}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowHeight={() => "auto"}
      />
    </StyledRoot>
  )
}

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "inherit",
  },
}))
