import React from "react";
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

interface MetaMaskDialogProps {
  open: boolean;
  metaMaskData: {
    network: string;
    customRpcUrl: string;
  };
  onClose: () => void;
  onConnect: () => void;
  onDataChange: (
    field: keyof MetaMaskDialogProps["metaMaskData"],
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MetaMaskDialog: React.FC<MetaMaskDialogProps> = ({
  open,
  metaMaskData,
  onClose,
  onConnect,
  onDataChange,
}) => {
  const { t } = useTranslation("IndexModelingSection");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm">
      <DialogTitle>{t("Connect Wallet")}</DialogTitle>
      <Typography
        variant="subtitle2"
        sx={{ marginBottom: "8px" }}>
        {t("Custom RPC URL")}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={metaMaskData.customRpcUrl}
        onChange={onDataChange("customRpcUrl")}
        sx={{ marginBottom: "12px" }}
      />
      <DialogContent>
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
            {t("Please ensure you have the necessary permissions enabled for your MetaMask connection")}
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
          value={metaMaskData.network}
          onChange={onDataChange("network")}
          sx={{ marginBottom: "12px" }}
        />

        <Typography
          variant="subtitle2"
          sx={{ marginBottom: "8px" }}>
          {t("Custom RPC URL")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={metaMaskData.customRpcUrl}
          onChange={onDataChange("customRpcUrl")}
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
