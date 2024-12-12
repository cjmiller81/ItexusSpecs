import React from "react";
import { Box, Button, Grid, Stack, TextField, Typography, InputLabel, useTheme } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { addCryptoAddress } from "features/tables/crypto-addresses-table/cryptoAddressesSlice";

const AddNewAddressForm = () => {
  const { t } = useTranslation("ManageCryptoAddresses");
  const dispatch = useDispatch();
  const theme = useTheme();

  const validationSchema = Yup.object({
    walletAddress: Yup.string().required(t("WalletAddressIsRequired", { ns: "ErrorMessages" })),
    addressTagMemo: Yup.string().required(t("AddressTagMemoIsRequired", { ns: "ErrorMessages" })),
    blockchain: Yup.string().required(t("BlockchainIsRequired", { ns: "ErrorMessages" })),
    firstName: Yup.string().required(t("FirstNameIsRequired", { ns: "ErrorMessages" })),
    middleName: Yup.string(),
    lastName: Yup.string().required(t("LastNameIsRequired", { ns: "ErrorMessages" })),
  });

  const initialValues = {
    walletAddress: "",
    addressTagMemo: "",
    blockchain: "",
    firstName: "",
    middleName: "",
    lastName: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const newCryptoAddress = {
      id: uuid(),
      status: "Unverified",
      walletAddress: values.walletAddress,
      addressTagMemo: values.addressTagMemo,
      blockchain: values.blockchain,
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
    };

    await dispatch(addCryptoAddress(newCryptoAddress));
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: theme.palette.grey[100],
            margin: "auto",
          }}>
          <Typography
            variant="subtitle1"
            mb={2}>
            {t("AddressWhitelist")}
          </Typography>
          <Grid
            container
            mt={3}
            sx={{ padding: "20px", borderRadius: "10px" }}
            spacing={2}>
            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}>
              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("WalletAddress")}</InputLabel>
                <Field
                  as={TextField}
                  fullWidth
                  name="walletAddress"
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage name="walletAddress">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}>
              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("AddressTagMemo")}</InputLabel>
                <Field
                  as={TextField}
                  fullWidth
                  name="addressTagMemo"
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage name="addressTagMemo">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}>
              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("Blockchain")}</InputLabel>
                <Field
                  as={TextField}
                  fullWidth
                  name="blockchain"
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage name="blockchain">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}>
              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("FirstName")}</InputLabel>
                <Field
                  as={TextField}
                  fullWidth
                  name="firstName"
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage name="firstName">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}>
              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("MiddleName")}</InputLabel>
                <Field
                  as={TextField}
                  fullWidth
                  name="middleName"
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage name="middleName">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}>
              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("LastName")}</InputLabel>
                <Field
                  as={TextField}
                  fullWidth
                  name="lastName"
                  variant="outlined"
                  margin="normal"
                />
                <ErrorMessage name="lastName">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{ width: "100%" }}
              xs={12}
              textAlign="right">
              <Button
                type="submit"
                variant="contained"
                color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
};

export default AddNewAddressForm;
