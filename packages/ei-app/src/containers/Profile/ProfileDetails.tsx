import AppTextField from "@/components/common/inputs/AppTextField"
import { Box, BoxProps, Button, Stack } from "@mui/material"
import { ProfileContainer } from "./ProfileContainer"
import { useTranslation } from "react-i18next"

export const ProfileDetails = ({ ...props }: BoxProps) => {
  const { t } = useTranslation("ProfileContainer")
  return (
    <ProfileContainer
      title="Profile Details"
      {...props}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pl: 2, pr: 2 }}>
        <Stack
          direction={{ sm: "column", md: "row" }}
          spacing={2}>
          <AppTextField
            required
            label={t("FirstName")}
          />

          <AppTextField
            required
            label={t("LastName")}
          />
        </Stack>

        <AppTextField
          required
          label={t("Email")}
        />
        <Button
          sx={{ alignSelf: "start", width: "30%", minWidth: "150px", mt: 2 }}
          variant={"contained"}>
          {t("ChangeDetails")}
        </Button>
      </Box>
    </ProfileContainer>
  )
}
