import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { LoadingButton } from "@mui/lab"
import { Box, BoxProps, Button, Divider, Grid, InputAdornment, Link, Stack, Typography } from "@mui/material"
import { UiNode, UiNodeImageAttributes } from "@ory/client"
import { isUiNodeImageAttributes, isUiNodeInputAttributes, isUiNodeTextAttributes } from "@ory/elements"
import { Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { InferType, boolean, object, string } from "yup"
import { AppFormSwitchField, AppFormTextField } from "../../components"
import { getIncorectPassword, getMandatoryField } from "../../constants/errorMessages"
import { addError, addMessage, addWarning, useAppDispatch } from "../../slices"
import { NodeImage, useOry } from "../auth"
import { ProfileContainer } from "./ProfileContainer"
import { useRouter } from "next/router"

const NewPasswordModelSchema = object({
  newPassword: string().required(getMandatoryField()).min(1, getMandatoryField()).min(8, getIncorectPassword()),
})

type NewPasswordModel = InferType<typeof NewPasswordModelSchema>

const SmsMfaModelSchema = object({
  enabled: boolean(),
  phoneNumber: string(),
})

type SmsMfaModel = InferType<typeof SmsMfaModelSchema>

const TotpAuthenticatorSchema = object({
  code: string().required(" "),
})

type TotpAuthenticatorModel = InferType<typeof TotpAuthenticatorSchema>

export const SecurityContainer = ({ ...props }: BoxProps) => {
  const { onChangePassword, settingsFlow, onTotpUnlink, createSettingsFow, onTotpSubmit } = useOry()
  const { t } = useTranslation("SecurityContainer")
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [settingsFlowCreating, setSettingsFlowCreating] = useState(false)
  const [newPasswordLoading, setNewPasswordLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [imageNode, setImageNode] = useState<UiNode>()
  const [totpSecret, setTotpSecret] = useState<string | undefined>(undefined)
  const [unlinkButton, setUnlinkButton] = useState<boolean>(false)
  const passwordFieldRef = useRef<any>();
  const router = useRouter()
  useEffect(() => {
    if (router.query.requireChangePassword) {
      dispatch(addWarning(t("ChangePasswordWarning")));
      passwordFieldRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    setSettingsFlowCreating(true)
    createSettingsFow()
      .then()
      .finally(() => setSettingsFlowCreating(false))
  }, [])

  useEffect(() => {
    setTotpSecret(undefined)
    setImageNode(undefined)
    setUnlinkButton(false)
    settingsFlow?.ui.nodes.forEach(node => {
      const { attributes } = node
      if (isUiNodeTextAttributes(attributes) && attributes?.text.id === 1050006) {
        setTotpSecret(attributes?.text.text)
      }

      if (isUiNodeImageAttributes(attributes)) {
        setImageNode(node)
      }

      if (isUiNodeInputAttributes(attributes) && attributes?.name === "totp_unlink") {
        setUnlinkButton(true)
      }
    })
  }, [settingsFlow])

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
              disabled={settingsFlowCreating}
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

  const renderTotpRow = () => {
    return (
      <Form>
        <Stack
          alignItems={"center"}
          spacing={1}>
          {imageNode && (
            <>
              {renderTotpInfo()}
              <NodeImage
                node={imageNode}
                attributes={imageNode.attributes as UiNodeImageAttributes}></NodeImage>
              <code>{totpSecret}</code>
              <AppFormTextField
                sx={{ mt: 1, width: "30%", marginTop: 2 }}
                label={t("VerificationCode")}
                name="code"
                inputProps={{ size: "small" }}
              />
              <LoadingButton
                disabled={settingsFlowCreating}
                loading={codeLoading}
                type="submit"
                sx={{ float: "right", width: "30%", mt: 1 }}
                variant="contained">
                {t("Save", { ns: "Common" })}
              </LoadingButton>
            </>
          )}

          {unlinkButton && (
            <LoadingButton
              disabled={settingsFlowCreating}
              loading={codeLoading}
              onClick={onTotpUnlinkHandle}
              type="submit"
              sx={{ float: "right", minWidth: "200px", mt: 1 }}
              variant="contained">
              {t("UnlinkTotp")}
            </LoadingButton>
          )}
        </Stack>
      </Form>
    )
  }

  const onSubmitNewPassword = async (passsword: string, resetForm: Function) => {
    setNewPasswordLoading(true)
    onChangePassword(passsword)
      .then(() => {
        dispatch(addMessage(t("NewPasswordMessage")))
        resetForm()
      })
      .catch(error => {
        if (error.response.status === 400) dispatch(addError(t("invalidPasswordFormat", { ns: "errorMessages" })))
        else dispatch(addError(error?.response?.data?.error?.reason))
      })
      .finally(() => {
        setNewPasswordLoading(false)
      })
  }

  const onSubmitCode = async (code: string) => {
    setCodeLoading(true)
    onTotpSubmit(code)
      .then(() => {
        dispatch(addMessage(t("ApplicationLinked")))
      })
      .catch(error => {
        if (error?.response?.status === 400) dispatch(addError(t("invalidCode", { ns: "errorMessages" })))
        else dispatch(addError(error?.response?.data?.error?.reason))
      })
      .finally(() => {
        setCodeLoading(false)
      })
  }

  const onTotpUnlinkHandle = async () => {
    setCodeLoading(true)
    onTotpUnlink()
      .then(() => {
        dispatch(addMessage(t("ApplicationUnlinked")))
      })
      .catch(error => {
        if (error?.response?.status === 400) dispatch(addError(t("invalidCode", { ns: "errorMessages" })))
        else dispatch(addError(error?.response?.data?.error?.reason))
      })
      .finally(() => {
        setCodeLoading(false)
      })
  }

  const renderTotpInfo = () => (
    <Typography
      textAlign="center"
      variant="body1">
      {t("AddAuthApp")}{" "}
      <Link
        href="https://www.lastpass.com"
        rel="noreferrer"
        target="_blank">
        LastPass
      </Link>{" "}
      {t("AndGoogleApp")} (
      <Link
        href="https://apps.apple.com/us/app/google-authenticator/id388497605"
        target="_blank"
        rel="noreferrer">
        iOS
      </Link>
      ,{" "}
      <Link
        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
        target="_blank"
        rel="noreferrer">
        Android
      </Link>
      ).
    </Typography>
  )
  const renderChangePassword = () => {
    return (
      <Form>
        <ProfileContainer
          width={"100%"}
          title="Change Password"
          sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AppFormTextField
              tooltip={t("Password", { ns: "Tooltips" })}
              name="newPassword"
              label={t("NewPassword")}
              id="filled-adornment-password"
              inputProps={{
                inputRef: passwordFieldRef,
                type: showPassword ? "text" : "password",
                placeholder: t("EnterPassword"),
                InputProps: {
                  autoComplete: "off",
                  endAdornment: (
                    <InputAdornment
                      sx={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(prev => !prev)}
                      position="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <LoadingButton
              loading={newPasswordLoading}
              disabled={settingsFlowCreating}
              type="submit"
              sx={{
                alignSelf: "start",
                width: "20%",
                minWidth: "170px",
                mt: 2,
              }}
              variant={"contained"}>
              {t("ChangePassword")}
            </LoadingButton>
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
            onSubmit={(data, { resetForm }) => {
              onSubmitNewPassword(data.newPassword, resetForm)
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
              onSubmit={() => {}}>
              {renderMFARow(t("EnableSMSMFA"), t("PhoneNumber"), "enabled", "phoneNumber")}
            </Formik>
            <Divider sx={{ marginBlock: 2 }} />
            <Formik<TotpAuthenticatorModel>
              initialValues={{
                code: "",
              }}
              validateOnChange={false}
              validationSchema={TotpAuthenticatorSchema}
              onSubmit={data => {
                onSubmitCode(data.code)
              }}>
              <Box>{renderTotpRow()}</Box>
            </Formik>
          </ProfileContainer>
        </Box>
      </Stack>
    </Box>
  )
}
