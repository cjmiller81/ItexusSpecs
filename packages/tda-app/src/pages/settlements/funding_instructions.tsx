import React from "react";
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

const FundingInstructions: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("FundingInstructions");

  const cryptoWallets = [
    { currency: "BTC", protocol: "N/A", address: "************" },
    { currency: "USDT", protocol: "ERC20", address: "************" },
    { currency: "USDT", protocol: "TRC20", address: "************" },
    { currency: "SOL", protocol: "N/A", address: "************" },
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
                  <TableCell sx={{ color: theme.palette.text.primary }}>{t("TDASettlementAddress")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cryptoWallets.map((wallet, index) => (
                  <TableRow key={index}>
                    <TableCell>{wallet.currency}</TableCell>
                    <TableCell>{wallet.protocol}</TableCell>
                    <TableCell>{wallet.address}</TableCell>
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
            {t("USDInstructionTitle")}
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
