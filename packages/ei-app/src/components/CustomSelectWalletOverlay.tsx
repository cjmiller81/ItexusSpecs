import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTranslation } from "react-i18next";

const CustomSelectWalletOverlay = () => {
  const { t } = useTranslation(["IndexModelingSection"]);
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
        <AssignmentIcon 
          sx={{ 
            fontSize: 45, 
            color: theme.palette.mode === 'dark' ? '#fff' : '#219a83', 
            mb: 2 
          }} 
        />

        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, fontSize: "16px" }}>
          {t("AddSavedWalletFromYourWalletList")}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: "gray", fontSize: "13px", maxWidth: '400px' }}>
          {t("ToViewYourWalletPositionsSelectSavedWallet")}
        </Typography>
      </Box>
    </GridOverlay>
  );
};

export default CustomSelectWalletOverlay;

