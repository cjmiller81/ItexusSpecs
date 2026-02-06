import { FC, useEffect, useState } from "react"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import MainCard, { MainCardProps } from "components/MainCard"
import { Form, Formik } from "formik"
import { LoadingButton } from "@mui/lab"
import { FormHelperText } from "@mui/material"
import { SettingsFlow, UiNode, UiNodeImageAttributes } from "@ory/client"
import { isUiNodeImageAttributes, isUiNodeInputAttributes, isUiNodeTextAttributes } from "@ory/integrations/ui"
import { NodeImage } from "components"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { InferType, object, string } from "yup"

const TotpAuthenticatorSchema = object({
  code: string().required(" "),
})

type TotpAuthenticatorModel = InferType<typeof TotpAuthenticatorSchema>

type Props = {
  onSubmitCode: (code: string) => void
  onTotpUnlinkHandle: () => void
  settingsFlow: SettingsFlow | undefined
  isCodeSubmitting?: boolean
}

export const TotpSection: FC<Props & Omit<MainCardProps, "children">> = ({
  onSubmitCode,
  settingsFlow,
  onTotpUnlinkHandle,
  isCodeSubmitting,
  ...props
}) => {
  const { t } = useTranslation("TotpSection")
  const [imageNode, setImageNode] = useState<UiNode>()
  const [totpSecret, setTotpSecret] = useState<string | undefined>(undefined)
  const [unlinkButton, setUnlinkButton] = useState<boolean>(false)

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
  return (
    <MainCard
      {...props}
      title={t("TOTP")}>
      <Formik<TotpAuthenticatorModel>
        initialValues={{
          code: "",
        }}
        validateOnChange={false}
        validationSchema={TotpAuthenticatorSchema}
        onSubmit={data => {
          onSubmitCode(data.code)
        }}>
        {({ errors, handleChange, touched, values }) => (
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
                  <code style={{ marginBottom: "32px" }}>{totpSecret}</code>
                  <InputLabel  htmlFor="password-old">{t("VerificationCode")}</InputLabel>
                  <OutlinedInput
                    size="small"
                    sx={{ mt: 4, width: "30%" }}
                    name="code"
                    onChange={handleChange}
                    value={values.code}
                    error={!!errors.code}
                  />
                  <LoadingButton
                    disabled={!settingsFlow}
                    loading={isCodeSubmitting}
                    type="submit"
                    sx={{ float: "right", width: "30%", mt: 1 }}
                    variant="contained">
                    {t("Save", { ns: "Common" })}
                  </LoadingButton>
                  {touched.code && errors.code && (
                    <FormHelperText
                      error
                      id="password-old-helper">
                      {errors.code}
                    </FormHelperText>
                  )}
                </>
              )}

              {unlinkButton && (
                <LoadingButton
                  disabled={!settingsFlow}
                  loading={isCodeSubmitting}
                  onClick={onTotpUnlinkHandle}
                  sx={{ float: "right", minWidth: "200px", mt: 1 }}
                  variant="contained">
                  {t("UnlinkTotp")}
                </LoadingButton>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </MainCard>
  )
}
