import { Box, Button, Typography, Stack, useTheme, TextField } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { User, Eye } from "lucide-react";
import { AppModal } from "../../components/modals/AppModal";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Form, Formik, type FormikProps } from "formik";
import { InferType, boolean, object, string } from "yup";
import { useEffect, useState } from "react";
import { cryptoWalletFormat } from "../../constants";
import i18n from "i18next";

const AddressFormSchema = object({
  address: string()
    .matches(cryptoWalletFormat, i18n.t("invalidFormat", { ns: "ErrorMessages" }))
    .required(i18n.t("mandatoryField", { ns: "ErrorMessages" })),
  walletName: string()
    .max(50)
    .required(i18n.t("mandatoryField", { ns: "ErrorMessages" })),
  isPersonal: boolean().required(),
});

export type AddressModel = InferType<typeof AddressFormSchema>;

export interface WalletInputProps {
  onClose: () => void;
  onEnter: (_walletAddress: AddressModel) => void;
  open: boolean;
  error: string | null;
  onCleanupError: () => void;
  /** Keeps the MUI modal in the React tree (no document.body portal). Use in Storybook docs so the backdrop does not cover the whole UI. */
  disableModalPortal?: boolean;
}

type WalletInputFormInnerProps = FormikProps<AddressModel> & {
  error: string | null;
  onCleanupError: () => void;
  onClose: () => void;
  t: TFunction;
  theme: Theme;
};

function WalletInputFormInner({
  values,
  handleChange,
  handleSubmit,
  errors,
  touched,
  setFieldValue,
  error,
  onCleanupError,
  onClose,
  t,
  theme,
}: WalletInputFormInnerProps) {
  const [errorAddress, setErrorAddress] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setErrorAddress(values.address.trim());
    }
  }, [error, values.address]);

  useEffect(() => {
    if (error && errorAddress !== null && values.address.trim() !== errorAddress) {
      onCleanupError();
      setErrorAddress(null);
    }
  }, [values.address, error, errorAddress, onCleanupError]);

  const handleSelectType = (type: "personal" | "model") => {
    setFieldValue("isPersonal", type === "personal");
  };

  const walletType = values.isPersonal ? "personal" : "model";

  return (
    <Form onSubmit={handleSubmit}>
      <Typography
        sx={{ mt: 1, marginBottom: "15px" }}
        variant="h5"
        fontWeight={550}>
        {t("AddNewWallet")}
      </Typography>

      <Box mb={3}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "14px" }}
          gutterBottom>
          {t("CreateWalletName")}
        </Typography>
        <TextField
          fullWidth
          name="walletName"
          value={values.walletName}
          onChange={handleChange}
          placeholder={t("EnterWalletName")}
          error={Boolean(touched.walletName && errors.walletName)}
          helperText={touched.walletName && errors.walletName}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
            },
          }}
        />
      </Box>

      <Box mb={3}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "14px" }}
          gutterBottom>
          {t("InputWalletAddress")}
        </Typography>
        <TextField
          fullWidth
          name="address"
          value={values.address}
          onChange={handleChange}
          placeholder={t("ExampleWallet")}
          error={Boolean(touched.address && (errors.address || error))}
          helperText={
            touched.address && errors.address ? errors.address : error ? t("WalletAddressAlreadyInTheList") : ""
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
            },
          }}
        />
      </Box>

      <Box mb={3}>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "16px" }}
          gutterBottom>
          {t("WalletType")}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}>
          <Box
            onClick={() => handleSelectType("personal")}
            sx={{
              cursor: "pointer",
              p: 2,
              flex: 1,
              borderRadius: 2,
              border: 2,
              borderColor: walletType === "personal" ? "primary.main" : "grey.600",
              bgcolor:
                walletType === "personal"
                  ? "primary.main" + "10"
                  : theme.palette.mode === "dark"
                    ? "grey.800"
                    : "lightgray",
            }}>
            <Stack
              alignItems="center"
              spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  bgcolor: walletType === "personal" ? "primary.main" : "grey.700",
                }}>
                <User
                  size={22}
                  color="white"
                />
              </Box>
              <Typography
                variant="body2"
                color={walletType === "personal" ? "primary.main" : "text.secondary"}>
                {t("Personal")}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary">
                {t("YourWallet")}
              </Typography>
            </Stack>
          </Box>

          <Box
            onClick={() => handleSelectType("model")}
            sx={{
              cursor: "pointer",
              p: 2,
              borderRadius: 2,
              border: 2,
              flex: 1,
              borderColor: walletType === "model" ? "success.main" : "grey.600",
              bgcolor:
                walletType === "model"
                  ? "success.main" + "10"
                  : theme.palette.mode === "dark"
                    ? "grey.800"
                    : "lightgray",
            }}>
            <Stack
              alignItems="center"
              spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  bgcolor: walletType === "model" ? "success.main" : "grey.700",
                }}>
                <Eye
                  size={22}
                  color="white"
                />
              </Box>
              <Typography
                variant="body2"
                color={walletType === "model" ? "success.main" : "text.secondary"}>
                {t("Model")}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary">
                {t("Following")}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box
          mt={2}
          p={1.5}
          borderRadius={2}
          sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.800" : "lightgray" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}>
            <Box
              width={8}
              height={8}
              borderRadius="50%"
              bgcolor={walletType === "personal" ? "primary.main" : "success.main"}
            />
            <Typography color="text.secondary">
              {walletType === "personal" ? t("AddingYourOwnWallet") : t("FollowingWallet")}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}>
        <Button
          fullWidth
          sx={{ borderRadius: "8px", height: "40px" }}
          variant="outlined"
          onClick={() => {
            onClose();
            onCleanupError();
          }}>
          {t("Cancel", { ns: "Common" })}
        </Button>
        <Button
          fullWidth
          sx={{ borderRadius: "8px", height: "40px" }}
          variant="contained"
          type="submit">
          {t("Save", { ns: "Common" })}
        </Button>
      </Stack>
    </Form>
  );
}

export const WalletInputModal = ({
  onClose,
  onEnter,
  open,
  error,
  onCleanupError,
  disableModalPortal = false,
}: WalletInputProps) => {
  const { t } = useTranslation("WalletInputModal");
  const theme = useTheme();

  return (
    <AppModal
      onClose={() => {
        onClose();
        onCleanupError();
      }}
      disablePortal={disableModalPortal}
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
          onEnter(data);
        }}>
        {formik => (
          <WalletInputFormInner
            {...formik}
            error={error}
            onCleanupError={onCleanupError}
            onClose={onClose}
            t={t}
            theme={theme}
          />
        )}
      </Formik>
    </AppModal>
  );
};
