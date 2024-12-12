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

interface ServiceOption {
  value: string;
  label: string;
}

interface ExchangeDialogProps {
  open: boolean;
  selectedService: ServiceOption | null;
  onClose: () => void;
  onConnect: () => void;
  onServiceChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  title: string;
}

export const ExchangeDialog: React.FC<ExchangeDialogProps> = ({
  open,
  selectedService,
  onClose,
  onConnect,
  onServiceChange,
  title,
}) => {
  const { t } = useTranslation("IndexModelingSection");
  console.log(selectedService, "selectedService@#!");
  // Define services options in an array
  const services: ServiceOption[] = [
    { value: "kraken", label: "Kraken" },
    { value: "metamask", label: "MetaMask" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "8px" }}>
          {t("Select Service *")}
        </Typography>
        <Select
          fullWidth
          value={selectedService?.value || ""} // Use the value of selected service or empty string
          onChange={onServiceChange} // Handle the change
          displayEmpty
          sx={{
            marginBottom: "16px",
            borderRadius: "8px",
            "& .MuiSelect-icon": { color: "black" },
          }}>
          <MenuItem
            value=""
            disabled>
            {t("Select Service")} {/* Placeholder option */}
          </MenuItem>
          {selectedService?.map(service => (
            <MenuItem
              key={service}
              value={service}>
              {t(service)} {/* Option for the service */}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
    </Dialog>
  );
};
