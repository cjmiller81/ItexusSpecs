import React from "react";
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { FormikProps } from "formik";

interface CoinbaseDialogProps {
  open: boolean;
  formik: FormikProps<any>;
  onClose: () => void;
}

export const CoinbaseDialog: React.FC<CoinbaseDialogProps> = ({ open, formik, onClose }) => {
  const { t } = useTranslation("IndexModelingSection");
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm">
      <DialogTitle>{t("ConnectExchange")}</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("SelectService*")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value="Coinbase"
          disabled
          sx={{ marginBottom: "12px" }}
        />
        <Box
          sx={{
            backgroundColor: theme.palette.grey[400],
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
            {t("PleaseEnsureYouHaveTheNecessaryCoinbase")}
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("APIKey*")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={formik.values.apiKey}
          onChange={formik.handleChange}
          name="apiKey"
          placeholder={t("APIKey*")}
          sx={{ marginBottom: "12px" }}
          error={formik.touched.apiKey && Boolean(formik.errors.apiKey)}
          helperText={formik.touched.apiKey && (typeof formik.errors.apiKey === "string" ? formik.errors.apiKey : "")}
        />

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("APISecret*")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          value={formik.values.apiSecret}
          onChange={formik.handleChange}
          name="apiSecret"
          placeholder={t("APISecret*")}
          sx={{ marginBottom: "12px" }}
          error={formik.touched.apiSecret && Boolean(formik.errors.apiSecret)}
          helperText={
            formik.touched.apiSecret && (typeof formik.errors.apiSecret === "string" ? formik.errors.apiSecret : "")
          }
        />

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("APIPassphrase")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          value={formik.values.apiPassphrase}
          onChange={formik.handleChange}
          name="apiPassphrase"
          placeholder={t("APIPassphrase")}
          sx={{ marginBottom: "12px" }}
          error={formik.touched.apiPassphrase && Boolean(formik.errors.apiPassphrase)}
          helperText={
            formik.touched.apiPassphrase &&
            (typeof formik.errors.apiPassphrase === "string" ? formik.errors.apiPassphrase : "")
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
