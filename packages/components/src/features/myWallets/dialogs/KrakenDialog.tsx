import React, { useState, useEffect, useRef } from "react";
import { 
  Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle 
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material/styles";
import { FormikProps } from "formik";
import { IExchange } from "../../../models";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface KrakenDialogProps {
  open: boolean;
  formik: FormikProps<any>;
  onClose: () => void;
  onChainNameChange: (name: string) => void;
  existingExchanges: IExchange[];
  isEditing: boolean;
  onUpdateExchange: (updatedExchange: IExchange) => void;
  editingExchangeName: string;
}

export const KrakenDialog: React.FC<KrakenDialogProps> = ({ 
  open, formik, onChainNameChange, onClose, existingExchanges, isEditing, onUpdateExchange,editingExchangeName,
}) => {
  const { t } = useTranslation("IndexModelingSection");
  const theme = useTheme();
  const [exchangeNameError, setExchangeNameError] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDuplicate = existingExchanges.some((ex) => {
      const exchangeName = typeof ex.name === 'string' ? ex.name : ""; 
      const chainName = typeof formik.values.chainName === 'string' ? formik.values.chainName : "";
      return exchangeName.toLowerCase() === chainName.toLowerCase() && chainName !== editingExchangeName;
    });    
  
    setExchangeNameError(isDuplicate ? t("ExchangeNameAlreadyExists") : null);
  }, [formik.values.chainName, existingExchanges, t]);

  const scrollToImage = () => {
    imageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formik.values.chainName && !exchangeNameError) {
      const existingExchange = existingExchanges.find(ex => ex.name === editingExchangeName);
      if (existingExchange) {
        
        const updatedExchange: IExchange = {
          exchange_id: formik.values.chainName,
          name: formik.values.chainName,
          apiKey: formik.values.apiKey,
          apiSecret: formik.values.apiSecret,
        };
  
        onUpdateExchange(updatedExchange);
  
        onClose();
      }
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("ConnectKrakenExchange")}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
          {`${t("AddCustomExchangeAccountName")}*`}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={formik.values.chainName || ""}
          onChange={e => {
            formik.handleChange(e);
            onChainNameChange(e.target.value);
          }}
          name="chainName"
          placeholder={t("ExchangeAccountName")}
          sx={{ marginBottom: "12px" }}
          error={Boolean(exchangeNameError)}
          helperText={exchangeNameError && (
            <Typography sx={{ color: "red", fontWeight: "bold" }}>
              {exchangeNameError}
            </Typography>
          )}
        />

        <Box
          sx={{
            backgroundColor: theme.palette.grey[400],
            color: "black !important",
            padding: "20px 20px",
            marginBottom: "16px",
            mt: "10px",
            borderRadius: "8px",
            display: "flex",
          }}
        >
          <ErrorOutlineIcon fontSize="small" sx={{ height: "17px", width: "17px", margin: "2px 5px 0 0 " }} />
          <Typography variant="body2" sx={{ color: "black" }}>
            {t("PleaseEnsureYouHaveTheNecessaryKraken")}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
          {`${t("APIKey")}*`}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          autoComplete="off"
          value={formik.values.apiKey}
          onChange={formik.handleChange}
          name="apiKey"
          placeholder={`${t("APIKey")}*`}
          sx={{ marginBottom: "12px" }}
          error={formik.touched.apiKey && Boolean(formik.errors.apiKey)}
          helperText={formik.touched.apiKey && (typeof formik.errors.apiKey === "string" ? formik.errors.apiKey : "")}
          disabled={isEditing} 
        />

        <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
          {`${t("PrivateAPIKey")}*`}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          autoComplete="off"
          value={formik.values.apiSecret}
          onChange={formik.handleChange}
          name="apiSecret"
          placeholder={`${t("PrivateAPIKey")}*`}
          sx={{ marginBottom: "12px" }}
          error={formik.touched.apiSecret && Boolean(formik.errors.apiSecret)}
          helperText={formik.touched.apiSecret && (typeof formik.errors.apiSecret === "string" ? formik.errors.apiSecret : "")}
          disabled={isEditing}
        />

        <Box sx={{ maxHeight: "170px", overflowY: "auto", mt: 2, p: 2, border: "1px solid gray", borderRadius: "8px" }}>
          <Typography variant="h6">{t("KrakenAPIInstructions")}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t("OnceLoggedIntoKraken")}
          </Typography>
          <Typography variant="body2" sx={{marginTop:"5px"}}>
            {t("ThenClickSetting")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography variant="body2" sx={{ marginRight: "8px" }}>
              {t("NextFillInTheForm")}
            </Typography>
            <ArrowDownwardIcon
              sx={{
                fontSize: 25,
                marginLeft:"auto",
                cursor: "pointer",
                color: "white",
                transition: "0.3s",
                "&:hover": { color: "gray" }
              }}
              onClick={scrollToImage}
            />
          </Box>

          <Typography variant="body2"sx={{marginTop:"15px"}}>
          {t("BeSureToCopyPasteEachAPIKeys")}
          </Typography>
          
          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1,marginTop:"5px" }}>
            {t("IMPORTANTBeSure")}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <img src="/KrakenApiSetup.png"
              alt="Kraken API Setup"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <form onSubmit={isEditing ? handleSave : formik.handleSubmit}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={formik.isSubmitting || Boolean(exchangeNameError)}
          >
            {isEditing ? t("Save") : t("Connect")}
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
};
