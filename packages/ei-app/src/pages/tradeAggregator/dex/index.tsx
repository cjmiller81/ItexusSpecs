import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { ChainAsset } from "@/models/Wallet/ChainAsset";
import { Wallet } from "@/models/Wallet/Wallet";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import React from "react";


export default function Dex() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

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
            {"CurrentPosition"}
          </Typography>
          <CurrentPositionSection onWalletChange={handleWalletChange}/>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1, marginLeft:"17px" }}
          >
            {"NewPosition"}
          </Typography>
          <NewPositionSection selectedWallet={selectedWallet}/>
        </Grid>
      </Grid>
    </Box>
  );
}
