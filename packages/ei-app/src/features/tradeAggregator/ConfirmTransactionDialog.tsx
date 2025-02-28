import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function ConfirmTransactionDialog({ open, onClose, tradeData, selectedCEX }) {
  const { t } = useTranslation(["TradeTable"]);

  if (!tradeData) return null;

  const [basePair, quotePair] = tradeData.mkt ? tradeData.mkt.split('/') : ['', ''];
  const isBuy = tradeData.action === 'buy';

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("ConfirmTransaction")}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography><strong>{t("MKT")}:</strong> {tradeData.mkt}</Typography>
          <Typography><strong>{t("Buy")}:</strong> {isBuy ? basePair : quotePair}</Typography>
          <Typography><strong>{t("Sell")}:</strong> {isBuy ? quotePair : basePair}</Typography>
          <Typography><strong>{t("Qty")}:</strong> {tradeData.qty}</Typography>
          <Typography><strong>{t("EstTotal")}:</strong> {tradeData.value}</Typography>
          <Typography><strong>{t("Exchange")}:</strong> {selectedCEX}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">{t("Cancel")}</Button>
        <Button onClick={() => {onClose(); }} color="primary" variant="contained">
          {t("Confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}