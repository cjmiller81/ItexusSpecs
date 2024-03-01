import AppFormTextField from "@/components/common/FormInputs/AppFormTextField"
import { AppModal } from "@/components/Modals/AppModal"
import { cryptoWalletFormat } from "@/constants/Common"
import { Box, Button, Typography } from "@mui/material"
import { Form, Formik } from "formik"
import { InferType, object, string } from "yup"

const AddressFormSchema = object({
  address: string().matches(cryptoWalletFormat, "Invalid format").required("Required"),
})

type AddressModel = InferType<typeof AddressFormSchema>

export interface WalletInputProps {
  onClose: () => void
  //eslint-disable-next-line no-unused-vars
  onEnter: (walletAddress: string | null) => void
  open: boolean
}

export const WalletInputModal = ({ onClose, onEnter, open }: WalletInputProps) => {
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
          console.log("submit")
          onEnter(data.address)
        }}>
        <Form>
          <Typography variant="h6">Add new wallet</Typography>
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
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Form>
      </Formik>
    </AppModal>
  )
}
