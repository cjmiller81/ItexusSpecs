import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Stack,
  InputLabel,
  Box,
  useTheme,
  Chip,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IBankAccount } from "mocks/initBankAccounts";
import { useAppDispatch } from "libs/redux/Store";
import { addBankAccount } from "features/tables/manage-bank-account-table/BankAccountsSlice";
import { v4 as uuid } from "uuid";
import Typography from "@mui/material/Typography";

const SubmitNewAccPopUp: React.FC<{
  open: boolean;
  onClose: () => void;
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
  t: (key: string) => string;
}> = ({ t, open, onClose, setFiles, files }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object().shape({
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
    // @ts-ignore
    bicSwiftCode: Yup.string().required(t("BICSWIFTCodeIsRequired", { ns: "ErrorMessages" })),
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

  const handleSubmit = async values => {
    const newAccount: IBankAccount = {
      id: uuid(),
      country: values.country,
      currency: values.currency,
      customName: values.customName,
      bankName: values.bankName,
      accountType: values.accountType,
      accountNumber: values.accountNumber,
      routingNumber: values.routingNumber,
      bicSwiftCode: values.bicSwiftCode,
      status: "Unverified",
      files: files,
    };

    await dispatch(addBankAccount(newAccount));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: theme.palette.grey[50],
          color: "#000",
        },
      }}
      fullWidth>
      <DialogTitle
        sx={{
          fontSize: 16,
          fontWeight: "bold",
          color: theme.palette.grey[600],
        }}>
        {t("AddANewBankAccount")}
      </DialogTitle>
      <Formik
        initialValues={{
          accountType: "",
          country: "USA",
          currency: "USD",
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          routingNumber: "",
          bicSwiftCode: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <DialogContent>
              <Stack spacing={0.5}>
                <InputLabel>{t("AccountType")}</InputLabel>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="accountType"
                  margin="normal">
                  <MenuItem value={t("DomesticBank")}>{t("DomesticBank")}</MenuItem>
                  <MenuItem value={t("InternationalBank")}>{t("InternationalBank")}</MenuItem>
                </Field>
                <ErrorMessage
                  name="accountType"
                  render={msg => <div style={{ color: "red" }}>{msg}</div>}
                />
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("Country")}</InputLabel>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="country"
                  margin="normal">
                  <MenuItem value="USA">{t("USA")}</MenuItem>
                </Field>
                <ErrorMessage
                  name="country"
                  render={msg => <div style={{ color: "red" }}>{msg}</div>}
                />
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("Currency")}</InputLabel>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="currency"
                  margin="normal">
                  <MenuItem value="USD">{t("USD")}</MenuItem>
                  <MenuItem value="BRL">{t("BRL")}</MenuItem>
                  <MenuItem value="EUR">{t("EUR")}</MenuItem>
                </Field>
                <ErrorMessage
                  name="currency"
                  render={msg => <div style={{ color: "red" }}>{msg}</div>}
                />
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("CustomNameTag")}</InputLabel>
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
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("AccountHolderName")}</InputLabel>
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
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
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
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
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
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
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
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 1 }}>
                <InputLabel>{t("BICSwiftCode")}</InputLabel>
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
              </Stack>

              <Stack
                spacing={0.5}
                sx={{ mt: 2 }}>
                <InputLabel>{t("UploadBankStatement")}</InputLabel>
                <Box
                  onDrop={handleFileDrop}
                  onDragOver={handleFileDragOver}
                  sx={{
                    border: "1px solid gray",
                    borderRadius: "4px",
                    p: 2,
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
                  <Box sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src="/uploadCloud.svg"
                      alt="upload icon"
                      style={{ width: 74, height: 74, marginRight: 8 }}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      <Typography
                        variant="h6"
                        sx={{ color: theme.palette.grey[500] }}
                        component="div">
                        {t("DragDropOrSelectFile")}
                      </Typography>
                      <Typography
                        sx={{ color: theme.palette.grey[500], mt: 1, fontSize: "10px" }}
                        component="div">
                        {t("DropFilesHereOrClick")}
                        <span style={{ color: "rgb(22, 104, 220)", textDecoration: "underline" }}>{t("Browse")}</span>
                        {t("ThroughYourMachine")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box mt={1}>
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

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Chip
                  label={t("Submit")}
                  onClick={() => {
                    if (!isSubmitting) {
                      const hasErrors = Object.keys(errors).some(key => touched[key]);
                      if (!hasErrors) {
                        document.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true }));
                      } else {
                        console.log("Form has errors", errors);
                      }
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    padding: "10px 20px",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                />
              </Box>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default SubmitNewAccPopUp;
