import React, { useRef, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  useTheme,
  Grid,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

const FundingInstructions: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("FundingInstructions");
  const [showAddress, setShowAddress] = useState<{ [key: number]: boolean }>({});
  const [showBankDetails, setShowBankDetails] = useState<{ [key: number]: boolean }>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleClickShowAddress = (index: number) => {
    setShowAddress(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleClickShowBankDetails = (index: number) => {
    setShowBankDetails(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleMouseDownAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const cryptoWallets = [
    { currency: "BTC", protocol: "N/A", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    { currency: "USDT", protocol: "ERC20", address: "0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67" },
    { currency: "USDT", protocol: "TRC20", address: "TNkRcnU9xKg6MtjqRGrAZvYr6THPPNd6dD" },
    { currency: "SOL", protocol: "N/A", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
  ];

  const bankInstructions = [
    { title: "Bank Name", value: "Worlds Private Bank" },
    { title: "Account Name", value: "Johnson" },
    { title: "Account Number", value: "634C0532925" },
    { title: "Routing Number", value: "E442e55EcD9025" },
    { title: "Swift Code", value: "TfTL5SLmv7Divf" },
    { title: "Bank Address", value: "Manhattan, NY 10036, United States" },
  ];

  return (
    <>
      <Typography
        sx={{ mt: "16px" }}
        variant="h3">
        {t("FundingInstructionsTitle")}
      </Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <Grid
          item
          xs={12}>
          <Container maxWidth="md">
            <Box my={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color={theme.palette.text.primary}>
                {t("TDADepositInstructions")}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                color={theme.palette.text.secondary}>
                {t("InstructionsIntro")}
              </Typography>

              <Box my={4}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color={theme.palette.text.primary}>
                  {t("TDAFundingWallets")}
                </Typography>
                <Alert severity="info">{t("WalletsInfoAlert")}</Alert>
                <TableContainer
                  component={Paper}
                  sx={{ my: 2, backgroundColor: theme.palette.background.paper, borderRadius: "10px" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: theme.palette.text.primary }}>{t("Currency")}</TableCell>
                        <TableCell sx={{ color: theme.palette.text.primary }}>{t("Protocol")}</TableCell>
                        <TableCell sx={{ color: theme.palette.text.primary }}>{t("SettlementAddress")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cryptoWallets.map((wallet, index) => (
                        <TableRow key={index}>
                          <TableCell>{wallet.currency}</TableCell>
                          <TableCell>{wallet.protocol}</TableCell>
                          <FormControl
                            sx={{ m: 1, width: "95%" }}
                            variant="outlined">
                            <OutlinedInput
                              id={`outlined-adornment-wallet-${index}`}
                              type={showAddress[index] ? "text" : "password"}
                              value={wallet.address}
                              inputRef={el => (inputRefs.current[index] = el)}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    sx={{ mr: "1px" }}
                                    aria-label="toggle address visibility"
                                    onClick={() => handleClickShowAddress(index)}
                                    onMouseDown={handleMouseDownAddress}
                                    edge="end">
                                    {showAddress[index] ? (
                                      <VisibilityOff fontSize="small" />
                                    ) : (
                                      <Visibility fontSize="small" />
                                    )}
                                  </IconButton>

                                  <IconButton
                                    aria-label="copy address"
                                    onClick={() => handleCopyAddress(wallet.address)}
                                    edge="end">
                                    <FileCopyOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box my={4}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  color={theme.palette.text.primary}>
                  {t("InstructionTitle")}
                </Typography>
                <Box
                  component={Paper}
                  p={2}
                  sx={{ backgroundColor: theme.palette.background.paper, borderRadius: "10px" }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    color={theme.palette.text.primary}>
                    {t("BankWireInstructions")}
                  </Typography>

                  <Grid container>
                    <Grid
                      item
                      xs={12}>
                      <Box sx={{ maxWidth: "570px", mt: 2 }}>
                        <Box component={Paper}>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center">
                            {bankInstructions.map((instruction, index) => (
                              <React.Fragment key={index}>
                                <Grid
                                  sx={{
                                    margin: "5px 0 !important",
                                    padding: "0 15px !important",
                                  }}
                                  item
                                  xs={4}>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontSize: 16 }}
                                    color={theme.palette.text.primary}>
                                    {t(instruction.title.replace(/\s+/g, ""))}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={8}>
                                  <FormControl
                                    fullWidth
                                    variant="outlined">
                                    <OutlinedInput
                                      value={instruction.value}
                                      type={showBankDetails[index] ? "text" : "password"}
                                      readOnly
                                      endAdornment={
                                        <InputAdornment position="end">
                                          <IconButton
                                            sx={{ mr: 0.5 }}
                                            aria-label={`toggle ${instruction.title.toLowerCase()} visibility`}
                                            onClick={() => handleClickShowBankDetails(index)}
                                            onMouseDown={handleMouseDownAddress}
                                            edge="end">
                                            {showBankDetails[index] ? (
                                              <VisibilityOff fontSize="small" />
                                            ) : (
                                              <Visibility fontSize="small" />
                                            )}
                                          </IconButton>
                                          <IconButton
                                            aria-label={`copy ${instruction.title.toLowerCase()}`}
                                            onClick={() => handleCopyAddress(instruction.value)}
                                            edge="end">
                                            <FileCopyOutlinedIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                              </React.Fragment>
                            ))}
                          </Grid>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color={theme.palette.error.main}
                        sx={{ mt: 2 }}>
                        <strong>{t("ImportantNote")}</strong>
                      </Typography>

                      <Alert
                        severity="warning"
                        sx={{ mt: 2 }}>
                        {t("ThirdPartyWarning")}
                      </Alert>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default FundingInstructions;
