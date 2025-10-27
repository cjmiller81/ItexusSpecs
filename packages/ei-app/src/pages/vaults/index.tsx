import VaultsTokensSection from "@/features/Income/VaultsTokensSection";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../components/AnimatedStartTourButton";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAppDispatch } from "@/libs/redux/Store";
import { setAccordionState, useTourMigration, fetchReactourSettingsAsync } from "components";

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
  
  const {
    migrationCompleted,
    manuallyClosedInSession,
    viewed,
    reactourSettings,
  } = useTourMigration({
    tourId: TOUR_ID,
    tourName: TOUR_NAME,
    isOpen,
    currentStep,
    totalSteps,
  });
  
  const openAllAccordions = () => {
    const accordionKeys = ['VaultsTokensSection'];
    accordionKeys.forEach(key => {
      dispatch(setAccordionState({ key, open: true }));
    });
  };

  useEffect(() => {
    if (!migrationCompleted || manuallyClosedInSession) return;

    if (!viewed && !isOpen) {
      openAllAccordions();
      const stepFromDb = reactourSettings?.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;
      if (!isNaN(stepFromDb)) setCurrentStep(stepFromDb);
      setIsOpen(true);
    }
  }, [viewed, isOpen, migrationCompleted, manuallyClosedInSession, setCurrentStep, setIsOpen, reactourSettings]);
  
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
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourIncomeFiltersText")}</Typography>
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
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourIncomeClearFiltersText")}</Typography>
      ),
      position: "left"
    },
    {
      selector: ".dx-datagrid-filter-panel-text",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourIncomeCurrentFilterText")}</Typography>
      ),
      position: "top"
    },
    {
      selector: "#income_export",
      content: () => (
        <Typography sx={{ color: "#1a1a1a" }}>{t("TourIncomeExportText")}</Typography>
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
          padding: "32px 24px 24px 24px", 
          background: "#f7f5f2",
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
        <VaultsTokensSection persisKey="VaultsTokensSection" startTourButton={<StartTourButton />} />
      </>
    </TourProvider>
  );
}
