import Box from "@mui/material/Box"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import InputLabel from "@mui/material/InputLabel"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { Form, Formik } from "formik"
import { useRef } from "react"
import useUser from "@/hooks/useUser"
import i18n from "@/libs/i18n/i18n"
import { LoadingButton } from "@mui/lab"
import MainCard from "components/MainCard"
import { useTranslation } from "react-i18next"
import { InferType, object, string } from "yup"

const requiredError = i18n.t("mandatoryField", { ns: "ErrorMessages" })
const maxFieldLengthError = i18n.t("MaxFieldLengthError", { ns: "ErrorMessages", symbols: 50 })
const ProfileFormSchema = object({
  firstName: string().required(requiredError).min(1, requiredError).max(50, maxFieldLengthError),
  lastName: string().required(requiredError).min(1, requiredError).max(50, maxFieldLengthError),
  email: string(),
})

export type ProfileModel = InferType<typeof ProfileFormSchema>

type Props = {
  onProfileUpdated: ({ firstName, lastName }: ProfileModel) => void
  isProfileUpdating: boolean
}
export default function ProfileEditSection({ onProfileUpdated, isProfileUpdating }: Props) {
  const { firstName, lastName, email } = useUser()
  const inputRef = useRef()
  const { t } = useTranslation("ProfileEditSection")

  const onChangeDetails = ({ firstName, lastName, email }: ProfileModel) => {
    onProfileUpdated({ firstName, lastName, email })
  }

  return (
    <MainCard
      content={false}
      title={t("PersonalInformation")}
      sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
      <Formik<ProfileModel>
        initialValues={{
          firstName: firstName,
          lastName: lastName,
          email: email,
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={ProfileFormSchema}
        onSubmit={values => {
          onChangeDetails(values)
        }}>
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid
                container
                spacing={3}>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                    <TextField
                      fullWidth
                      value={values.firstName}
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={t("FirstName")}
                      autoFocus
                      inputRef={inputRef}
                    />
                  </Stack>
                  {touched.firstName && errors.firstName && (
                    <FormHelperText
                      error
                      id="personal-first-name-helper">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                    <TextField
                      fullWidth
                      value={values.lastName}
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={t("LastName")}
                    />
                  </Stack>
                  {touched.lastName && errors.lastName && (
                    <FormHelperText
                      error
                      id="personal-last-name-helper">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                    <TextField
                      disabled={true}
                      type="email"
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder={t("EmailAddress")}
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText
                      error
                      id="personal-email-helper">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}>
                    <LoadingButton
                      loading={isProfileUpdating}
                      type="submit"
                      variant="contained">
                      {t("Save", { ns: "Common" })}
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </MainCard>
  )
}
