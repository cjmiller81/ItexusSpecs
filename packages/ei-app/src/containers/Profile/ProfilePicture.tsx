import { Box, BoxProps, Button, Typography } from "@mui/material"
import React from "react"
import { useTranslation } from "react-i18next"
import { useFilePicker } from "use-file-picker"
import { FileAmountLimitValidator, FileTypeValidator } from "use-file-picker/validators"
import { ProfileContainer } from "./ProfileContainer"

export const ProfilePicture = ({ ...props }: BoxProps) => {
  const { t } = useTranslation("ProfilePicture")
  const { openFilePicker, filesContent, errors } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [new FileAmountLimitValidator({ max: 1 }), new FileTypeValidator(["jpg", "png"])],
  })

  const imgPath =
    filesContent.length && !errors.length ? filesContent[0].content : "https://mui.com/static/images/avatar/1.jpg"
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
        <img
          loading="lazy"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
          alt="Avatar"
          src={imgPath}
        />
        <Typography
          textAlign={"center"}
          variant="body1">
          {t("UploadChangeImage")}
        </Typography>
        <Button
          sx={{ minWidth: "140px" }}
          variant="contained"
          onClick={() => openFilePicker()}>
          {t("UploadAvatar")}
        </Button>
      </Box>
    </ProfileContainer>
  )
}
