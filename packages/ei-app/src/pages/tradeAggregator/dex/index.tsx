import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { ChainAsset } from "@/models/Wallet/ChainAsset";
import { Wallet } from "@/models/Wallet/Wallet";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";


export default function Dex() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { t } = useTranslation("IndexModelingSection");
    const [selectedToken, setSelectedToken] = useState<string | null>(null);

    const handleSelectedTokenChange = (tokenInfo: any) => {
      setSelectedToken(tokenInfo);
    };
    
    const handleWalletChange = (newWallet: Wallet | null) => {
        setSelectedWallet(newWallet);
      };
    
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          alignSelf: "flex-start",
          fontSize: "20px",
          width: "100%",
          marginBottom: 2,
        }}
      >
        {"DEX:"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4.5}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1 }}
          >
            {t("CurrentPosition")}
          </Typography>
          <CurrentPositionSection onWalletChange={handleWalletChange} selectedToken={selectedToken}/>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1, marginLeft:"17px" }}
          >
            {t("NewPosition")}
          </Typography>
          <NewPositionSection
            selectedWallet={selectedWallet}
            onSelectedTokenChange={handleSelectedTokenChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
