import { AppModal } from "@/components/Modals/AppModal"
import AppFormTextField from "@/components/common/FormInputs/AppFormTextField"
import { cryptoWalletFormat } from "@/constants/Common"
import { getInvalidFormat, getMandatoryField } from "@/constants/Errormessages"
import { Box, Button, Stack, Typography } from "@mui/material"
import { Form, Formik } from "formik"
import { useTranslation } from "react-i18next"
import { InferType, boolean, object, string } from "yup"
import AppFormCheckboxField from "../common/FormInputs/AppFormCheckboxField"

const AddressFormSchema = object({
  address: string().matches(cryptoWalletFormat, getInvalidFormat()).required(getMandatoryField()),
  walletName: string().max(50).optional(),
  isPersonal: boolean(),
})

export type AddressModel = InferType<typeof AddressFormSchema>

export interface WalletInputProps {
  onClose: () => void
  //eslint-disable-next-line no-unused-vars
  onEnter: (walletAddress: AddressModel) => void
  open: boolean
}

export const WalletInputModal = ({ onClose, onEnter, open }: WalletInputProps) => {
  const { t } = useTranslation("WalletInputModal")
  return (
    <AppModal
      onClose={onClose}
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
        <Form>
          <Typography
            sx={{ mt: 1 }}
            variant="h6">
            {t("AddNewWallet")}
          </Typography>
          <AppFormTextField
            sx={{ mt: 0.5 }}
            name={"address"}
            inputProps={{
              size: "small",
            }}
          />
          <Typography
            sx={{ mt: 3 }}
            variant="h6">
            {t("WalletName")}
          </Typography>
          <AppFormTextField
            sx={{ mt: 0.5 }}
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
              onClick={onClose}>
              {t("Cancel", { ns: "Common" })}
            </Button>
            <Button
              variant="contained"
              type="submit">
              {t("Save", { ns: "Common" })}
            </Button>
          </Box>
        </Form>
      </Formik>
    </AppModal>
  )
}
