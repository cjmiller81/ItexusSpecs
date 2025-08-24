import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

  const totalFilteredValue = tokensToDisplay.reduce(
    (sum, token) => sum + (token.balanceUSD || 0), 0
  );

  const rows = tokensToDisplay.map((token, index) => ({
    id: index,
    token: token.symbol,
    name: token.name,
    network: token.network,
    logo: token.logoUrl,
    balance: token.balance,
    price: token.price,
    value: token.balanceUSD,
    portfolioPercent: totalFilteredValue > 0 
      ? (token.balanceUSD / totalFilteredValue) * 100 
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

const columns: GridColDef<typeof rows[number]>[] = [
  {
    field: "token",
    headerName: t("Token"),
    flex: 25,
    renderCell: (params) => (
      <Box display="flex" alignItems="center">
        <Typography fontWeight={500}>
          {params.row.token}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          ml={1}
          fontSize={12}
        >
          {params.row.name}
        </Typography>
      </Box>
    ),
  },
  {
    field: "network",
    headerName: t("Network"),
    flex: 10,
    renderCell: (params) => (
      <Box
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
        {networkMap[params.value] ?? params.value}
      </Box>
    ),
  },
  {
    field: "balance",
    headerName: t("Balance"),
    align: "right",
    headerAlign: "right",
    flex: 12, 
    renderCell: (params) => (
      <Typography fontSize={14}>
        {params.value < 0.0001
          ? params.value.toExponential(2)
          : params.value.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
      </Typography>
    ),
  },
  {
    field: "price",
    headerName: t("Price"),
    align: "right",
    headerAlign: "right",
    flex: 10,
    renderCell: (params) => (
      <Typography fontSize={14}>
        ${params.value.toFixed(2)}
      </Typography>
    ),
  },
  {
    field: "value",
    headerName: t("Value"),
    align: "right",
    headerAlign: "right",
    flex: 10,
    renderCell: (params) => (
      <Typography fontWeight={600}>
        ${params.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
    ),
  },
  {
    field: "portfolioPercent",
    headerName: t("ProcentOfPotfolio"),
    align: "right",
    headerAlign: "right",
    flex: 17,
    renderCell: (params) => (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        width="100%"
      >
        <Typography fontSize={14} mr={1}>
          {params.value.toFixed(1)}%
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
                  width: `${Math.min(params.value, 100)}%`,
                  bgcolor: theme.palette.mode === "dark" ? WALLET_COLORS.tokens.dark : WALLET_COLORS.tokens.light,
                  transition: "width 0.3s ease-in-out",
                }}
              />
        </Box>
      </Box>
    ),
  },
];

     return (
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", minHeight: "auto", height: "auto" }}>
      {tokensToDisplay.length === 0 ? (
        <Typography>
          No valid Wallet Tokens found for this wallet.
        </Typography>
      ) : (
             <DataGrid
         rows={rows}
         columns={columns}
         hideFooter
         disableColumnMenu
         disableRowSelectionOnClick
                 sx={{
           width: "100%",
           borderRadius: "8px",
           overflow: "hidden",
           minHeight: "auto !important",
           height: "auto !important",
           "& .MuiDataGrid-main": {
             backgroundColor: theme.palette.mode === "dark" ? "#363f4cff" : "white ",
             borderRadius:"8px",
             minHeight: "auto !important",
             height: "auto !important"
           },
           "& .MuiDataGrid-cell": {
             py: 1,
           },
         }}
      />
    )}
  </Box>
)}

export default WalletTokensOverview;
