import { Avatar, Box, BoxProps, Button, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useFilePicker } from "use-file-picker"
import { FileAmountLimitValidator, FileTypeValidator } from "use-file-picker/validators"
import { ProfileContainer } from "./ProfileContainer"
import { useEffect } from "react"
import { LoadingButton } from "@mui/lab"

type Props = BoxProps & {
  onAvatarChanged: (file: File) => void
  isAvatarUploading?: boolean,
  avatarUrl?: string,
  defaultAvatarSrc?: string
}

export const ProfilePicture = ({onAvatarChanged, isAvatarUploading, defaultAvatarSrc, avatarUrl, ...props }: Props) => {
  const { t } = useTranslation("ProfilePicture")
  const { openFilePicker, filesContent, errors, plainFiles } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [new FileAmountLimitValidator({ max: 1 }), new FileTypeValidator(["jpg", "png", "jpeg"])],
  })

  useEffect(() => {
    if(plainFiles && plainFiles.length){
      onAvatarChanged(plainFiles[0])
    }
  }, [filesContent])

  return (
    <ProfileContainer
      title="Profile Picture"
      {...props}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          pl: 3,
          pr: 3,
        }}>
        <Avatar
          sx={{ width: 80, height: 80 }}
          style={{ borderRadius: "50%" }}
          alt="Avatar"
          src={avatarUrl || defaultAvatarSrc}></Avatar>
        <Typography
          textAlign={"center"}
          variant="body1">
          {t("UploadChangeImage")}
        </Typography>
        <LoadingButton
          loading={isAvatarUploading}
          sx={{ minWidth: "140px" }}
          variant="contained"
          onClick={() => openFilePicker()}>
          {t("UploadAvatar")}
        </LoadingButton>
      </Box>
    </ProfileContainer>
  )
}
