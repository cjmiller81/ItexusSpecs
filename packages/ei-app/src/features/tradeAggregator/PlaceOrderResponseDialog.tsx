import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PlaceOrderResponse } from "components";

export function PlaceOrderResponseDialog({ open, onClose, response, errors, t }) {
  if (response == null && errors == null) return;
  const resp: PlaceOrderResponse = response;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm">
      <DialogTitle>{t("TransactionResults")}</DialogTitle>
      <DialogContent>
        {response != null ? (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}>
            <Typography variant="body1">
              {t("OrderId")}: {resp.orderId}
            </Typography>
            <Typography variant="body1">
              {t("AmountFilled")}: {resp.amount}
            </Typography>
            <Typography variant="body1">
              {t("MarketSymbol")}: {resp.marketSymbol}
            </Typography>
            <Typography variant="body1">
              {t("Side")}: {resp.isBuy == true ? t("Bought") : t("Sold")}
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}>
            <Typography variant="body1">{errors}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
