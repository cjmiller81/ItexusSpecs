import i18n from "@/libs/i18n/i18n";
import { LoadingButton } from "@mui/lab";
import { MenuItem, Select, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import { DecimalInput } from "components";
import MainCard, { MainCardProps } from "components/MainCard";
import { Form, Formik } from "formik";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { InferType, number, object, string } from "yup";

const requiredError = i18n.t("mandatoryField", { ns: "ErrorMessages" });
const WithdrawalModelSchema = object({
  amount: number().required(requiredError).min(0.1),
  currency: string().required(requiredError),
  destination: string().required(requiredError),
});

export type WithdrawalModel = InferType<typeof WithdrawalModelSchema>;

interface ICryptoAddress {
  id: string;
  walletAddress: string;
  addressTagMemo?: string;
}

interface IBankAccount {
  id: string;
  bankName: string;
  accountNumber?: string;
}

type Props = Omit<MainCardProps, "children"> & {
  isLoading: boolean;
  title: string;
  currenciesSelectLabel: string;
  currencies: string[];
  onRequestWithdrawal: (withdrawalRequest: WithdrawalModel) => Promise<void>;
  isCurrencyLoading?: boolean;
  cryptoAddresses?: ICryptoAddress[];
  bankAccounts?: IBankAccount[];
};

const textEllipsisStyle = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "200px",
};

const WithdrawalRequestSection: React.FC<Props> = ({
  onRequestWithdrawal,
  currenciesSelectLabel,
  title,
  currencies,
  isLoading,
  cryptoAddresses = [],
  bankAccounts = [],
}: Props) => {
  const inputRef = useRef<any>();
  const { t } = useTranslation("RequestSettlement");

  return (
    <MainCard
      sx={{ maxWidth: "790px", width: "100%" }}
      content={false}
      title={title}>
      <Formik<WithdrawalModel>
        initialValues={{
          amount: 0,
          currency: "",
          destination: "",
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={WithdrawalModelSchema}
        onSubmit={async (values, helpers) => {
          await onRequestWithdrawal(values);
          helpers.resetForm();
        }}>
        {({ errors, setFieldValue, handleChange, handleSubmit, touched, values }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid
                container
                spacing={3}>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t("Amount")}</InputLabel>
                    <DecimalInput
                      size="medium"
                      ref={inputRef}
                      name="amount"
                      autoComplete="on"
                      placeholder={t("EnterAmount")}
                      value={values.amount}
                      maxDecimals={5}
                      error={!!errors.amount}
                      helperText={errors.amount}
                      onChange={value => {
                        setFieldValue("amount", value);
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{currenciesSelectLabel}</InputLabel>
                    <Select
                      fullWidth
                      displayEmpty
                      name="currency"
                      size="medium"
                      renderValue={value => {
                        if (value === "") {
                          return (
                            <Typography color={theme => theme.palette.text.secondary}>{t("SelectCurrency")}</Typography>
                          );
                        }
                        return <Typography>{value}</Typography>;
                      }}
                      value={values.currency}
                      onChange={handleChange}
                      placeholder={t("SelectCurrency")}>
                      {currencies.map(currency => (
                        <MenuItem
                          key={currency}
                          value={currency}>
                          {currency}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  {touched.currency && errors.currency && <FormHelperText error>{errors.currency}</FormHelperText>}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t("Destination")}</InputLabel>
                    <Select
                      fullWidth
                      name="destination"
                      onChange={handleChange}
                      displayEmpty
                      value={values.destination}
                      renderValue={value => {
                        if (value === "") {
                          return (
                            <Typography color={theme => theme.palette.text.secondary}>
                              {t("SelectDestination")}
                            </Typography>
                          );
                        }

                        const selectedCryptoAddress = cryptoAddresses.find(addr => addr.walletAddress === value);
                        const selectedBankAccount = bankAccounts.find(account => account.accountNumber === value);

                        if (selectedCryptoAddress) {
                          return (
                            <Typography sx={textEllipsisStyle}>
                              {selectedCryptoAddress.addressTagMemo
                                ? `${selectedCryptoAddress.addressTagMemo} | ${selectedCryptoAddress.walletAddress}`
                                : selectedCryptoAddress.walletAddress}
                            </Typography>
                          );
                        } else if (selectedBankAccount) {
                          return (
                            <Typography sx={textEllipsisStyle}>
                              {`${selectedBankAccount.bankName} | ${selectedBankAccount.accountNumber}`}
                            </Typography>
                          );
                        }

                        return <Typography>{value}</Typography>;
                      }}
                      placeholder={t("SelectDestination")}
                      sx={{ width: "100%" }}>
                      {cryptoAddresses.map(address => (
                        <MenuItem
                          key={address.id}
                          value={address.walletAddress}>
                          <Typography sx={textEllipsisStyle}>
                            {address.addressTagMemo
                              ? `${address.addressTagMemo} | ${address.walletAddress}`
                              : address.walletAddress}
                          </Typography>
                        </MenuItem>
                      ))}
                      {bankAccounts.map(account => (
                        <MenuItem
                          key={account.id}
                          value={account.accountNumber}>
                          <Typography sx={textEllipsisStyle}>
                            {`${account.bankName} | ${account.accountNumber}`}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Box px={3}>
                    <LoadingButton
                      fullWidth
                      disabled={values.amount <= 0 || values.currency === "" || values.destination === ""}
                      loading={isLoading}
                      sx={{ px: 10, mt: 3.5, height: 40, textWrap: "nowrap" }}
                      type="submit"
                      variant="contained">
                      {t("RequestWithdrawal")}
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
};

export default WithdrawalRequestSection;
