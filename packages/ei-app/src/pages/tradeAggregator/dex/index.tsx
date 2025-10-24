import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { Wallet } from "@/models/Wallet/Wallet";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import { PageAccessGuard } from "@/components/PageAccessGuard";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../../components/AnimatedStartTourButton";
import { useSubscription } from "components";

const TOUR_ID = "dex_aggregator_v1";

const StartTourButton = () => {
  return (
    <AnimatedStartTourButton 
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
    />
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
    const { getTradeAggregatorQuoteLimit } = useSubscription();

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
        selector: "#wallet_dropdown",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourWalletChoiceText")}</Typography>
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
        selector: "#token_list",
        content: () => (
          <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("DexAggregatorTourTokenTradeText")}</Typography>
        ),
        position: "right"
      },
      {
        selector: "#quantity_input",
        content: () => (
          <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("DexAggregatorTourTradeQuantityText")}</Typography>
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
            <Typography sx={{ color: "#4a5568" }}>{t("DexAggregatorTourQuotesText", { quoteCount: getTradeAggregatorQuoteLimit() })}</Typography>
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
          <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("DexAggregatorTourExecuteText")}</Typography>
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
    <PageAccessGuard requiredPage="/tradeAggregator/dex">
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: 16, 
          background: "#f7f5f2", 
          color: "#6b7280",
          fontSize: "0.95rem",
          lineHeight: 1.8
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
      }}
      showBadge={false}
      components={{
        Content: (props: any) => {
          const step = steps[props.currentStep];
          const content = typeof step?.content === 'function' ? step.content() : step?.content;
          
          return (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', 
                  color: '#fff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: 14,
                  flexShrink: 0,
                  marginTop: "-2px"
                }}>
                  {(props.currentStep ?? 0) + 1}
                </Box>
                <Box sx={{ flex: 1, color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  {content}
                </Box>
              </Box>
            </Box>
          );
        },
        Navigation: ({ setCurrentStep, currentStep, steps, setIsOpen }) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: steps?.length || 0 }).map((_, i) => (
                <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: i <= currentStep ? '#3b82f6' : '#e2e8f0' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {currentStep > 0 && (
                <Button
                  variant="contained"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  sx={{ 
                    background: '#f7f5f2', 
                    color: '#4a5568', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: 'none', 
                    textTransform: 'none',
                    '&:hover': { background: '#f0ece5', boxShadow: 'none' } 
                  }}
                >
                  Prior
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  if (currentStep === (steps?.length || 0) - 1) {
                    setIsOpen(false);
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                sx={{ background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', color: '#fff', boxShadow: 'none', textTransform: 'none' }}
              >
                {currentStep === (steps?.length || 0) - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )
      }}
    >
      <>
        <TourStateSync totalSteps={steps.length} />
        <Box sx={{ padding: 2 }}>
          <Box display="flex" alignItems="center" sx={{marginBottom: "15px"}}>
            <Typography
              variant="h4"
              component="div"
              sx={{fontWeight: "bold" }}
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
    </PageAccessGuard>
  );
}
