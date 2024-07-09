import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "libs/redux/Store"
import { useRouter } from "next/router"
import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import { fetchAdminUsers } from "features/users/adminUsersSlice"
import { adminUsersService } from "features/users/adminUsersService"
import { IAdminUser, TableColumnTitles } from "features/users/iAdminUser"
import AddNewRoleModal from "features/users/addNewRoleModal"
import { UsersTable } from "features/users/usersTable"

export default function Users() {
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

  const handleRoleModalSave = async (id: string | null, selectedPermission: string, roleValue: string) => {
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

  const handleRoleModalClose = () => {
    setIsRoleModalOpen(false)
  }

  const transformedAdminUsers: TableColumnTitles[] = adminUsers.map(user => ({
    id: user.id,
    AvatarUrl: user.AvatarUrl || "",
    FirstName: user.FirstName,
    LastName: user.LastName,
    Email: user.Email,
    Newsletter: user.Newsletter,
    permissions: {
      IsFifoAdmin: user.metadata_public?.IsFifoAdmin,
      IsFifoUser: user.metadata_public.IsFifoUser,
      role: user.metadata_public.role,
      TalosCanAdminUsers: user.metadata_public?.TalosCanAdminUsers,
    },
    title: "",
    field: "",
  }))

  return (
    <StyledRoot sx={{ padding: 0 }}>
      <UsersTable
        id={userId}
        rows={transformedAdminUsers}
        handleDeleteRole={handleDeleteRole}
        fetchPermissions={fetchPermissions}
        permissions={permissions}
        setIsRoleModalOpen={setIsRoleModalOpen}
        isRoleModalOpen={isRoleModalOpen}
        handleRoleModalSave={handleRoleModalSave}
      />

      <AddNewRoleModal
        open={isRoleModalOpen}
        onClose={handleRoleModalClose}
        permissions={permissions}
        handleRoleModalSave={handleRoleModalSave}
      />
    </StyledRoot>
  )
}

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
}))
