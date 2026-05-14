import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export interface CentralizedWalletModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedService: "Kraken" | "Coinbase") => void;
  /** Keeps the dialog in the React tree (no document.body portal). Use in Storybook docs so the backdrop does not cover the whole UI. */
  disableModalPortal?: boolean;
}

export const CentralizedWalletModal: React.FC<CentralizedWalletModalProps> = ({
  open,
  onClose,
  onConfirm: _onConfirm,
  disableModalPortal = false,
}) => {
  const [selectedService, setSelectedService] = useState<"Kraken" | "Coinbase" | "">("");
  const { t } = useTranslation("IndexModelingSection");
  const handleServiceChange = (event: SelectChangeEvent<"Kraken" | "Coinbase">) => {
    setSelectedService(event.target.value as "Kraken" | "Coinbase");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disablePortal={disableModalPortal}>
      <DialogTitle>{t("SelectService")}</DialogTitle>
      <DialogContent>
        <Select
          value={selectedService}
          onChange={handleServiceChange}
          fullWidth>
          <MenuItem value="Kraken">Kraken</MenuItem>
          <MenuItem value="Coinbase">Coinbase</MenuItem>
        </Select>
      </DialogContent>
    </Dialog>
  );
};
