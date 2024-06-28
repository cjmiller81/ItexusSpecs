import { IAdminUser } from "features/users/iAdminUser"

export const transformData = (data: IAdminUser[]): any[] => {
  return data.map(item => {
    const { avatarUrl, email, name, newsletter } = item.traits
    return {
      id: item.id,
      AvatarUrl: avatarUrl,
      FirstName: name.first,
      LastName: name.last,
      Email: email,
      Newsletter: newsletter,
      metadata_public: item.metadata_public,
    }
  })
}
