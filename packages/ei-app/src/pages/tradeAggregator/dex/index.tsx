import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { ChainAsset } from "@/models/Wallet/ChainAsset";
import { Wallet } from "@/models/Wallet/Wallet";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";


export default function Dex() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { t } = useTranslation("IndexModelingSection");
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [selectedChain, setSelectedChain] = useState<string | null>(null);
    const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
    const [selectedTokenRow, setSelectedTokenRow] = useState<WalletBalance | null>(null);

    const handleSelectedTokenChange = (tokenInfo: any, chainInfo: any) => {
      setSelectedToken(tokenInfo);
      setSelectedChain(chainInfo);
      
      if(tokenInfo === null)
      {
        setSelectedTokenRow(null)
      }
    };

    const clearSelectedTokenAndChain = () => {
      setSelectedToken(null);
      setSelectedChain(null);
      setSelectedTokenRow(null);
    };

    const handleSelectedTokenRowChange = (tokenRow: WalletBalance | null) => {
      setSelectedTokenRow(tokenRow);
    };

    const handleWalletChange = (newWallet: Wallet | null) => {
        setSelectedWallet(newWallet);
      };
    
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        component="div"
        sx={{fontWeight: "bold", mb: 2 }}
      >
        {t("TradeAggregatorDex")}
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
          <CurrentPositionSection onWalletChange={handleWalletChange} selectedToken={selectedToken}
            selectedChainNewPosition={selectedChain}
            onFilteredRowsChange={setFilteredRows}
            onTokenChange={handleSelectedTokenRowChange}
            onClearTokenAndChain={clearSelectedTokenAndChain}/>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1.2, marginLeft:"17px" }}
          >
            {t("NewPosition")}
          </Typography>
          <NewPositionSection
            selectedWallet={selectedWallet}
            onSelectedTokenChange={handleSelectedTokenChange}
            filteredRows={filteredRows}
            selectedTokenRow={selectedTokenRow}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
