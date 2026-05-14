import React from "react";
import { Typography, Select, MenuItem, Dialog, DialogContent, DialogTitle, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface ExchangeDialogProps {
  open: boolean;
  selectedService: string[];
  onClose: () => void;
  onServiceChange: (event: SelectChangeEvent<string>) => void;
  title: string[];
  /** Storybook docs: avoid portaling the dialog to `document.body`. */
  disableModalPortal?: boolean;
}

export const ExchangeDialog: React.FC<ExchangeDialogProps> = ({
  open,
  selectedService,
  onClose,
  onServiceChange,
  title: _title,
  disableModalPortal = false,
}) => {
  const { t } = useTranslation("IndexModelingSection");
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disablePortal={disableModalPortal}
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          height: "500px",
        },
      }}
      maxWidth="sm">
      <DialogTitle>{t("AddCentralizedExchangeConnection")}</DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "8px" }}>
          {t("SelectService")}
        </Typography>
        <Select
          fullWidth
          value=""
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
