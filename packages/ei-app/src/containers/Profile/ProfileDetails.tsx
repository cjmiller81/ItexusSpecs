import { Box, BoxProps, Button, Stack } from "@mui/material"
import { useOry } from "components"
import { Form, Formik } from "formik"
import { useTranslation } from "react-i18next"
import { InferType, object, string } from "yup"
import { ProfileContainer } from "./ProfileContainer"
import AppFormTextField from "@/components/common/FormInputs/AppFormTextField"

const ProfileFormSchema = object({
  firstName: string(),
  lastName: string(),
  email: string(),
})

export type ProfileModel = InferType<typeof ProfileFormSchema>

export const ProfileDetails = ({ ...props }: BoxProps) => {
  const { t } = useTranslation("ProfileContainer")
  const { session } = useOry()

  return (
    <ProfileContainer
      title="Profile Details"
      {...props}>
      <Formik<ProfileModel>
        initialValues={{
          firstName: session?.identity?.traits.name.first,
          lastName: session?.identity?.traits.name.last,
          email: session?.identity?.traits.email,
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={ProfileFormSchema}
        onSubmit={data => {
          console.log(data)
        }}>
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pl: 2, pr: 2 }}>
            <Stack
              direction={{ sm: "column", md: "row" }}
              spacing={2}>
              <AppFormTextField
                name="firstName"
                required
                inputProps={{}}
                label={t("FirstName")}
              />
              <AppFormTextField
                name="lastName"
                required
                disabled
                label={t("LastName")}
              />
            </Stack>
            <AppFormTextField
              name="email"
              required
              label={t("Email")}
            />
            <Button
              sx={{ alignSelf: "start", width: "30%", minWidth: "150px", mt: 2 }}
              variant={"contained"}
              type="submit">
              {t("ChangeDetails")}
            </Button>
          </Box>
        </Form>
      </Formik>
    </ProfileContainer>
  )
}
