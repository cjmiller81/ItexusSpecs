import WithdrawalRequestConfirmationModal from "@/features/withdrawal-request/WithdrawalRequestConfirmationModal";
import { useAppDispatch } from "@/libs/redux/Store";
import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchCryptoAddress } from "features/tables/crypto-addresses-table/cryptoAddressesSlice";
import { fetchBankAccounts } from "features/tables/manage-bank-account-table/BankAccountsSlice";

const RequestSettlement: React.FC = () => {
  const { t } = useTranslation("RequestSettlement");
  const dispatch = useAppDispatch();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCryptoAddress());
    dispatch(fetchBankAccounts());
  }, [dispatch]);

  return (
    <>
      <Typography
        sx={{ mt: "16px !important" }}
        variant="h3">
        {t("RequestSettlementTitle")}
      </Typography>
      <Grid
        container
        spacing={2}>
        <Grid
          item
          xs={12}>
          <WithdrawalRequestConfirmationModal
            onClose={() => setConfirmationModalOpen(false)}
            open={isConfirmationModalOpen}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default RequestSettlement;
