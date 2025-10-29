import { Box, Button } from "@mui/material";
import { Typography, Chip, keyframes, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../components/AnimatedStartTourButton";
import { useState, useEffect, useMemo } from "react";
import { PageAccessGuard } from "@/components/PageAccessGuard";
import Image from "next/image";
import { updateTourStatusAsync, useAppDispatch, fetchReactourSettingsAsync, useAppSelector } from "components";

const TOUR_ID = "charts_v1";
const TOUR_NAME = "charts";

const StartTourButton = () => {
  return (
    <AnimatedStartTourButton 
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
    />
  );
};

const TourStateSync = ({ totalSteps, themeMode }: { totalSteps: number; themeMode: string }) => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  const [tourWasOpened, setTourWasOpened] = useState(false);
  const reactourSettings = useAppSelector((state) => state.reactour.settings);

  useEffect(() => {
    const loadTourData = async () => {
      try {
        await dispatch(fetchReactourSettingsAsync()).unwrap();
      } catch (error) {
        console.error('Failed to fetch tour settings:', error);
      }
    };
    loadTourData();
  }, [dispatch]);

  useEffect(() => {
    if (!reactourSettings?.tours) return;
    
    const viewed = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_VIEWED`] === 1;
    
    if (!viewed && !isOpen && !tourWasOpened) {
      const stepFromDb = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;
      if (!isNaN(stepFromDb)) setCurrentStep(stepFromDb);
      setIsOpen(true);
    }
  }, [reactourSettings, isOpen, tourWasOpened, setCurrentStep, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    dispatch(updateTourStatusAsync({
      tourName: TOUR_NAME,
      update: { 
        step: currentStep,
        viewed: currentStep >= totalSteps - 1 ? true : undefined
      }
    }));
  }, [currentStep, totalSteps, isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen && tourWasOpened) {
      dispatch(updateTourStatusAsync({
        tourName: TOUR_NAME,
        update: { viewed: true }
      }));
    } else if (isOpen) {
      setTourWasOpened(true);
    }
  }, [isOpen, tourWasOpened, dispatch]);
  
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
  const theme = useTheme();
  const { t } = useTranslation("TradingPage");

  const steps: StepType[] = useMemo(() => [
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
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography sx={{ color: "#1a1a1a", mb: 2 }}>{t("TradingChartsTourPrimaryTokenText")}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Image
              src={theme.palette.mode === "light" ? "/chart_step2_light.png" : "/chart_step2_dark.png"}
              alt="Chart Step 2"
              width={125}
              height={63}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_indicators_area",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TradingChartsTourIndicatorsTitle")}</Typography>
          <Typography sx={{ color: "#4a5568", mb: 2 }}>{t("TradingChartsTourIndicatorsText")}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Image
              src={theme.palette.mode === "light" ? "/chart_step3_light.png" : "/chart_step3_dark.png"}
              alt="Chart Step 3"
              width={115}
              height={55}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_price_info",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography sx={{ color: "#1a1a1a", mb: 2 }}>{t("TradingChartsTourViewPrefsText")}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Image
              src={theme.palette.mode === "light" ? "/chart_step4_light.png" : "/chart_step4_dark.png"}
              alt="Chart Step 4"
              width={125}
              height={63}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#tradingview_tools_area",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography sx={{ color: "#1a1a1a", mb: 2 }}>{t("TradingChartsTourToolsText")}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Image
              src={theme.palette.mode === "light" ? "/chart_step5_light.png" : "/chart_step5_dark.png"}
              alt="Chart Step 5"
              width={63}
              height={120}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        </Box>
      ),
      position: "center"
    },
    {
      selector: "#tradingview_timeline_area",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography sx={{ color: "#1a1a1a", mb: 2 }}>{t("TradingChartsTourTimelineText")}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Image
              src={theme.palette.mode === "light" ? "/chart_step6_light.png" : "/chart_step6_dark.png"}
              alt="Chart Step 6"
              width={125}
              height={63}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        </Box>
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
  ], [theme.palette.mode, t]);
  
  return (
    <PageAccessGuard requiredPage="/charts">
    <TourProvider
      key={theme.palette.mode}
      steps={steps}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: "32px 24px 24px 24px", 
          background: "#f7f5f2",
          color: "#1a1a1a", 
          minWidth: 400, 
          maxWidth: 600,
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
        <TourStateSync totalSteps={steps.length} themeMode={theme.palette.mode} />
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
            background:
            theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '20px',
            color: theme.palette.mode === 'light' ? theme.palette.primary.dark : '#60a5fa',
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
                left: "0%", 
                width: "100%", 
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
                left: "0%", 
                width: "100%", 
                height: "70px", 
                zIndex: 1,
                pointerEvents: "none"
              }} 
            />
            <Box 
              id="tradingview_price_info" 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: "0%", 
                width: "100%", 
                height: "70px", 
                zIndex: 1,
                pointerEvents: "none"
              }}  
            />
            <Box 
              id="tradingview_tools_area" 
              sx={{ 
                position: "absolute", 
                top: "0px", 
                left: "0%", 
                width: { xs: "10%", lg: "3%" }, 
                height: "100%", 
                zIndex: 1,
                pointerEvents: "none" 
              }} 
            />
            <Box 
              id="tradingview_timeline_area" 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: "0%", 
                width: "100%", 
                height: "70px", 
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
              theme={theme.palette.mode === "light" ? "light" : "dark"}
              autosize
            />
          </Box>
        </Box>
      </>
    </TourProvider>
    </PageAccessGuard>
  );
}
