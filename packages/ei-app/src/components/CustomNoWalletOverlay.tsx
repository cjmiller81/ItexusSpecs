import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useTranslation } from "react-i18next";
import router from "next/router";

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
          padding: "22px",
          backgroundColor: "transparent",
          borderRadius: "8px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <AccountBalanceWalletIcon sx={{ fontSize: 45, color: theme.palette.mode === 'dark' ? '#fff' : '#1e88e5', mb: 2 }} />

        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, fontSize: "16px" }}>
          {t("ConnectYourWalletorAdd")}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: "gray", fontSize: "13px" }}>
          {t("ToSeeYourWalletPositions")}
        </Typography>

        <Button
            variant="contained"
            onClick={() => router.push('/profile/wallets')}
            sx={{ backgroundColor: "#1e88e5", color: "white", fontSize: "11px" }}
            >
            {t("AddYourFirstWallet")}
        </Button>
      </Box>
    </GridOverlay>
  );
};

export default CustomNoWalletOverlay;
