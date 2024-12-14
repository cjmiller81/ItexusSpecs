import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { FormikProps } from "formik";

interface MetaMaskDialogProps {
  open: boolean;
  formik: FormikProps<any>;
  onClose: () => void;
}

export const MetaMaskDialog: React.FC<MetaMaskDialogProps> = ({ open, formik, onClose }) => {
  const { t } = useTranslation("IndexModelingSection");
  const theme = useTheme();

  const handleFieldChange = (field: keyof typeof formik.values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof field === "string") {
      formik.setFieldValue(field, event.target.value);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm">
      <DialogTitle>{t("ConnectWallet")}</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("SelectService*")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value="Metamask"
          disabled
          sx={{ marginBottom: "12px" }}
        />
        <Box
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#162652" : theme.palette.grey[400],
            color: "black !important",
            padding: "20px 20px",
            marginBottom: "16px",
            mt: "10px",
            borderRadius: "8px",
            display: "flex",
          }}>
          <ErrorOutlineIcon
            fontSize="small"
            sx={{ height: "17px", width: "17px", margin: "2px 5px 0 0 " }}
          />
          <Typography
            variant="body2"
            sx={{ color: "black" }}>
            {t("PleaseEnsureYouHaveTheNecessary")}
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("Network")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={formik.values.network}
          onChange={handleFieldChange("network")}
          sx={{ marginBottom: "12px" }}
          error={Boolean(formik.errors.network)}
          helperText={formik.errors.network && typeof formik.errors.network === "string" ? formik.errors.network : ""}
        />
        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("CustomRPCURL")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={formik.values.customRpcUrl}
          onChange={handleFieldChange("customRpcUrl")}
          sx={{ marginBottom: "12px" }}
          error={Boolean(formik.errors.customRpcUrl)}
          helperText={
            formik.errors.customRpcUrl && typeof formik.errors.customRpcUrl === "string"
              ? formik.errors.customRpcUrl
              : ""
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}>
          {t("Cancel")}
        </Button>
        <form onSubmit={formik.handleSubmit}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={formik.isSubmitting}>
            {t("Connect")}
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
};
