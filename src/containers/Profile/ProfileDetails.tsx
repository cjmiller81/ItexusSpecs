import AppTextField from "@/components/common/inputs/AppTextField"
import { Box, BoxProps, Button, Stack } from "@mui/material"
import { ProfileContainer } from "./ProfileContainer"

export const ProfileDetails = ({ ...props }: BoxProps) => {
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
            label={"First Name"}
          />

          <AppTextField
            required
            label={"Last Name"}
          />
        </Stack>

        <AppTextField
          required
          label={"Email"}
        />
        <Button
          sx={{ alignSelf: "start", width: "30%", minWidth: "150px", mt: 2 }}
          variant={"contained"}>
          Change details
        </Button>
      </Box>
    </ProfileContainer>
  )
}
