import React, { useState } from "react";
import { Box, Typography, Switch, useTheme } from "@mui/material";

const TradingSwitch: React.FC = () => {
  const [isTradingEnabled, setIsTradingEnabled] = useState<boolean>(false);
  const theme = useTheme();

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTradingEnabled(event.target.checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}>
      <Switch
        checked={isTradingEnabled}
        onChange={handleSwitchChange}
        color="primary"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: theme.palette.cyan.main,
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: theme.palette.cyan.main,
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          marginLeft: "10px",
          color: isTradingEnabled ? theme.palette.cyan.main : theme.palette.grey[500],
        }}>
        {isTradingEnabled ? "Trading Enabled" : "Trading Disabled"}
      </Typography>
    </Box>
  );
};

export default TradingSwitch;
