import React from "react";
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

interface KrakenDialogProps {
  open: boolean;
  krakenCredentials: {
    apiLabel: string;
    apiKey: string;
    apiSecret: string;
    apiPassphrase: string;
  };
  onClose: () => void;
  onConnect: () => void;
  onCredentialChange: (
    field: keyof KrakenDialogProps["krakenCredentials"],
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const KrakenDialog: React.FC<KrakenDialogProps> = ({
  open,
  krakenCredentials,
  onClose,
  onConnect,
  onCredentialChange,
}) => {
  const { t } = useTranslation("IndexModelingSection");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm">
      <DialogTitle>{t("Connect Exchange")}</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("Select Service *")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value="Kraken"
          disabled
          sx={{ marginBottom: "12px" }}
        />

        <Box
          sx={{
            backgroundColor: "#002984",
            color: "white",
            padding: "15px 0",
            marginBottom: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
          }}>
          <Box
            sx={{
              backgroundColor: "white",
              color: "#002984",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "12px",
            }}>
            i
          </Box>
          <Typography variant="body2">
            {t("Please ensure you have the necessary permissions enabled for your Kraken connection")}
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("API Key")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={krakenCredentials.apiKey}
          onChange={onCredentialChange("apiKey")}
          sx={{ marginBottom: "12px" }}
        />

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("API Secret")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          value={krakenCredentials.apiSecret}
          onChange={onCredentialChange("apiSecret")}
          sx={{ marginBottom: "12px" }}
        />

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("API Passphrase")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          value={krakenCredentials.apiPassphrase}
          onChange={onCredentialChange("apiPassphrase")}
          sx={{ marginBottom: "12px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConnect}>
          {t("Connect")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
