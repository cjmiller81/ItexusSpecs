import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useTranslation } from "react-i18next";
import router from "next/router";
import { keyframes } from '@mui/system';

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(33, 154, 131, 0.5);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(33, 154, 131, 0);
  }
`;

const CustomNoWalletOverlay = () => {
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const theme = useTheme();

  return (
    <GridOverlay>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 30px",
          backgroundColor: "transparent",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <AccountBalanceWalletIcon 
          sx={{ 
            fontSize: 60, 
            color: theme.palette.mode === 'dark' ? '#fff' : '#219a83', 
            mb: 2 
          }} 
        />

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, fontSize: "18px" }}>
          {t("ConnectNewWalletAddress")}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "gray", fontSize: "13px", maxWidth: '400px' }}>
          {t("YouHaveNotSavedWalletAddress")}
        </Typography>

        <Button
            variant="contained"
            onClick={() => router.push('/profile/wallets')}
            sx={{ 
              backgroundColor: "#219a83", 
              color: "white", 
              fontSize: "11px",
              animation: `${pulseGlow} 2s ease-in-out infinite`,
            }}
            >
            {t("AddYourFirstWallet")}
        </Button>
      </Box>
    </GridOverlay>
  );
};

export default CustomNoWalletOverlay;
