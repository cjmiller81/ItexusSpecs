import React, { useRef, useEffect } from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility } from "@mui/icons-material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

const FundingInstructions: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("FundingInstructions");
  const [showAddress, setShowAddress] = React.useState<{ [key: number]: boolean }>({});

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleClickShowAddress = (index: number) => {
    setShowAddress(prevState => ({
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

  const handleClickOutside = (event: MouseEvent) => {
    inputRefs.current.forEach((inputRef, index) => {
      if (inputRef && !inputRef.contains(event.target as Node)) {
        setShowAddress(prevState => ({
          ...prevState,
          [index]: false,
        }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cryptoWallets = [
    { currency: "BTC", protocol: "N/A", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    { currency: "USDT", protocol: "ERC20", address: "0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67" },
    { currency: "USDT", protocol: "TRC20", address: "TNkRcnU9xKg6MtjqRGrAZvYr6THPPNd6dD" },
    { currency: "SOL", protocol: "N/A", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
  ];

  const bankInstructions = {
    bankName: "************",
    accountName: "************",
    accountNumber: "************",
    routingNumber: "************",
    swiftCode: "************",
    bankAddress: "************",
  };

  return (
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
            sx={{
              my: 2,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}>
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
            variant="h5"
            component="h2"
            gutterBottom
            color={theme.palette.text.primary}>
            {t("InstructionTitle")}
          </Typography>
          <Box
            component={Paper}
            p={2}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}>
            <Typography
              variant="body3"
              component="h4"
              gutterBottom
              color={theme.palette.text.primary}>
              {t("BankWireInstructions")}
            </Typography>
            <Typography variant="body2">
              <strong>{t("BankName")}</strong> {bankInstructions.bankName}
            </Typography>
            <Typography variant="body2">
              <strong>{t("AccountName")}</strong> {bankInstructions.accountName}
            </Typography>
            <Typography variant="body2">
              <strong>{t("AccountNumber")}</strong> {bankInstructions.accountNumber}
            </Typography>
            <Typography variant="body2">
              <strong>{t("RoutingNumber")}</strong> {bankInstructions.routingNumber}
            </Typography>
            <Typography variant="body2">
              <strong>{t("SWIFTCode")}</strong> {bankInstructions.swiftCode}
            </Typography>
            <Typography variant="body2">
              <strong>{t("BankAddress")}</strong> {bankInstructions.bankAddress}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.error.main}
              sx={{ mt: 2 }}>
              <strong>{t("ImportantNote")}</strong>
            </Typography>
          </Box>
          <Alert
            severity="warning"
            sx={{ mt: 2 }}>
            {t("ThirdPartyWarning")}
          </Alert>
        </Box>
      </Box>
    </Container>
  );
};

export default FundingInstructions;
