import { openSnackbar } from "@/api/snackbar";
import BalanceWidgetSection from "@/features/balance-widget/BalanceWidgetSection";
import { fetchPairs } from "@/features/trading/rfq/slices/currenciesSlice";
import WithdrawalRequestSection from "@/features/withdrawal-request/WithdrawalRequestSection";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { SnackbarProps } from "@/types/snackbar";
import { Grid, useMediaQuery } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const RequestSettlement: React.FC = () => {
  const { t } = useTranslation("RequestSettlement");
  const isRelativeBalances = useMediaQuery("(max-width: 1200px)");
  const [isLoading, setIsLoading] = useState(false);
  const cryptoCurrencies = useAppSelector(state => state.balancesWidget.cryptoCurrencies);
  const fiatCurrencies = useAppSelector(state => state.balancesWidget.fiatCurrencies);

  const onRequestWithdrawal = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    openSnackbar({
      open: true,
      message: t("WithdrawalRequestSubmitted"),
      variant: "alert",
      alert: {
        color: "success",
      },
    } as SnackbarProps);
  };


  const currenciesList = useMemo(
    () => [...new Set([...fiatCurrencies.map(c => c.name), ...cryptoCurrencies.map(c => c.name)])],
    [cryptoCurrencies, fiatCurrencies],
  );

  return (
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
              right: 0,
              ...(isRelativeBalances && {
                position: "relative",
              }),
            }}
          />
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}>
        <Stack
          justifyContent={isRelativeBalances ? "center" : "flex-start"}
          alignItems={isRelativeBalances ? "center" : "flex-start"}
          width={"100%"}>
          <WithdrawalRequestSection
            currencies={currenciesList}
            isLoading={isLoading}
            onRequestWithdrawal={onRequestWithdrawal}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RequestSettlement;
