import AppFormSwitchField from "@/components/common/FormInputs/AppFormSwitchField"
import AppFormTextField from "@/components/common/FormInputs/AppFormTextField"
import { getIncorectPassword, getMandatoryField } from "@/constants/Errormessages"
import { Box, BoxProps, Button, Grid, Stack, Typography } from "@mui/material"
import { Form, Formik } from "formik"
import { boolean, InferType, object, string } from "yup"
import { ProfileContainer } from "./ProfileContainer"
import { useTranslation } from "react-i18next"

const NewPasswordModelSchema = object({
  newPassword: string().required(getMandatoryField()).min(1, getMandatoryField()).min(6, getIncorectPassword()),
})

type NewPasswordModel = InferType<typeof NewPasswordModelSchema>

const SmsMfaModelSchema = object({
  enabled: boolean(),
  phoneNumber: string(),
})

type SmsMfaModel = InferType<typeof SmsMfaModelSchema>

const TotpAuthenticatorSchema = object({
  enabled: boolean(),
  displayName: string(),
})

type TotpAuthenticatorModel = InferType<typeof TotpAuthenticatorSchema>

export const SecurityContainer = ({ ...props }: BoxProps) => {
  const { t } = useTranslation("SecurityContainer")
  const renderMFARow = (switchLabel: string, inputLabel: string, switchFieldName: string, inputFieldName: string) => {
    return (
      <Form>
        <Grid
          container
          spacing={2}>
          <Grid
            xs={8}
            item>
            <Stack spacing={1}>
              <Stack
                alignItems={"center"}
                direction={"row"}>
                <Typography
                  textAlign={"left"}
                  noWrap
                  align="center">
                  {switchLabel}
                </Typography>
                <AppFormSwitchField
                  disabled
                  name={switchFieldName}
                  sx={{ ml: "auto" }}
                />
              </Stack>
            </Stack>
            <AppFormTextField
              sx={{ mt: 1 }}
              label={inputLabel}
              name={inputFieldName}
              inputProps={{ disabled: true }}
              required
            />
          </Grid>
          <Grid
            flexDirection={"row-reverse"}
            item
            xs={4}>
            <Button
              type="submit"
              sx={{ float: "right", width: "80%", mr: "10%" }}
              variant="contained">
              {t("Save", { ns: "Common" })}
            </Button>
          </Grid>
        </Grid>
      </Form>
    )
  }

  const renderChangePassword = () => {
    return (
      <Form>
        <ProfileContainer
          width={"100%"}
          title="Change Password"
          sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AppFormTextField
              name="newPassword"
              label={t("NewPassword")}
            />

            <Button
              type="submit"
              sx={{
                alignSelf: "start",
                width: "20%",
                minWidth: "170px",
                mt: 2,
              }}
              variant={"contained"}>
              {t("ChangePassword")}
            </Button>
          </Box>
        </ProfileContainer>
      </Form>
    )
  }

  return (
    <Box {...props}>
      <Stack
        sx={{ width: "100%" }}
        direction={{ sm: "column", md: "column", lg: "row" }}
        spacing={2}>
        <Box sx={{ width: "100%" }}>
          <Formik<NewPasswordModel>
            initialValues={{
              newPassword: "",
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={NewPasswordModelSchema}
            onSubmit={({ newPassword }) => {
              console.log(newPassword)
            }}>
            {renderChangePassword()}
          </Formik>
        </Box>
        <Box sx={{ width: "100%" }}>
          <ProfileContainer
            title={t("MultiFactorAuthenticationTitle")}
            sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Formik<SmsMfaModel>
              initialValues={{
                enabled: false,
                phoneNumber: "",
              }}
              validateOnChange={false}
              validationSchema={SmsMfaModelSchema}
              onSubmit={data => {
                console.log(data)
              }}>
              {renderMFARow(t("EnableSMSMFA"), t("PhoneNumber"), "enabled", "phoneNumber")}
            </Formik>
            <Formik<TotpAuthenticatorModel>
              initialValues={{
                enabled: false,
                displayName: "",
              }}
              validateOnChange={false}
              validationSchema={TotpAuthenticatorSchema}
              onSubmit={data => {
                console.log(data)
              }}>
              <Box mt={3}>
                {renderMFARow(t("EnableTOTPAuthenticationApps"), t("DisplayName"), "enabled", "displayName")}
              </Box>
            </Formik>
          </ProfileContainer>
        </Box>
      </Stack>
    </Box>
  )
}
