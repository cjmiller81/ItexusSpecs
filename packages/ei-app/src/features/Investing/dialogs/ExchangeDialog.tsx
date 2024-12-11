import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ExchangeDialogProps {
  open: boolean;
  selectedService: string;
  onClose: () => void;
  onConnect: () => void;
  onServiceChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

export const ExchangeDialog: React.FC<ExchangeDialogProps> = ({
  open,
  selectedService,
  onClose,
  onConnect,
  onServiceChange,
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
          variant="subtitle1"
          sx={{ marginBottom: "8px" }}>
          {t("Select Service *")}
        </Typography>
        <Select
          fullWidth
          value={selectedService}
          onChange={onServiceChange}
          displayEmpty
          sx={{
            marginBottom: "16px",
            borderRadius: "8px",
            "& .MuiSelect-icon": { color: "black" },
          }}>
          <MenuItem
            value=""
            disabled>
            {t("Select Service")}
          </MenuItem>
          <MenuItem value="kraken">Kraken</MenuItem>
        </Select>
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
