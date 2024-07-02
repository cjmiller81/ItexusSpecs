import React from "react"
import { Avatar } from "@mui/material"
import { useAppSelector } from "libs/redux/Store"

interface AdminUserAvatarProps {
  id: string | undefined
}

const AdminUserAvatar: React.FC<AdminUserAvatarProps> = ({ id }) => {
  const { adminUsers } = useAppSelector(state => state.adminUsers)
  const user = adminUsers.find(user => user.id === id)
  const avatarUrl = user?.AvatarUrl || ""

  return (
    <Avatar
      alt="User Avatar"
      src={avatarUrl}
    />
  )
}

export default AdminUserAvatar
