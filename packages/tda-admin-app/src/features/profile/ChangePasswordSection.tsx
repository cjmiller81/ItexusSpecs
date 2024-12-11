import { FC, SyntheticEvent, useEffect, useRef, useState } from "react"
import Box from "@mui/material/Box"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import OutlinedInput from "@mui/material/OutlinedInput"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import IconButton from "components/@extended/IconButton"
import MainCard, { MainCardProps } from "components/MainCard"
import CheckOutlined from "@ant-design/icons/CheckOutlined"
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined"
import EyeOutlined from "@ant-design/icons/EyeOutlined"
import LineOutlined from "@ant-design/icons/LineOutlined"
import { LoadingButton } from "@mui/lab"
import { SettingsFlow } from "@ory/client"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { isLowercaseChar, isNumber, isSpecialChar, isUppercaseChar, minLength } from "utils/password-validation"
import * as Yup from "yup"
import { InferType, string } from "yup"
import { openSnackbar } from "@/api/snackbar"
import { SnackbarProps } from "@/types/snackbar"
import i18n from "@/libs/i18n/i18n"

const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(i18n.t("NewPasswordRequired", { ns: "ErrorMessages" }))
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      i18n.t("PasswordRequirementsError", { ns: "ErrorMessages" })
    ),
  confirm: Yup.string()
    .required(i18n.t("ConfirmPasswordRequired", { ns: "ErrorMessages" }))
    .test("confirm", i18n.t("PasswordsDoNotMatch", { ns: "ErrorMessages" }), (confirm: string, yup: any) => yup.parent.password === confirm),
  submit: string().nullable(),
})

type ChangePasswordModel = InferType<typeof changePasswordSchema>

type Props = {
  settingsFlow?: SettingsFlow
  onChangePassword: (password: string) => void
  isLoading?: boolean
}

export const ChangePasswordSection: FC<Props & Omit<MainCardProps, "children">> = ({
  settingsFlow,
  onChangePassword,
  isLoading,
  ...props
}) => {
  const { t } = useTranslation("ChangePasswordSection")
  const passwordFieldRef = useRef<any>()
  const router = useRouter()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (router.query.requireChangePassword) {
      openSnackbar({
        open: true,
        message: t("ChangePasswordWarning"),
        alert: {
          color: "warning",
        },
      } as SnackbarProps)
      passwordFieldRef.current?.focus()
    }
  }, [])
  
  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  return (
    <MainCard
      title={t("ChangePassword")}
      {...props}>
      <Formik<ChangePasswordModel>
        initialValues={{
          password: "",
          confirm: "",
          submit: null,
        }}
        validationSchema={changePasswordSchema}
        onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
          try {
            resetForm()
            setStatus({ success: false })
            setSubmitting(false)
            onChangePassword(values.password)
          } catch (err: any) {
            setStatus({ success: false })
            setErrors({ submit: err.message })
            setSubmitting(false)
          }
        }}>
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}>
            <Grid
              container
              spacing={3}>
              <Grid
                item
                container
                spacing={3}
                xs={12}
                sm={6}>
                <Grid
                  item
                  xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-password">{t("NewPassword")}</InputLabel>
                    <OutlinedInput
                      ref={passwordFieldRef}
                      placeholder={t("EnterNewPassword")}
                      id="password-password"
                      type={showNewPassword ? "text" : "password"}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary">
                            {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-password"
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText
                      error
                      id="password-password-helper">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-confirm">{t("ConfirmPassword")}</InputLabel>
                    <OutlinedInput
                      placeholder={t("EnterConfirmPassword")}
                      id="password-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirm}
                      name="confirm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary">
                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-confirm"
                    />
                  </Stack>
                  {touched.confirm && errors.confirm && (
                    <FormHelperText
                      error
                      id="password-confirm-helper">
                      {errors.confirm}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <PasswordRequirements password={values.password} />
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
                    loading={isLoading}
                    disabled={isSubmitting || Object.keys(errors).length !== 0}
                    type="submit"
                    variant="contained">
                    {t("Save", { ns: "Common" })}
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </MainCard>
  )
}

function PasswordRequirements({ password }: { password: string }) {
  return (
    <Box sx={{ p: { xs: 0, sm: 2, md: 4, lg: 5 } }}>
      <Typography variant="h5">New password must contain:</Typography>
      <List sx={{ p: 0, mt: 1 }}>
        <ListItem divider>
          <ListItemIcon sx={{ color: minLength(password) ? "success.main" : "inherit" }}>
            {minLength(password) ? <CheckOutlined /> : <LineOutlined />}
          </ListItemIcon>
          <ListItemText primary="At least 8 characters" />
        </ListItem>
        <ListItem divider>
          <ListItemIcon sx={{ color: isLowercaseChar(password) ? "success.main" : "inherit" }}>
            {isLowercaseChar(password) ? <CheckOutlined /> : <LineOutlined />}
          </ListItemIcon>
          <ListItemText primary="At least 1 lower letter (a-z)" />
        </ListItem>
        <ListItem divider>
          <ListItemIcon sx={{ color: isUppercaseChar(password) ? "success.main" : "inherit" }}>
            {isUppercaseChar(password) ? <CheckOutlined /> : <LineOutlined />}
          </ListItemIcon>
          <ListItemText primary="At least 1 uppercase letter (A-Z)" />
        </ListItem>
        <ListItem divider>
          <ListItemIcon sx={{ color: isNumber(password) ? "success.main" : "inherit" }}>
            {isNumber(password) ? <CheckOutlined /> : <LineOutlined />}
          </ListItemIcon>
          <ListItemText primary="At least 1 number (0-9)" />
        </ListItem>
        <ListItem>
          <ListItemIcon sx={{ color: isSpecialChar(password) ? "success.main" : "inherit" }}>
            {isSpecialChar(password) ? <CheckOutlined /> : <LineOutlined />}
          </ListItemIcon>
          <ListItemText primary="At least 1 special characters" />
        </ListItem>
      </List>
    </Box>
  )
}
