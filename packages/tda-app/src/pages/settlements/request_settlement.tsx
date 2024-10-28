import BalanceWidgetSection from "@/features/balance-widget/BalanceWidgetSection";
import SettlementHistorySection from "@/features/settlement-history/SettlementHistorySection";
import WithdrawalRequestConfirmationModal from "@/features/withdrawal-request/WithdrawalRequestConfirmationModal";
import WithdrawalRequestSection from "@/features/withdrawal-request/WithdrawalRequestSection";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchCryptoAddress } from "features/tables/crypto-addresses-table/cryptoAddressesSlice";
import { fetchBankAccounts } from "features/tables/manage-bank-account-table/BankAccountsSlice";
import { WithdrawalModel } from "@/features/withdrawal-request/WithdrawalRequestSection";

const RequestSettlement: React.FC = () => {
  const { t } = useTranslation("RequestSettlement");
  const isRelativeBalances = useMediaQuery("(max-width: 1200px)");
  const dispatch = useAppDispatch();
  const cryptoCurrencies = useAppSelector(state => state.balancesWidget.cryptoCurrencies);
  const fiatCurrencies = useAppSelector(state => state.balancesWidget.fiatCurrencies);
  const cryptoAddresses = useAppSelector(state => state.cryptoAddresses.accounts);
  const bankAccounts = useAppSelector(state => state.bankAccounts.accounts);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCryptoAddress());
    dispatch(fetchBankAccounts());
  }, [dispatch]);

  const onRequestCryptoWithdrawal = async (withdrawalRequest: WithdrawalModel) => {
    setConfirmationModalOpen(true);
  };

  const onRequestFiatoWithdrawal = async (withdrawalRequest: WithdrawalModel) => {
    setConfirmationModalOpen(true);
  };

  const cryptoCurrenciesList = useMemo(() => [...new Set(cryptoCurrencies.map(c => c.name))], [cryptoCurrencies]);
  const fiatCurrenciesList = useMemo(() => [...new Set(fiatCurrencies.map(c => c.name))], [fiatCurrencies]);

  return (
    <>
      <Typography variant="h3">{t("RequestSettlementTitle")}</Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <Grid
          item
          xs={12}>
          <WithdrawalRequestConfirmationModal
            onClose={() => setConfirmationModalOpen(false)}
            open={isConfirmationModalOpen}
          />
          <Grid
            container
            mt={2}
            spacing={2}>
            <Grid
              item
              xs={12}>
              <Stack
                alignItems="center"
                justifyContent="center">
                <BalanceWidgetSection
                  width={theme => (isRelativeBalances ? "400px" : theme.spacing(21))}
                  direction={isRelativeBalances ? "row" : "column"}
                  sx={{
                    top: 0,
                    position: "absolute",
                    right: 43,
                    ...(isRelativeBalances && { position: "relative" }),
                  }}
                />
              </Stack>
            </Grid>
            <Grid
              sx={{ paddingTop: "54px !important" }}
              item
              xs={12}>
              <Stack
                spacing={2}
                paddingRight={isRelativeBalances ? "0px" : "210px"}
                direction={isRelativeBalances ? "column" : "row"}
                justifyContent={isRelativeBalances ? "center" : "flex-start"}
                alignItems={isRelativeBalances ? "center" : "flex-start"}
                width={"100%"}>
                <WithdrawalRequestSection
                  title={t("CryptoWithdrawalRequest")}
                  currenciesSelectLabel={t("CryptoCurrency")}
                  currencies={cryptoCurrenciesList}
                  isLoading={false}
                  onRequestWithdrawal={onRequestCryptoWithdrawal}
                  cryptoAddresses={cryptoAddresses}
                />
                <WithdrawalRequestSection
                  title={t("FiatWithdrawalRequest")}
                  currenciesSelectLabel={t("FiatCurrency")}
                  currencies={fiatCurrenciesList}
                  isLoading={false}
                  onRequestWithdrawal={onRequestFiatoWithdrawal}
                  bankAccounts={bankAccounts}
                />
              </Stack>
            </Grid>
            <Grid
              sx={{ paddingTop: "15px !important" }}
              item
              xs={12}>
              <SettlementHistorySection />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RequestSettlement;
