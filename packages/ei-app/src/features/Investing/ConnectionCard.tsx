import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { KrakenDialog } from "./dialogs/KrakenDialog";
import { MetaMaskDialog } from "./dialogs/MetaMaskDialog";
import { ExchangeDialog } from "./dialogs/ExchangeDialog";

export const ConnectionCard = () => {
  const { t } = useTranslation("IndexModelingSection");
  const theme = useTheme();
  const [activeConnection, setActiveConnection] = useState<string>("");
  const [newConnection, setNewConnection] = useState<string>("");
  const [krakenCredentials, setKrakenCredentials] = useState({
    apiLabel: "",
    apiKey: "",
    apiSecret: "",
    apiPassphrase: "",
  });
  const [metaMaskData, setMetaMaskData] = useState({
    network: "",
    customRpcUrl: "",
  });
  const [openKrakenDialog, setOpenKrakenDialog] = useState(false);
  const [openMetaMaskDialog, setOpenMetaMaskDialog] = useState(false);
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [dialogState, setDialogState] = useState({
    title: "",
    selectedService: [],
  });

  useEffect(() => {
    // console.log(selectedService, "selectedService");
    if (selectedService === "kraken") {
      setOpenKrakenDialog(true);
    } else if (selectedService === "metamask") {
      setOpenMetaMaskDialog(true);
    }
    setOpenExchangeDialog(false);
  }, [selectedService]);

  const handleActiveConnectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setActiveConnection(value);
    if (value === "kraken") {
      setOpenKrakenDialog(true);
    } else if (value === "metamask") {
      setOpenMetaMaskDialog(true);
    }
  };

  const handleNewConnectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setNewConnection(value);

    // Update dialog title and selected service based on the new connection
    if (value === "addExchange") {
      setDialogState({ title: "Connect Exchange", selectedService: ["kraken"] });
      setOpenExchangeDialog(true);
    } else if (value === "addWallet") {
      setDialogState({ title: "Connect Wallet", selectedService: ["metamask"] });
      setOpenExchangeDialog(true);
    }
  };

  const handleKrakenCredentialChange =
    (field: keyof typeof krakenCredentials) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setKrakenCredentials({ ...krakenCredentials, [field]: event.target.value });
    };

  const handleMetaMaskDataChange =
    (field: keyof typeof metaMaskData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setMetaMaskData({ ...metaMaskData, [field]: event.target.value });
    };

  const handleCancelKraken = () => {
    setKrakenCredentials({ apiLabel: "", apiKey: "", apiSecret: "", apiPassphrase: "" });
    setOpenKrakenDialog(false);
  };

  const handleConnectKraken = () => {
    // console.log("Connecting Kraken with credentials:", krakenCredentials);
    setOpenKrakenDialog(false);
  };

  const handleCancelMetaMask = () => {
    setMetaMaskData({ network: "", customRpcUrl: "" });
    setOpenMetaMaskDialog(false);
  };

  const handleConnectMetaMask = () => {
    // console.log("Connecting MetaMask with data:", metaMaskData);
    setOpenMetaMaskDialog(false);
  };

  const handleServiceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedService(event.target.value as string);
  };

  const handleCancelExchange = () => {
    setSelectedService("");
    setOpenExchangeDialog(false);
  };

  const handleConnectExchange = () => {
    setOpenExchangeDialog(false);
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        padding: "16px",
        border: "solid",
        borderWidth: "1px",
        borderColor: theme.palette.mode === "dark" ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)",
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

      {/* Kraken Dialog */}
      <KrakenDialog
        open={openKrakenDialog}
        krakenCredentials={krakenCredentials}
        onClose={() => setOpenKrakenDialog(false)} // State-driven close
        onConnect={handleConnectKraken}
        onCredentialChange={handleKrakenCredentialChange} // Use state setter
      />

      {/* MetaMask Dialog */}
      <MetaMaskDialog
        open={openMetaMaskDialog}
        metaMaskData={metaMaskData}
        onClose={() => setOpenMetaMaskDialog(false)} // State-driven close
        onConnect={handleConnectMetaMask}
        onDataChange={handleMetaMaskDataChange} // Use state setter
      />

      {/* Exchange Dialog */}
      <ExchangeDialog
        open={openExchangeDialog}
        title={dialogState.title} // Dynamic title based on dialogState
        selectedService={dialogState.selectedService} // Pre-selected service
        onClose={() => setOpenExchangeDialog(false)} // State-driven close
        onConnect={handleConnectExchange}
        onServiceChange={handleServiceChange} // Use state setter
      />
    </Box>
  );
};
