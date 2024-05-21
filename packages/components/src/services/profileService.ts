import { appAxios } from "../lib/axios/customAxios"

export const profileService = {
  uploadAvatart: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await appAxios.post<{ imageUrl: string }>(`/api/upload/image`, formData)
    return response.data.imageUrl
  },
}
