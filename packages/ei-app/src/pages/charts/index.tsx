import { useAppSelector } from "@/libs/redux/Store";
import { Box, Button } from "@mui/material";
import { Typography, Chip, keyframes } from "@mui/material";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { useState, useEffect } from "react";
import { PageAccessGuard } from "@/components/PageAccessGuard";

const TOUR_ID = "trading_v1";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  return (
    <Button
      variant="contained"
      size="small"
      sx={{ 
        ml: 2, 
        textTransform: "none", 
        backgroundColor: "#109EEF",
        color: "white",
        "&:hover": {
          backgroundColor: "#0E8BD6"
        }
      }}
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

const SymbolOverviewNoSSR = dynamic(() => import("react-ts-tradingview-widgets").then(w => w.AdvancedRealTimeChart), {
  ssr: false,
});

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export default function TradingPage() {
  const mode = useAppSelector(state => state.ui.mode);
  const { t } = useTranslation("TradingPage");

  const steps: StepType[] = [
    {
      selector: "#trading_header",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TradingChartsTourPlatformTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TradingChartsTourPlatformText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_top_bar",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TradingChartsTourPrimaryTokenText")}</Typography>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_indicators_area",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TradingChartsTourIndicatorsTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TradingChartsTourIndicatorsText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_price_info",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TradingChartsTourViewPrefsText")}</Typography>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_tools_area",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TradingChartsTourToolsText")}</Typography>
      ),
      position: "right"
    },
    {
      selector: "#tradingview_timeline_area",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TradingChartsTourTimelineText")}</Typography>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_widget",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TradingChartsTourHelpTitle")}</Typography>
          <Typography 
            sx={{ color: "#4a5568" }} 
            dangerouslySetInnerHTML={{ __html: t("TradingChartsTourHelpText") }}
          />
        </Box>
      ),
      position: "bottom"
    }
  ];
  
  return (
    <PageAccessGuard requiredPage="/charts">
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
        <Box sx={{ height: "770px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box display="flex" alignItems="center">
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold", mb: 0 }}
                id="trading_header"
              >
                {t("TradingCharts")}
              </Typography>
              <StartTourButton />
            </Box>
        
        <Chip
          icon={
                         <Box
               component="svg"
               viewBox="0 0 16 16"
               sx={{ 
                 animation: `${rotate} 4s linear infinite`,
                 width: '12px',
                 height: '12px',
                 fill: '#60a5fa'
               }}
             >
              <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
            </Box>
          }
          label="Customization Coming Soon"
          sx={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '20px',
            color: '#60a5fa',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '13px',
            animation: `${pulseGlow} 3s ease-in-out infinite`,
            backdropFilter: 'blur(8px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              animation: `${shimmer} 2s infinite`,
              zIndex: 0,
            },
            '& .MuiChip-label': {
              position: 'relative',
              zIndex: 1,
            },
            '& .MuiChip-icon': {
              position: 'relative',
              zIndex: 1,
            }
          }}
        />
      </Box>
      
          <Box id="tradingview_widget" sx={{ width: "100%", height: "100%", position: "relative" }}>
            <Box 
              id="tradingview_top_bar" 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "20%", 
                height: "70px", 
                zIndex: 1,
                pointerEvents: "none"
              }} 
            />
            <Box 
              id="tradingview_indicators_area" 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: "18%", 
                width: "25%", 
                height: "130px", 
                zIndex: 1,
                pointerEvents: "none"
              }} 
            />
            <Box 
              id="tradingview_price_info" 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: "8%", 
                width: "20%", 
                height: "80px", 
                zIndex: 1,
                pointerEvents: "none"
              }} 
            />
            <Box 
              id="tradingview_tools_area" 
              sx={{ 
                position: "absolute", 
                top: "120px", 
                left: "5%", 
                width: "20%", 
                height: "80px", 
                zIndex: 1,
                pointerEvents: "none" 
              }} 
            />
            <Box 
              id="tradingview_timeline_area" 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: "8%", 
                width: "22%", 
                height: "80px", 
                zIndex: 1,
                pointerEvents: "none"
              }} 
            />
            <SymbolOverviewNoSSR
              symbol="COINBASE:BTCUSD"
              copyrightStyles={{
                parent: {
                  display: "none",
                },
              }}
              theme={mode === "light" ? "light" : "dark"}
              autosize
            />
          </Box>
        </Box>
      </>
    </TourProvider>
    </PageAccessGuard>
  );
}
