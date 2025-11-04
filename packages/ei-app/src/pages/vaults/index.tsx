import VaultsTokensSection from "@/features/Income/VaultsTokensSection";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../components/AnimatedStartTourButton";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { setAccordionState, fetchReactourSettingsAsync, updateTourStatusAsync } from "components";

const TOUR_ID = "vaults_v1";
const TOUR_NAME = "vaults";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  
  const openAllAccordions = () => {
    const accordionKeys = ['VaultsTokensSection'];
    accordionKeys.forEach(key => {
      dispatch(setAccordionState({ key, open: true }));
    });
  };
  
  const handleClick = async () => {
    openAllAccordions();
    
    try {
      const latestSettings = await dispatch(fetchReactourSettingsAsync()).unwrap();    
      const savedStep = latestSettings?.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;     
      setCurrentStep(isNaN(savedStep) ? 0 : savedStep);
      setIsOpen(true);
    } catch (error) {
      console.error('Failed to fetch tour data:', error);
      setCurrentStep(0);
      setIsOpen(true);
    }
  };
  
  return (
    <AnimatedStartTourButton 
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
      onClick={handleClick}
    />
  );
};

const TourStateSync = ({ totalSteps }: { totalSteps: number }) => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  const [tourWasOpened, setTourWasOpened] = useState(false);
  const reactourSettings = useAppSelector((state) => state.reactour.settings);
  
  const openAllAccordions = () => {
    const accordionKeys = ['VaultsTokensSection'];
    accordionKeys.forEach(key => {
      dispatch(setAccordionState({ key, open: true }));
    });
  };

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
      openAllAccordions();
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

export default function VaultsPage() {
  const { t } = useTranslation(["Vaults", "Common"]);

  const steps: StepType[] = [
    {
      selector: "#income_header",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourIncomeStrategyTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourIncomeStrategyText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#income_table .dx-header-row, #income_table .dx-datagrid-headers",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourIncomeTableSortTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourIncomeTableSortText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#filter_presets",
      content: () => (
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourIncomeFiltersText")}</Typography>
      ),
      position: "right"
    },
    {
      selector: "#filter_builder_btn",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("TourIncomeFilterBuilderTitle")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("TourIncomeFilterBuilderText")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: "#clear_filter_btn",
      content: () => (
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourIncomeClearFiltersText")}</Typography>
      ),
      position: "left"
    },
    {
      selector: ".dx-datagrid-filter-panel-text",
      content: () => (
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourIncomeCurrentFilterText")}</Typography>
      ),
      position: "top"
    },
    {
      selector: "#income_export",
      content: () => (
        <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("TourIncomeExportText")}</Typography>
      ),
      position: "left"
    }
  ];

  return (
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
        close: (base) => ({
          ...base,
          width: 14,
          height: 14,
          padding: '10px',
          boxSizing: 'content-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 10,
          right: 8,
          cursor: 'pointer',
        }),
      }}
      showBadge={false}
      components={{
        Content: (props: any) => {
          const step = steps[props.currentStep];
          // @ts-ignore - content() signature varies
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
                  {content || null}
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
        <VaultsTokensSection persisKey="VaultsTokensSection" startTourButton={<StartTourButton />} />
      </>
    </TourProvider>
  );
}
