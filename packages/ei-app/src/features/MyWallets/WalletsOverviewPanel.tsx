import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MovingIcon from "@mui/icons-material/Moving";
import LayersIcon from "@mui/icons-material/Layers";
import AppsIcon from '@mui/icons-material/Apps';
import { useAppSelector } from "components";

interface OverviewBlockProps {
  title: string;
  value: string;
  subtitle?: string;
  iconColor: string;
  Icon: React.ElementType;
  compact?: boolean;
  prominent?: boolean;
}

const OverviewBlock: React.FC<OverviewBlockProps> = ({
  title,
  value,
  subtitle,
  iconColor,
  Icon,
  compact = false,
  prominent = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#232628" : "lightgray",
        borderRadius: "8px",
        padding: prominent ? "14px 20px" : compact ? "6px 16px" : "8px 18px",
        marginBottom: "13px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: "4px" }}>
        <Icon sx={{ color: iconColor, fontSize: prominent ? "32px" : compact ? "22px" : "24px" }} />
        <Typography sx={{ fontSize: prominent ? "18px" : "16px", color: theme.palette.mode === "dark" ? "white" : "black", }}>{title}</Typography>
      </Box>
      <Box>
        <Typography sx={{ color: iconColor, fontSize: prominent ? "30px" : compact ? "20px" : "22px", fontWeight: "800" }}>
          {value}
        </Typography>
      </Box>
      {subtitle && (
        <Box>
          <Typography sx={{ color: "gray", fontSize: prominent ? "16px" : "14px", fontWeight: "450" }}>
            {subtitle}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export const WalletsOverviewPanel: React.FC = () => {
  const { t } = useTranslation("MyWalletsPage");
  const theme = useTheme();
  const { portfolioWalletData, selectedWallets } = useAppSelector((state) => state.wallets);

  const formatCurrencyWithSymbol = React.useCallback((value: number, locale = "en-US") => {
    return `$${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);

  const selectedAddresses = (selectedWallets || []).map((w: any) => w.address);

  const aggregateValues = React.useMemo(() => {
    let tokensTotal = 0;
    let defiTotal = 0;
    let nftTotal = 0;

    if (Array.isArray(portfolioWalletData) && selectedAddresses.length > 0) {
      portfolioWalletData
        .filter(w => selectedAddresses.includes(w.walletAddress))
        .forEach(w => {
          const tokenHoldings = w.tokenHoldings || [];
          const deFiPositions = w.deFiPositions || [];
          const nftHoldings = w.nftHoldings || [];

          tokensTotal += tokenHoldings.reduce((sum, t) => sum + (t.balanceUSD || 0), 0);
          defiTotal += deFiPositions.reduce((sum, d) => sum + (d.valueUSD || 0), 0);
          nftTotal += nftHoldings.reduce((sum, n) => sum + (n.estimatedValue || 0), 0);
        });
    }

    return {
      tokensTotal,
      defiTotal,
      nftTotal,
      totalValue: tokensTotal + defiTotal + nftTotal,
    };
  }, [portfolioWalletData, selectedAddresses]);

  return (
    <Box
      sx={{
        minHeight: "520px",
        borderRadius: "10px",
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
        padding: 2,
        overflow: "hidden",
        wordBreak: "break-word",
        '& *': { minWidth: 0 },
      }}
    >
      <Typography sx={{ fontWeight: "500", marginBottom: "12px" }}>
        {t("WalletsHoldingsOverview")}
      </Typography>

      <OverviewBlock
        title={t("TotalValue")}
        value={formatCurrencyWithSymbol(aggregateValues.totalValue)}
        subtitle={`${selectedWallets?.length || 0} wallets selected`}
        iconColor="#4090d7ff"
        Icon={AccountBalanceWalletIcon}
        prominent
      />
      <OverviewBlock
        title={t("Tokens")}
        value={formatCurrencyWithSymbol(aggregateValues.tokensTotal)}
        iconColor="#72dd5fff"
        Icon={MovingIcon}
        compact
      />
      <OverviewBlock
        title={t("DeFi")}
        value={formatCurrencyWithSymbol(aggregateValues.defiTotal)}
        iconColor="#e49a41ff"
        Icon={LayersIcon}
        compact
      />
      <OverviewBlock
        title={t("NFTs")}
        value={formatCurrencyWithSymbol(aggregateValues.nftTotal)}
        iconColor="#c084fc"
        Icon={AppsIcon}
        compact
      />
    </Box>
  );
};
