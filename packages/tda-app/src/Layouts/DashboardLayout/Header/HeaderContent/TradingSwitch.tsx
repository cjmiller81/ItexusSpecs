import React from "react";
import { Box, Typography, Switch, useTheme } from "@mui/material";

interface TradingSwitchProps {
  isTradingEnabled: boolean;
  setIsTradingEnabled: (enabled: boolean) => void;
}

const TradingSwitch: React.FC<TradingSwitchProps> = ({ setIsTradingEnabled, isTradingEnabled }) => {
  const theme = useTheme();
  const { palette } = theme;

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginLeft: "4px" }}>
      <Switch
        checked={isTradingEnabled}
        onChange={() => setIsTradingEnabled(!isTradingEnabled)}
        color="primary"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#00bcd4",
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#00bcd4",
          },
          "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
            backgroundColor: `${palette.grey[700]}`,
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          width: "max-content",
          fontStyle: "italic",
          color: isTradingEnabled ? "#00bcd4" : theme.palette.grey[500],
        }}>
        {isTradingEnabled ? "Trading Enabled" : "Trading Disabled"}
      </Typography>
    </Box>
  );
};

export default TradingSwitch;
