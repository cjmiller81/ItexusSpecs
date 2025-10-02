import { TabContext, TabPanel } from "@mui/lab"
import TabList from "@mui/lab/TabList"
import { Box, Tab, styled } from "@mui/material"
import {
  ProfileContainer,
  ProfileDetails,
  ProfilePicture,
  SecurityContainer,
  addError,
  profileService,
  useAppDispatch,
  useOry,
} from "components"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function ProfilePage() {
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false)
  const [isProfileDetailsUpdating, setIsProfileDetailsUpdating] = useState<boolean>(false)
  const { onUpdateAvatar, session, onUpdateProfile } = useOry()
  const dispatch = useAppDispatch()

  const router = useRouter()
  const routeParams = (router.query.tab as string[]) || undefined

  const [value, setValue] = useState<string>(
    routeParams && (router.query.tab as string[]).length ? routeParams[0] : "details",
  )
  const { t } = useTranslation("ProfilePage")

  useEffect(() => {
    router.push(
      {
        pathname: `${value}`,
      },
      undefined,
      {
        shallow: true,
      },
    )
  }, [value, router])

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  const onAvatarChanged = async (file: File) => {
    setIsAvatarUploading(true)
    profileService
      .uploadAvatart(file)
      .then(url => onUpdateAvatar(url))
      .catch((error: any) => {
        const reason = error?.response?.data?.error?.reason
        if (reason) dispatch(addError({ message: reason }))
        else dispatch(addError({ message: t("AvatarUploadingError") }))
      })
      .finally(() => setIsAvatarUploading(false))
  }

  const onChangeDetails = (firstName: string, lastName: string) => {
    setIsProfileDetailsUpdating(true)
    onUpdateProfile(firstName, lastName)
      .then()
      .catch((error: any) => {
        const reason = error?.response?.data?.error?.reason
        if (reason) dispatch(addError({ message: reason }))
        else dispatch(addError({ message: t("ProfileUpdatingError") }))
      })
      .finally(() => setIsProfileDetailsUpdating(false))
  }

  return (
    <ProfileContainer title={t("UserProfile")}>
      <TabContext value={value}>
        <StyledTabList onChange={(_event, newValue) => handleChange(newValue)}>
          <Tab
            label={t("PROFILE")}
            value="details"
          />
          <Tab
            label={t("SECURITY")}
            value="security"
          />
        </StyledTabList>
        <TabPanel value="details">
          <StyledProfileBox>
            <ProfilePicture
              defaultAvatarSrc="/defaultAvatar.png"
              onAvatarChanged={onAvatarChanged}
              avatarUrl={session?.identity?.traits.avatarUrl}
              isAvatarUploading={isAvatarUploading}
              sx={{ width: "30%", minWidth: "200px" }}
            />
            <ProfileDetails
              onUpdateProfile={onChangeDetails}
              loadingCnangeDetails={isProfileDetailsUpdating}
              sx={{ width: "100%" }}
            />
          </StyledProfileBox>
        </TabPanel>
        <TabPanel value="security">
          <SecurityContainer />
        </TabPanel>
      </TabContext>
    </ProfileContainer>
  )
}

const StyledProfileBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}))

const StyledTabList = styled(TabList)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    " .MuiButtonBase-root": {
      minWidth: "20px",
      padding: "8px 12px",
    },
  },
}))
