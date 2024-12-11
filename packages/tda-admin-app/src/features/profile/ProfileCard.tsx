import CircularLoader from "@/components/CircularLoader"
import CameraOutlined from "@ant-design/icons/CameraOutlined"
import MoreOutlined from "@ant-design/icons/MoreOutlined"
import Box from "@mui/material/Box"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useTheme } from "@mui/material/styles"
import Avatar from "components/@extended/Avatar"
import IconButton from "components/@extended/IconButton"
import MainCard from "components/MainCard"
import { ThemeMode } from "config"
import useUser from "hooks/useUser"
import NextLink from "next/link"
import React, { ChangeEvent, useEffect, useState } from "react"
import ProfileCardMenu from "./ProfileCardMenu"
import { useTranslation } from "react-i18next"
interface Props {
  focusInput: () => void
  onChangeAvatar: (file: File) => void
  avatarLoading?: boolean
  isAvatarLoading?: boolean
}

export default function ProfileCard({ focusInput, onChangeAvatar, isAvatarLoading }: Props) {
  const theme = useTheme()
  const user = useUser()
  const {t} = useTranslation("ProfileCard")
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)

  useEffect(() => {
    if (selectedImage) {
      onChangeAvatar(selectedImage)
    }
  }, [selectedImage])

  const [anchorEl, setAnchorEl] = useState<Element | (() => Element) | null | undefined>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <MainCard>
      <Grid
        container
        spacing={6}>
        <Grid
          item
          xs={12}>
          <Stack
            direction="row"
            justifyContent="flex-end">
            <IconButton
              variant="light"
              color="secondary"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}>
              <MoreOutlined />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}>
              <NextLink
                href="/profile/details"
                passHref
                legacyBehavior>
                <MenuItem
                  onClick={() => {
                    handleClose()
                    setTimeout(() => {
                      focusInput()
                    })
                  }}>
                  {t("Edit", { ns: "Common" })}
                </MenuItem>
              </NextLink>
              <MenuItem
                onClick={handleClose}
                disabled>
                {t("Delete", { ns: "Common" })}
              </MenuItem>
            </Menu>
          </Stack>
          <Stack
            spacing={2.5}
            alignItems="center">
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
                "&:hover .MuiBox-root": { opacity: 1 },
                cursor: "pointer",
              }}>
              {isAvatarLoading ? (
                <Avatar sx={{ width: 124, height: 124, border: "1px dashed" }}>
                  <CircularLoader />
                </Avatar>
              ) : (
                user && (
                  <Avatar
                    alt={user.name}
                    src={user.thumb}
                    sx={{ width: 124, height: 124, border: "1px dashed" }}
                  />
                )
              )}
              {!isAvatarLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    background: theme.palette.mode === ThemeMode.DARK ? "rgba(255, 255, 255, .75)" : "rgba(0,0,0, .65)",
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Stack
                    spacing={0.5}
                    alignItems="center">
                    <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: "2rem" }} />
                    <Typography sx={{ color: "secondary.lighter" }}>Upload</Typography>
                  </Stack>
                </Box>
              )}
            </FormLabel>
            {!isAvatarLoading && (
              <TextField
                type="file"
                id="change-avtar"
                placeholder="Outlined"
                variant="outlined"
                sx={{ display: "none" }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
              />
            )}
            {user && (
              <Stack
                spacing={0.5}
                alignItems="center">
                <Typography variant="h5">{user.name}</Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
        <Grid
          item
          sm={3}
          sx={{ display: { sm: "block", md: "none" } }}
        />
        <Grid
          item
          xs={12}>
          <ProfileCardMenu />
        </Grid>
      </Grid>
    </MainCard>
  )
}
