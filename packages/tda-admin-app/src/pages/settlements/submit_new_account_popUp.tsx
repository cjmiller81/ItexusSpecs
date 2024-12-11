import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Grid,
  InputLabel,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "libs/redux/Store";
import { addBankAccount } from "features/tables/manage-bank-account-table/BankAccountsSlice";
import { v4 as uuid } from "uuid";
import Countries from "common/countries";
import Currencies from "@/common/currencies";
import { Stack, useTheme } from "@mui/system";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const SubmitNewAccPopUp: React.FC<{
  open: boolean;
  onClose: () => void;
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  t: (key: string) => string;
}> = ({ t, open, onClose, setFiles, files }) => {
  const [isFccInfoChecked, setIsFccInfoChecked] = useState(false);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object().shape({
    // @ts-ignore
    customName: Yup.string().required(t("CustomNameIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    accountType: Yup.string().required(t("AccountTypeIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    country: Yup.string().required(t("CountryIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    currency: Yup.string().required(t("CurrencyIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    accountHolderName: Yup.string().required(t("AccountHolderNameIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    bankName: Yup.string().required(t("BankNameIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    accountNumber: Yup.string().required(t("AccountNumberIsRequired", { ns: "ErrorMessages" })),
    // @ts-ignore
    routingNumber: Yup.string().required(t("RoutingNumberIsRequired", { ns: "ErrorMessages" })),
    bicSwiftCode: Yup.string().test(
      "bic-swift-code-required",
      // @ts-ignore
      t("BICSWIFTCodeIsRequired", { ns: "ErrorMessages" }),
      function (value) {
        const { country } = this.parent;
        if (country !== "USA" && !value) {
          return this.createError({
            path: "bicSwiftCode",
            // @ts-ignore
            message: t("BICSWIFTCodeIsRequired", { ns: "ErrorMessages" }),
          });
        }
        return true;
      },
    ),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  };

  const handleFileDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDialogClose = () => {
    setIsFccInfoChecked(false);
    onClose();
  };

  const handleSubmit = async values => {
    const newAccount = {
      id: uuid(),
      country: values.country,
      currency: values.currency,
      customName: values.customName,
      bankName: values.bankName,
      accountType: values.accountType,
      accountNumber: values.accountNumber,
      routingNumber: values.routingNumber,
      bicSwiftCode: values.bicSwiftCode,
      status: "Unverified" as const,
      files: files,
    };

    await dispatch(addBankAccount(newAccount));
    setIsFccInfoChecked(!isFccInfoChecked);
    handleDialogClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth>
      <DialogTitle>{t("AddANewBankAccount")}</DialogTitle>
      <Formik
        initialValues={{
          accountType: "",
          country: "",
          currency: "",
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          routingNumber: "",
          bicSwiftCode: "",
          customName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, values }) => (
          <Form>
            <DialogContent sx={{ pb: 6, pt: 3 }}>
              <Grid
                container
                spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("CustomName")}</InputLabel>
                  <Field
                    as={TextField}
                    fullWidth
                    name="customName"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="customName"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("AccountType")}</InputLabel>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    name="accountType"
                    margin="normal">
                    <MenuItem value="Checking Account">{t("Checking Account")}</MenuItem>
                    <MenuItem value="Savings Account">{t("Savings Account")}</MenuItem>
                  </Field>
                  <ErrorMessage
                    name="accountType"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("BankName")}</InputLabel>
                  <Field
                    as={TextField}
                    fullWidth
                    name="bankName"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="bankName"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("NameOfBankAccount")}</InputLabel>
                  <Field
                    as={TextField}
                    fullWidth
                    name="accountHolderName"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="accountHolderName"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("AccountNumber")}</InputLabel>
                  <Field
                    as={TextField}
                    fullWidth
                    name="accountNumber"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="accountNumber"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("RoutingNumber")}</InputLabel>
                  <Field
                    as={TextField}
                    fullWidth
                    name="routingNumber"
                    margin="normal"
                  />
                  <ErrorMessage
                    name="routingNumber"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("Currency")}</InputLabel>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    name="currency"
                    margin="normal">
                    {Currencies.map((currency, index) => (
                      <MenuItem
                        key={index}
                        value={currency}>
                        {t(currency)}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="currency"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}>
                  <InputLabel>{t("Country")}</InputLabel>
                  <Field
                    as={TextField}
                    select
                    fullWidth
                    name="country"
                    margin="normal">
                    {Countries.map((country, index) => (
                      <MenuItem
                        key={index}
                        value={country}>
                        {t(country)}
                      </MenuItem>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="country"
                    render={msg => <div style={{ color: "red" }}>{msg}</div>}
                  />
                </Grid>
                {values.country && values.country !== "United States" && (
                  <Grid
                    item
                    xs={12}
                    sm={4}>
                    <InputLabel>{t("BIC / SWIFT Code")}</InputLabel>
                    <Field
                      as={TextField}
                      fullWidth
                      name="bicSwiftCode"
                      margin="normal"
                    />
                    <ErrorMessage
                      name="bicSwiftCode"
                      render={msg => <div style={{ color: "red" }}>{msg}</div>}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid
                container
                spacing={2}
                sx={{ mt: 0 }}
                alignItems="center"
                justifyContent="space-between">
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel>{t("FCC Information (optional)")}</InputLabel>

                  <Grid
                    container
                    spacing={1}
                    sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                    <Grid
                      item
                      xs={1}
                      sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isFccInfoChecked}
                            onChange={() => setIsFccInfoChecked(!isFccInfoChecked)}
                          />
                        }
                        label={""}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={11}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="fccInfo"
                        multiline
                        minRows={2}
                        sx={{ marginTop: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  sx={{ mt: 0.9 }}
                  xs={12}
                  sm={6}>
                  <Stack
                    spacing={0.5}
                    sx={{ position: "relative" }}>
                    <InputLabel>{t("UploadBankStatement")}</InputLabel>
                    <Box
                      onDrop={handleFileDrop}
                      onDragOver={handleFileDragOver}
                      sx={{
                        border: "1px solid gray",
                        borderRadius: "4px",
                        p: 0.7,
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: theme.palette.grey[150],
                      }}
                      onClick={() => document.getElementById("file-input")?.click()}>
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <Box
                        sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src="/uploadCloud.svg"
                          alt="upload icon"
                          style={{ width: 60, height: 60, marginRight: 8 }}
                        />
                        <Box sx={{ textAlign: "left" }}>
                          <Typography
                            variant="h6"
                            sx={{ color: theme.palette.grey[500] }}
                            component="div">
                            {t("DragDropOrSelectFile")}
                          </Typography>
                          <Typography
                            sx={{ color: theme.palette.grey[500], mt: 0.6, fontSize: "9px" }}
                            component="div">
                            {t("DropFilesHereOrClick")}
                            <span style={{ color: "rgb(22, 104, 220)", textDecoration: "underline" }}>
                              {t("Browse")}
                            </span>
                            {t("ThroughYourMachine")}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      mt={1}
                      sx={{ position: "absolute", top: "98px" }}>
                      {files.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))}
                          sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={2}
                  container
                  justifyContent="flex-end">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 7.5 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}>
                      {t("Submit")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default SubmitNewAccPopUp;
