import { Box, Button, Stack, Typography } from "@mui/material"
import { Form, Formik } from "formik"
import i18n from "i18next"
import { useTranslation } from "react-i18next"
import { InferType, boolean, object, string } from "yup"
import { AppFormCheckboxField, AppFormTextField } from "../../components"
import { AppModal } from "../../components/modals/AppModal"
import { cryptoWalletFormat } from "../../constants"
import { useEffect, useState } from "react"

const AddressFormSchema = object({
  address: string()
    .matches(cryptoWalletFormat, i18n.t("invalidFormat", { ns: "ErrorMessages" }))
    .required(i18n.t("mandatoryField", { ns: "ErrorMessages" })),
  walletName: string()
    .max(50)
    .required(i18n.t("mandatoryField", { ns: "ErrorMessages" })),
  isPersonal: boolean().required(),
})

export type AddressModel = InferType<typeof AddressFormSchema>

export interface WalletInputProps {
  onClose: () => void
  //eslint-disable-next-line no-unused-vars
  onEnter: (walletAddress: AddressModel) => void
  open: boolean,
  error: string | null;
  onCleanupError: () => void;
}

export const WalletInputModal = ({ onClose, onEnter, open, error, onCleanupError }: WalletInputProps) => {
  const { t } = useTranslation("WalletInputModal")
  const [errorAddress, setErrorAddress] = useState<string | null>(null);

  return (
    <AppModal
      onClose={() => { 
        onClose();
        onCleanupError();
      }}
      open={open}>
      <Formik<AddressModel>
        initialValues={{
          address: "",
          walletName: "",
          isPersonal: false,
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={AddressFormSchema}
        onSubmit={data => {
          onEnter(data)
        }}>
         {({ values }) => {
          
          useEffect(() => {
            if (error) {
              setErrorAddress(values.address.trim());
            }
          }, [error]);

          useEffect(() => {
            if (
              error &&
              errorAddress !== null &&
              values.address.trim() !== errorAddress
            ) {
              onCleanupError();
              setErrorAddress(null);
            }
          }, [values.address, error]);

          return (
        <Form>
          <Typography
            sx={{ mt: 1 }}
            variant="h6">
            {t("AddNewWallet")}
          </Typography>
          <AppFormTextField
            sx={{ mt: 0.5, width: "100%" }}
            name={"address"}
            inputProps={{
              size: "small",
            }}
            error={Boolean(error)}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2, ml: 2, fontWeight: 400, fontSize: 12 }}>
              {t("WalletAddressAlreadyInTheList")}
            </Typography>
           )}
          <Typography
            sx={{ mt: 3 }}
            variant="h6">
            {t("WalletName")}
          </Typography>
          <AppFormTextField
            sx={{ mt: 0.5, width: "100%" }}
            name={"walletName"}
            inputProps={{
              size: "small",
            }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 3, alignItems: "center" }}>
            <Box sx={{ width: "100%" }}>
              <Stack
                direction={"row"}
                alignItems="center">
                <AppFormCheckboxField name={"isPersonal"} />
                <Typography
                  fontWeight={400}
                  variant="h6">
                  {t("Personal")}
                </Typography>
              </Stack>
            </Box>
            <Button
              variant="outlined"
              onClick={() => { 
                onClose(); 
                onCleanupError();
              }}>
              {t("Cancel", { ns: "Common" })}
            </Button>
            <Button
              variant="contained"
              type="submit">
              {t("Save", { ns: "Common" })}
            </Button>
          </Box>
        </Form>);
        }}
      </Formik>
    </AppModal>
  )
}
