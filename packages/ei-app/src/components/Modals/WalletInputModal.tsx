import AppFormTextField from "@/components/common/FormInputs/AppFormTextField"
import { AppModal } from "@/components/Modals/AppModal"
import { cryptoWalletFormat } from "@/constants/Common"
import { getInvalidFormat, getMandatoryField } from "@/constants/Errormessages"
import { Box, Button, Typography } from "@mui/material"
import { Form, Formik } from "formik"
import { useTranslation } from "react-i18next"
import { InferType, object, string } from "yup"

const AddressFormSchema = object({
  address: string().matches(cryptoWalletFormat, getInvalidFormat()).required(getMandatoryField()),
})

type AddressModel = InferType<typeof AddressFormSchema>

export interface WalletInputProps {
  onClose: () => void
  //eslint-disable-next-line no-unused-vars
  onEnter: (walletAddress: string | null) => void
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
        }}
        validateOnChange={false}
        validationSchema={AddressFormSchema}
        onSubmit={data => {
          onEnter(data.address)
        }}>
        <Form>
          <Typography variant="h6">{t("AddNewWallet")}</Typography>
          <AppFormTextField
            sx={{ mt: 2 }}
            name={"address"}
            inputProps={{
              size: "small",
            }}
          />

          <Box sx={{ display: "flex", flexFlow: "row-reverse", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              type="submit">
              {t("Save", { ns: "Common" })}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}>
              {t("Cancel", { ns: "Common" })}
            </Button>
          </Box>
        </Form>
      </Formik>
    </AppModal>
  )
}
