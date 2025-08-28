import React, { useState, useEffect } from "react";
import { Wallet, Coins } from "lucide-react";
import { Grid, Typography, Switch, Box, InputBase, Paper, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";


interface CapitalSwitchProps {
  onToggle: (isWallet: boolean) => void;
  walletAmount?: number;
  deploymentAmount?: number;
  selectedWallet: SelectedWallet | null;
}

interface SelectedWallet {
  address: string;
  walletId: string;
  isValid: boolean;
  walletName?: string;
  isPersonal: boolean;
}

const CapitalSwitch: React.FC<CapitalSwitchProps> = ({
  onToggle,
  walletAmount = 8115.39,
  deploymentAmount = 1000,
  selectedWallet,
}) => {
  const [isWallet, setIsWallet] = useState(false);
  const [localDeploymentAmount, setLocalDeploymentAmount] = useState(deploymentAmount);
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    if (selectedWallet && selectedWallet.isValid) {
      setIsTooltipOpen(false);
    } else {
      setIsWallet(false);
      setIsTooltipOpen(false);
    }
  }, [selectedWallet]);

  const handleToggle = () => {
    if (!selectedWallet || !selectedWallet.isValid) {
      setIsTooltipOpen(true);
      return;
    }
    setIsTooltipOpen(false);
    setIsWallet(!isWallet);
    onToggle(!isWallet);
  };

  const handleDeploymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      setLocalDeploymentAmount(parsedValue);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        bgcolor: "transparent",
        borderRadius: 3,
        width: "100%",
        minWidth: {
          xs: "330px",
          md: "600px", 
          lg: "265px",
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Wallet color={isWallet ? "#22c55e" : "gray"} />
        </Grid>
        <Grid item>
          <Typography
            color={isWallet ? "#22c55e" : "gray"}
            variant="h6"
            sx={{
              alignSelf: "flex-start",
              fontSize: "14px",
            }}
          >
            {t("WalletCapital", { ns: "IndexModelingSection" })}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: 2,
          border: `1px solid ${isWallet ? "#22c55e" : "#333"}`,
          bgcolor: isWallet ? "#f0fdf4" : "transparent",
        }}
      >
        <InputBase
          value={isWallet ? walletAmount.toFixed(2) : ""}
          readOnly
          sx={{ color: isWallet ? "black" : "gray", width: "100%" }}
        />
      </Box>

      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Tooltip
          open={isTooltipOpen}
          title={t("SelectSavedWallet", { ns: "IndexModelingSection" })}
          placement="top"
          arrow
        >
          <span>
            <Switch
              checked={!isWallet}
              onChange={handleToggle}
              sx={{
                "& .MuiSwitch-thumb": {
                  bgcolor: "white",
                },
                "& .MuiSwitch-track": {
                  bgcolor: isWallet ? "#86efac" : "#7dd3fc",
                },
              }}
            />
          </span>
        </Tooltip>
      </Grid>

      <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Grid item>
          <Coins color={!isWallet ? "#0ea5e9" : "gray"} />
        </Grid>
        <Grid item>
          <Typography
            color={!isWallet ? "#0ea5e9" : "gray"}
            variant="h6"
            sx={{
              alignSelf: "flex-start",
              fontSize: "14px",
            }}
          >
            {t("DeploymentCapital", { ns: "IndexModelingSection" })}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 1,
          p: 1,
          borderRadius: 2,
          border: `1px solid ${!isWallet ? "#0ea5e9" : "#333"}`,
          bgcolor: !isWallet ? "#f0f9ff" : "transparent",
        }}
      >
        <InputBase
          value={!isWallet ? localDeploymentAmount.toFixed(2) : ""}
          onChange={handleDeploymentAmountChange}
          fullWidth
          sx={{ color: !isWallet ? "black" : "gray", width: "100%" }}
        />
      </Box>
    </Paper>
  );
};

export default CapitalSwitch;
