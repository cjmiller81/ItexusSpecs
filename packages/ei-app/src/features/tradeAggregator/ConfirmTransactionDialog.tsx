import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function ConfirmTransactionDialog({ open, onClose, tradeData, selectedCEX, onConfirmTransaction }) {
  const { t } = useTranslation(["TradeTable"]);

  if (!tradeData) return null;

  const [basePair, quotePair] = tradeData.mkt ? tradeData.mkt.split('/') : ['', ''];
  const isBuy = tradeData.action === 'buy';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" >
      <DialogTitle>{t("ConfirmTransaction")}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={1}>
          {[
            { label: t("MKT"), value: tradeData.mkt },
            { label: t("Buy"), value: isBuy ? basePair : quotePair },
            { label: t("Sell"), value: isBuy ? quotePair : basePair },
            { label: t("Qty"), value: tradeData.qty },
            { label: t("EstTotal"), value: tradeData.value },
            { label: t("Exchange"), value: selectedCEX },
          ].map(({ label, value }) => (
            <Box key={label} display="flex" justifyContent="space-between">
              <Typography variant="body1"><strong>{label}:</strong></Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">{t("Cancel")}</Button>
        <Button onClick={onConfirmTransaction} color="primary" variant="contained">
          {t("Confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}