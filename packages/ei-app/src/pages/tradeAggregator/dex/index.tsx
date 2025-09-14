import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { Wallet } from "@/models/Wallet/Wallet";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";

const TOUR_ID = "dex_aggregator_v1";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{ ml: 2, textTransform: "none", borderWidth: 2 }}
      onClick={() => {
        const savedStep = Number(localStorage.getItem(`EI_TOUR_${TOUR_ID}_STEP`) || 0);
        setCurrentStep(isNaN(savedStep) ? 0 : savedStep);
        setIsOpen(true);
      }}
    >
      Start Tour
    </Button>
  );
};

const TourStateSync = ({ totalSteps }: { totalSteps: number }) => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  const viewed = typeof window !== "undefined" ? localStorage.getItem(`EI_TOUR_${TOUR_ID}_VIEWED`) === "1" : true;
  
  useEffect(() => {
    try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_STEP`, String(currentStep)); } catch { /* noop */ }
    if (currentStep >= totalSteps - 1) {
      try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_VIEWED`, "1"); } catch { /* noop */ }
    }
  }, [currentStep, totalSteps]);
  
  useEffect(() => {
    try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_VIEWED`, isOpen ? "0" : "1"); } catch { /* noop */ }
  }, [isOpen]);
  
  useEffect(() => {
    const savedStep = Number(localStorage.getItem(`EI_TOUR_${TOUR_ID}_STEP`) || 0);
    if (!viewed) {
      if (!isNaN(savedStep)) setCurrentStep(savedStep);
      setIsOpen(true);
    }
  }, []);
  
  return null;
};

export default function Dex() {
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { t } = useTranslation("IndexModelingSection");
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [selectedChain, setSelectedChain] = useState<string | null>(null);
    const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
    const [selectedTokenRow, setSelectedTokenRow] = useState<WalletBalance | null>(null);

    const steps: StepType[] = [
      {
        selector: "#dex_header",
        content: () => (
          <Box sx={{ color: "#1a1a1a" }}>
            <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("DexAggregatorTourSectionTitle")}</Typography>
            <Typography sx={{ color: "#4a5568" }}>{t("DexAggregatorTourSectionText")}</Typography>
          </Box>
        ),
        position: "bottom"
      },
      {
        selector: "#manual_position_btn",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourManualPositionText")}</Typography>
        ),
        position: "right"
      },
      {
        selector: "#wallet_dropdown",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourWalletChoiceText")}</Typography>
        ),
        position: "bottom"
      },
      {
        selector: "#token_list",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourTokenTradeText")}</Typography>
        ),
        position: "right"
      },
      {
        selector: "#quantity_input",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourTradeQuantityText")}</Typography>
        ),
        position: "left"
      },
      {
        selector: "#target_token_dropdown",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourTargetTokenText")}</Typography>
        ),
        position: "left"
      },
      {
        selector: "#get_quotes_btn",
        content: () => (
          <Box sx={{ color: "#1a1a1a" }}>
            <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("DexAggregatorTourQuotesTitle")}</Typography>
            <Typography sx={{ color: "#4a5568" }}>{t("DexAggregatorTourQuotesText")}</Typography>
          </Box>
        ),
        position: "top"
      },
      {
        selector: "#routes_list",
        content: () => (
          <Box sx={{ color: "#1a1a1a" }}>
            <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("DexAggregatorTourRoutesTitle")}</Typography>
            <Typography sx={{ color: "#4a5568" }}>{t("DexAggregatorTourRoutesText")}</Typography>
          </Box>
        ),
        position: "top"
      },
      {
        selector: "#execute_section",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourExecuteText")}</Typography>
        ),
        position: "bottom"
      }
    ];

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
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: "32px 24px 24px 24px", 
          background: "#ffffff", 
          color: "#1a1a1a", 
          minWidth: 400, 
          maxWidth: 500,
          paddingTop: "40px"
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        badge: (base) => ({ ...base, display: "none" }),
        close: (base) => ({ 
          ...base, 
          top: "12px", 
          right: "12px",
          zIndex: 1000
        }),
      }}
    >
      <>
        <TourStateSync totalSteps={steps.length} />
        <Box sx={{ padding: 2 }}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h4"
              component="div"
              sx={{fontWeight: "bold", mb: 2 }}
              id="dex_header"
            >
              {t("TradeAggregatorDex")}
            </Typography>
            <StartTourButton />
          </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} md={4.9}>
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
            sx={{ fontSize: "14px", marginBottom: 1, marginLeft:"17px" }}
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
      </>
    </TourProvider>
  );
}
