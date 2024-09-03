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

const FundingInstructions: React.FC = () => {
  const theme = useTheme();

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
          TDA Deposit Instructions
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          color={theme.palette.text.secondary}>
          The below funding instructions belong to TDA. In order to fund your account, send crypto to your designated
          funding wallets, or fiat to the bank funding instructions.
        </Typography>

        <Box my={4}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            color={theme.palette.text.primary}>
            TDA Designated Funding Wallets
          </Typography>
          <Alert severity="info">
            Please note we need a minimum of one confirmation before the funds can be credited. This can take more time
            if the amount sent is large.
          </Alert>
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
                  <TableCell sx={{ color: theme.palette.text.primary }}>Currency</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Protocol</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>TDA Settlement Address</TableCell>
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
            TDA's USD Funding Instructions
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
              Bank Wire Instructions:
            </Typography>
            <Typography variant="body2">
              <strong>Bank Name:</strong> {bankInstructions.bankName}
            </Typography>
            <Typography variant="body2">
              <strong>Account Name:</strong> {bankInstructions.accountName}
            </Typography>
            <Typography variant="body2">
              <strong>Account Number:</strong> {bankInstructions.accountNumber}
            </Typography>
            <Typography variant="body2">
              <strong>Routing Number (ABA):</strong> {bankInstructions.routingNumber}
            </Typography>
            <Typography variant="body2">
              <strong>SWIFT Code:</strong> {bankInstructions.swiftCode}
            </Typography>
            <Typography variant="body2">
              <strong>Bank Address:</strong> {bankInstructions.bankAddress}
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.error.main}
              sx={{ mt: 2 }}>
              <strong>Important:</strong> Please include your TDA account number in the wire transfer memo/reference
              field.
            </Typography>
          </Box>
          <Alert
            severity="warning"
            sx={{ mt: 2 }}>
            TDA does not accept payments from third parties (including omnibus exchange accounts). Third-party funds
            will be returned after a deduction of a 250 USD processing fee to cover the compliance and accounting costs
            of handling such transfers. A 48-hour minimum holding period is required to allow us to perform the
            requisite checks.
          </Alert>
        </Box>
      </Box>
    </Container>
  );
};

export default FundingInstructions;
