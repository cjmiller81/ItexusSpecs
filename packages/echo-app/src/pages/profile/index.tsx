import { TabContext, TabPanel } from "@mui/lab"
import TabList from "@mui/lab/TabList"
import { Box, Tab, styled } from "@mui/material"
import { BillingContainer, ProfileContainer, ProfileDetails, ProfilePicture, SecurityContainer, WalletsContainer } from "components"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function ProfilePage() {
  const [value, setValue] = useState<string>("1")

  const { t } = useTranslation("ProfilePage")
  const handleChange = (newValue: string) => {
    //eslint-disable-next-line no-unused-vars
    setValue(newValue)
  }

  return (
    <ProfileContainer title={t("UserProfile")}>
      <TabContext value={value}>
        <StyledTabList onChange={(_event, newValue) => handleChange(newValue)}>
          <Tab
            label={t("PROFILE")}
            value="1"
          />
          <Tab
            label={t("SECURITY")}
            value="2"
          />
          <Tab
            label={t("WALLETS")}
            value="3"
          />
          <Tab
            label={t("BILLING")}
            value="4"
          />
        </StyledTabList>
        <TabPanel value="1">
          <StyledProfileBox>
            <ProfilePicture sx={{ width: "30%", minWidth: "200px" }} />
            <ProfileDetails sx={{ width: "100%" }} />
          </StyledProfileBox>
        </TabPanel>
        <TabPanel value="2">
          <SecurityContainer />
        </TabPanel>
        <TabPanel value="3">
          <WalletsContainer />
        </TabPanel>
        <TabPanel value="4">
          <BillingContainer />
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
