import React from "react";
import { Box, Typography, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card } from "@mui/material";
import { useAppSelector } from "../../../slices";
import { useTranslation } from "react-i18next";
import { filterDustTokens } from "../../../helpers/filterDustTokens";
import { WALLET_COLORS } from "../../../constants/colors";

interface WalletTokensOverviewProps {
  walletAddress: string;
  tokens?: any[];
  showDust?: boolean;
}

const WalletTokensOverview: React.FC<WalletTokensOverviewProps> = ({
  walletAddress,
  tokens: externalTokens,
  showDust = false 
}) => {
  const theme = useTheme();
  const { t } = useTranslation("ColumnsDefs");
  
  const { portfolioWalletData } = useAppSelector((state) => state.wallets);
  if (!Array.isArray(portfolioWalletData)) return null;

  const wallet = portfolioWalletData.find((w) => w.walletAddress === walletAddress);
  if (!wallet || !wallet.tokenHoldings) {
    return (
      <Typography>
        No valid Wallet Tokens found for this wallet.
      </Typography>
    );
  }

  const tokensToDisplay = externalTokens || 
    (showDust ? wallet.tokenHoldings : filterDustTokens(wallet.tokenHoldings));

  const rows = tokensToDisplay.map((token, index) => ({
    id: index,
    token: token.symbol,
    name: token.name,
    network: token.network,
    logo: token.logoUrl,
    balance: token.balance,
    price: token.price,
    value: token.balanceUSD,
    portfolioPercent: wallet.totalValueUSD && wallet.totalValueUSD > 0 
      ? (token.balanceUSD / wallet.totalValueUSD) * 100 
      : 0,
  }));
  
const networkMap: Record<string, string> = {
  'binance-smart-chain': 'BNB Chain',
    'ethereum': 'Ethereum',
    'arbitrum': 'Arbitrum',
    'polygon': 'Polygon',
    'optimism': 'Optimism',
    'base': 'Base',
    'gnosis': 'Gnosis',
    'blast': 'Blast',
    'fantom': 'Fantom',
    "zksync": "Zksync",
    "avalanche": "Avalanche"
};

  return (
    <Box mt={2} sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden", boxSizing: "border-box" }}>
      <Card elevation={3} sx={{ width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
        <Box sx={{ 
          width: "100%", 
          maxWidth: "100%", 
          minWidth: 0, 
          boxSizing: "border-box",
          backgroundColor: theme.palette.mode === "dark" ? "#363f4cff" : "#f0ece5",
        }}>
          <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "24.5%", fontWeight: 500, pl: 1.5 }}>
                    {t("Token")}
                  </TableCell>
                  <TableCell sx={{ width: "20.8%", fontWeight: 500 }}>
                    {t("Network")}
                  </TableCell>
                  <TableCell align="left" sx={{ width: "12%", fontWeight: 500 }}>
                    {t("Balance")}
                  </TableCell>
                  <TableCell align="left" sx={{ width: "11.8%", fontWeight: 500 }}>
                    {t("Price")}
                  </TableCell>
                  <TableCell align="left" sx={{ width: "16.8%", fontWeight: 500 }}>
                    {t("Value")}
                  </TableCell>
                  <TableCell align="left" sx={{ width: "12.8%", fontWeight: 500 }}>
                    {t("ProcentOfPotfolio")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ pl: 1.5 }}>
                      <Box display="flex" alignItems="center">
                        <Typography fontWeight={500}>
                          {row.token}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={1}
                          fontSize={12}
                        >
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        display="inline-block"
                        px={1}
                        py={0.5}
                        border="1px solid"
                        borderColor="rgba(148,163,184,0.3)"
                        borderRadius={1}
                        fontSize={12}
                        sx={(theme) => ({
                          color: theme.palette.mode === "dark" ? "rgba(203,213,225,1)" : "#000",
                          bgcolor: "rgba(71,85,105,0.2)",
                        })}
                      >
                        {networkMap[row.network] ?? row.network}
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Typography fontSize={14}>
                        {row.balance < 0.0001
                          ? row.balance.toExponential(2)
                          : row.balance.toLocaleString(undefined, {
                              maximumFractionDigits: 4,
                            })}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography fontSize={14}>
                        ${row.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography fontWeight={600}>
                        ${row.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        width="100%"
                      >
                        <Typography fontSize={14} mr={1}>
                          {row.portfolioPercent.toFixed(1)}%
                        </Typography>
                        <Box
                          sx={{
                            width: 64,
                            height: 8,
                            bgcolor: "rgba(71,85,105,0.5)",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${Math.min(row.portfolioPercent, 100)}%`,
                              bgcolor: theme.palette.mode === "dark" ? WALLET_COLORS.tokens.dark : WALLET_COLORS.tokens.light,
                              transition: "width 0.3s ease-in-out",
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Box>
  );
}

export default WalletTokensOverview;
