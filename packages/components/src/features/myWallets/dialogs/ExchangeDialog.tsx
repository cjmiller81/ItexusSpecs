import React from "react";
import { Typography, Select, MenuItem, Dialog, DialogContent, DialogTitle, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ExchangeDialogProps {
  open: boolean;
  selectedService: any;
  onClose: () => void;
  onServiceChange: (event: SelectChangeEvent<string>) => void;
  title: string[];
}

export const ExchangeDialog: React.FC<ExchangeDialogProps> = ({
  open,
  selectedService,
  onClose,
  onServiceChange,
  title,
}) => {
  const { t } = useTranslation("IndexModelingSection");
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          height: "500px",
        },
      }}
      maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "8px" }}>
          {t("SelectService")}
        </Typography>
        <Select
          fullWidth
          value={selectedService?.value || ""}
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
            {t("SelectService")}
          </MenuItem>
          {selectedService?.map(service => (
            <MenuItem
              key={service}
              value={service}>
              {t(service)}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
    </Dialog>
  );
};
