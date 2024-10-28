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
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { InferType, number, object, string } from "yup";

const requiredError = i18n.t("mandatoryField", { ns: "ErrorMessages" });
const WithdrawalModelSchema = object({
  id: string().optional(),
  amount: number().required(requiredError).min(0.1),
  currency: string().required(requiredError),
  destination: string().required(requiredError),
  label: string().optional(),
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
  id?: string;
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
  id,
}: Props) => {
  const inputRef = useRef<any>();
  const { t } = useTranslation("RequestSettlement");

  const initialId = id || cryptoAddresses[0]?.id || bankAccounts[0]?.id || uuidv4();
  return (
    <MainCard
      sx={{ maxWidth: "790px", width: "100%" }}
      content={false}
      title={title}>
      <Formik<WithdrawalModel>
        initialValues={{
          id: initialId || "",
          amount: 0,
          currency: "",
          destination: "",
          label: currenciesSelectLabel || "",
        }}
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
                      value={values.destination}
                      onChange={handleChange}
                      renderValue={value => {
                        if (value === "") {
                          return (
                            <Typography color={theme => theme.palette.text.secondary}>
                              {t("SelectDestination")}
                            </Typography>
                          );
                        }

                        const selectedCryptoAddress = cryptoAddresses.find(addr => addr.id === value);
                        const selectedBankAccount = bankAccounts.find(account => account.id === value);
                        if (selectedCryptoAddress) {
                          return (
                            <Typography sx={textEllipsisStyle}>
                              {`${selectedCryptoAddress.addressTagMemo} | ${selectedCryptoAddress.walletAddress}`}
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
                      }}>
                      {(cryptoAddresses.length ? cryptoAddresses : bankAccounts).map(option => (
                        <MenuItem
                          key={option.id}
                          value={option.id}>
                          <Typography sx={textEllipsisStyle}>
                            {option.walletAddress
                              ? `${option.addressTagMemo ? `${option.addressTagMemo} | ` : ""}${option.walletAddress}`
                              : `${option.bankName} - ${option.accountNumber}`}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  {touched.destination && errors.destination && (
                    <FormHelperText error>{errors.destination}</FormHelperText>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}>
                  <Box>
                    <LoadingButton
                      fullWidth
                      disableElevation
                      loading={isLoading}
                      sx={{ px: 10, mt: 3.5, height: 40, textWrap: "nowrap" }}
                      type="submit"
                      variant="contained"
                      color="primary">
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
