import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearDexErrors } from "components";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const NoRouteDialog: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation("Modals");
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(clearDexErrors());
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>🚨 {t("SwapRouteNotFound")}</DialogTitle>

      <DialogContent dividers>
        <Typography
          variant="body1"
          gutterBottom>
          {t("WeCouldntFindSwapRouteForThisTokenPair")}
        </Typography>
        <Box
          component="ul"
          sx={{ pl: 3, mb: 0 }}>
          <li>
            <Typography variant="body2">{t("InsufficientLiquidity")}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t("UnsupportedTokenPair")}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t("NetworkCongestion")}</Typography>
          </li>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ backgroundColor: "#219a83", color: "white" }}>
          {t("Try Again")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoRouteDialog;
