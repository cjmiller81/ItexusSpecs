import LoadingButton from "@mui/lab/LoadingButton"
import { Box, BoxProps, Stack } from "@mui/material"
import { Form, Formik } from "formik"
import i18n from "i18next"
import { useTranslation } from "react-i18next"
import { InferType, object, string } from "yup"
import { AppFormTextField, useOry } from "../../index"
import { ProfileContainer } from "./ProfileContainer"

const requiredError = i18n.t("mandatoryField", { ns: "ErrorMessages" })
const maxFieldLengthError = i18n.t("MaxFieldLengthError", { ns: "ErrorMessages", symbols: 50 })
const ProfileFormSchema = object({
  firstName: string()
    .required(requiredError)
    .min(1, requiredError)
    .max(50, maxFieldLengthError),
  lastName: string()
    .required(requiredError)
    .min(1, requiredError)
    .max(50, maxFieldLengthError),
  email: string(),
})

export type ProfileModel = InferType<typeof ProfileFormSchema>

type Props = BoxProps & {
  onUpdateProfile: (firstName: string, lastName: string) => void
  loadingCnangeDetails?: boolean
}

export const ProfileDetails = ({ onUpdateProfile, loadingCnangeDetails, ...props }: Props) => {
  const { t } = useTranslation("ProfileContainer")
  const { session } = useOry()

  const traits = session?.identity?.traits
  const firstName = traits?.name?.first ?? ""
  const lastName = traits?.name?.last ?? ""
  const email = traits?.email ?? ""

  return (
    <ProfileContainer
      title="Profile Details"
      contentBgColor="#f0ece5"
      {...props}>
      <Formik<ProfileModel>
        initialValues={{ firstName, lastName, email }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={ProfileFormSchema}
        onSubmit={data => {
          onUpdateProfile(data.firstName, data.lastName)
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
              inputProps={{
                disabled: true,
              }}
              required
              label={t("Email")}
            />
            <LoadingButton
              loading={loadingCnangeDetails}
              sx={{ alignSelf: "start", width: "30%", minWidth: "150px", mt: 2 }}
              variant={"contained"}
              type="submit">
              {t("ChangeDetails")}
            </LoadingButton>
          </Box>
        </Form>
      </Formik>
    </ProfileContainer>
  )
}
