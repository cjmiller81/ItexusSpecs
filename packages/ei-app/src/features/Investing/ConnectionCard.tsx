import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { KrakenDialog } from "./dialogs/KrakenDialog";
import { MetaMaskDialog } from "./dialogs/MetaMaskDialog";
import { ExchangeDialog } from "./dialogs/ExchangeDialog";
import { SelectChangeEvent } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

export const ConnectionCard = () => {
  const { t } = useTranslation("IndexModelingSection");
  const theme = useTheme();

  const [activeConnection, setActiveConnection] = useState<string>("");
  const [newConnection, setNewConnection] = useState<string>("");
  const [openKrakenDialog, setOpenKrakenDialog] = useState(false);
  const [openMetaMaskDialog, setOpenMetaMaskDialog] = useState(false);
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<"Kraken" | "MetaMask" | "defiprotocol" | "">("");
  const [dialogState, setDialogState] = useState({
    title: "",
    selectedService: [] as string[],
  });

  const formik = useFormik({
    initialValues: {
      apiKey: "",
      apiSecret: "",
      apiPassphrase: "",
      network: "",
      customRpcUrl: "",
    },
    validationSchema: Yup.object({
      apiKey: activeConnection === "api" ? Yup.string().required(t("Required")) : Yup.string().optional(),
      apiSecret: activeConnection === "api" ? Yup.string().required(t("Required")) : Yup.string().optional(),
      apiPassphrase: activeConnection === "api" ? Yup.string().optional() : Yup.string().optional(),
      network: activeConnection === "rpc" ? Yup.string().required(t("NetworkRequired")) : Yup.string().optional(),
      customRpcUrl:
        activeConnection === "rpc"
          ? Yup.string().url(t("InvalidURL")).required(t("CustomRPCRequired"))
          : Yup.string().optional(),
    }),
    onSubmit: (values, { resetForm }) => {
      resetForm();
      setOpenKrakenDialog(false);
      setOpenMetaMaskDialog(false);
    },
  });

  useEffect(() => {
    if (selectedService === "Kraken") {
      setOpenKrakenDialog(true);
    } else if (selectedService === "MetaMask") {
      setOpenMetaMaskDialog(true);
    }
    setOpenExchangeDialog(false);
  }, [selectedService]);

  const handleActiveConnectionChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setActiveConnection(value);
  };

  const handleNewConnectionChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setNewConnection(value);

    if (value === t("AddExchange")) {
      setDialogState({ title: "Connect Exchange", selectedService: ["Kraken"] });
      setOpenExchangeDialog(true);
    } else if (value === t("AddWallet")) {
      setDialogState({ title: "Connect Wallet", selectedService: ["MetaMask"] });
      setOpenExchangeDialog(true);
    } else if (value === "defiprotocol") {
      setDialogState({ title: "Defi Protocol", selectedService: ["defiprotocol"] });
      setOpenExchangeDialog(true);
    }
  };

  const handleServiceChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === "" || value === "Kraken" || value === "MetaMask" || value === "defiprotocol") {
      setSelectedService(value);
    }
  };

  const handleCancelExchange = () => {
    setNewConnection("");
    setDialogState({
      title: "",
      selectedService: [] as string[],
    });
    setActiveConnection("");
    setSelectedService("");
    setOpenExchangeDialog(false);
    setOpenKrakenDialog(false);
    setOpenMetaMaskDialog(false);
  };

  return (
    <Box
      sx={{
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "5px",
        padding: "9px",
        border: "solid",
        borderWidth: "1px",
        height: "300px",
        marginTop: "38px",
        borderColor: theme.palette.mode === "dark" ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)",
      }}>
      <Typography
        variant="h6"
        sx={{ fontSize: "14px", marginBottom: "12px" }}>
        {t("Connections")}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{ fontSize: "12px", marginBottom: "8px" }}>
        {t("ActiveConnections")}
      </Typography>
      <Select
        fullWidth
        value={activeConnection}
        onChange={handleActiveConnectionChange}
        displayEmpty
        renderValue={selected => {
          if (!selected) {
            return (
              <Typography
                sx={{
                  "@media (min-width: 1300px) and (max-width: 1442px)": {
                    mt: "2px",
                    fontSize: "11px",
                  },
                  "@media (min-width: 1200px) and (max-width: 1300px)": {
                    fontSize: "9px",
                  },
                }}>
                {t("SelectConnection")}
              </Typography>
            );
          }
          return t(selected as string);
        }}
        sx={{
          marginBottom: "16px",
          borderRadius: "8px",
          "& .MuiSelect-icon": { color: "black" },
        }}>
        <MenuItem value="Kraken">Exchange: Kraken</MenuItem>
        <MenuItem value="MetaMask">Wallet: MetaMask</MenuItem>
      </Select>

      <Typography
        variant="subtitle1"
        sx={{ fontSize: "12px", marginBottom: "8px" }}>
        {t("AddNewConnection")}
      </Typography>

      <Select
        fullWidth
        value={newConnection}
        onChange={handleNewConnectionChange}
        displayEmpty
        renderValue={selected => {
          if (!selected) {
            return (
              <Typography
                sx={{
                  "@media (min-width: 1300px) and (max-width: 1442px)": {
                    mt: "2px",
                    fontSize: "11px",
                  },
                  "@media (min-width: 1200px) and (max-width: 1300px)": {
                    fontSize: "9px",
                  },
                }}>
                {t("AddConnection")}
              </Typography>
            );
          }
          return t(selected as string);
        }}
        sx={{
          borderRadius: "8px",
          "& .MuiSelect-icon": { color: "black" },
        }}>
        <MenuItem
          disabled
          sx={{ display: "none" }}
          value="">
          {t("AddConnection")}
        </MenuItem>
        <MenuItem value={t("AddExchange")}>{t("AddExchange")}</MenuItem>
        <MenuItem value={t("AddWallet")}>{t("AddWallet")}</MenuItem>
        <MenuItem
          disabled
          value="addDefi">
          {t("AddDefiProtocol")}
        </MenuItem>
      </Select>

      <KrakenDialog
        open={openKrakenDialog}
        formik={formik}
        onClose={handleCancelExchange}
      />

      <MetaMaskDialog
        open={openMetaMaskDialog}
        formik={formik}
        onClose={handleCancelExchange}
      />

      <ExchangeDialog
        open={openExchangeDialog}
        title={dialogState.title}
        selectedService={dialogState.selectedService}
        onClose={handleCancelExchange}
        onServiceChange={handleServiceChange}
      />
    </Box>
  );
};
