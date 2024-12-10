import React, { useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

export const ConnectionCard = () => {
  const { t } = useTranslation("IndexModelingSection");
  const theme = useTheme();
  const [activeConnection, setActiveConnection] = useState<string>("");
  const [newConnection, setNewConnection] = useState<string>("");

  const handleActiveConnectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setActiveConnection(event.target.value as string);
  };

  const handleNewConnectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewConnection(event.target.value as string);
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        padding: "16px",
        border: "solid",
        borderWidth: "1px",
        borderColor: theme.palette.primary.grey,
        // backgroundColor: "#fff",
      }}>
      <Typography
        variant="h6"
        sx={{ fontSize: "14px", marginBottom: "12px" }}>
        {t("Connections")}
      </Typography>

      {/* Active Connections */}
      <Typography
        variant="subtitle1"
        sx={{ fontSize: "12px", marginBottom: "8px" }}>
        {t("Active Connections")}
      </Typography>
      <Select
        fullWidth
        value={activeConnection}
        onChange={handleActiveConnectionChange}
        displayEmpty
        sx={{
          marginBottom: "16px",
          // backgroundColor: "#f7f7f7",
          borderRadius: "8px",
          "& .MuiSelect-icon": { color: "black" },
        }}>
        <MenuItem
          value=""
          disabled>
          {t("Select Connection")}
        </MenuItem>
        <MenuItem value="kraken">Exchange: Kraken</MenuItem>
        <MenuItem value="metamask">Wallet: MetaMask</MenuItem>
      </Select>

      {/* Add New Connection */}
      <Typography
        variant="subtitle1"
        sx={{ fontSize: "12px", marginBottom: "8px" }}>
        {t("Add New Connection")}
      </Typography>
      <Select
        fullWidth
        value={newConnection}
        onChange={handleNewConnectionChange}
        displayEmpty
        sx={{
          // backgroundColor: "#f7f7f7",
          borderRadius: "8px",
          "& .MuiSelect-icon": { color: "black" },
        }}>
        <MenuItem
          value=""
          disabled>
          {t("Add Connection")}
        </MenuItem>
        <MenuItem value="addExchange">{t("Add Exchange")}</MenuItem>
        <MenuItem value="addWallet">{t("Add Wallet")}</MenuItem>
        <MenuItem value="addDefi">{t("Add Defi Protocol")}</MenuItem>
      </Select>
    </Box>
  );
};
