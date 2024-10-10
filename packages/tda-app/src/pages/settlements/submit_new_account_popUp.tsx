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

const validationSchema = Yup.object().shape({
  accountType: Yup.string().required("Account type is required"),
  country: Yup.string().required("Country is required"),
  currency: Yup.string().required("Currency is required"),
  accountHolderName: Yup.string().required("Account holder name is required"),
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  routingNumber: Yup.string().required("Routing number is required"),
  bicSwiftCode: Yup.string().required("BIC / SWIFT code is required"),
});

const SubmitNewAccPopUp: React.FC<{
  open: boolean;
  onClose: () => void;
  files;
  setFiles;
  t: (key: string) => string;
}> = ({ t, open, onClose, setFiles, files }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

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
      <DialogTitle sx={{ fontSize: 16, color: theme.palette.grey[600] }}>{t("AddANewBankAccount")}</DialogTitle>
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
                  <MenuItem value="Domestic Bank">{t("DomesticBank")}</MenuItem>
                  <MenuItem value="International Bank">{t("InternationalBank")}</MenuItem>
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
                  <Box
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ml: 7,
                    }}>
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
                        {t("Drag & Drop or Select file")}
                      </Typography>
                      <Typography
                        sx={{ color: theme.palette.grey[500], mt: 1, fontSize: "10px" }}
                        component="div">
                        {t("Drop files here or click ")}
                        <span style={{ color: "rgb(22, 104, 220)", textDecoration: "underline" }}>{t("browse")}</span>
                        {t(" through your machine")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                  {files.length > 0 && (
                    <Typography variant="body2">
                      {t("Uploaded Files:")}
                      <ul>
                        {files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </Typography>
                  )}
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
