import { Box, Typography, useTheme } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTranslation } from "react-i18next";
import React from "react";

interface OverviewBlockProps {
  title: string;
  value: string;
  subtitle: string;
  iconColor: string;
}

const OverviewBlock: React.FC<OverviewBlockProps> = ({ title, value, subtitle, iconColor }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#232628" : "lightgray",
        borderRadius: "8px",
        padding: "8px 18px",
        marginBottom: "14px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: "6px" }}>
        <AccountBalanceWalletIcon sx={{ color: iconColor }} />
        <Typography sx={{ fontSize: "20px", color: "white" }}>{title}</Typography>
      </Box>
      <Box>
        <Typography sx={{ color: iconColor, fontSize: "26px", fontWeight: "800" }}>
          {value}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ color: "gray", fontSize: "17px", fontWeight: "450" }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export const WalletsOverviewPanel: React.FC = () => {
  const { t } = useTranslation("MyWalletsPage");
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "520px",
        borderRadius: "10px",
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
        padding: 2,
      }}
    >
      <Typography sx={{ fontWeight: "500", marginBottom: "12px" }}>
        {t("WalletsHoldingsOverview")}
      </Typography>

      <OverviewBlock
        title={t("TotalValue")}
        value="$70,087.19"
        subtitle="2 wallets selected"
        iconColor="#4090d7ff"
      />
      <OverviewBlock
        title={t("Tokens")}
        value="$20,152.33"
        subtitle="9 tokens"
        iconColor="#72dd5fff"
      />
      <OverviewBlock
        title={t("DeFi")}
        value="$49,934.76"
        subtitle="6 protocols"
        iconColor="#e49a41ff"
      />
    </Box>
  );
};

