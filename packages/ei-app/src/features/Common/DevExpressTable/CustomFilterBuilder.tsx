/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";
import { CreateFilterModel } from "@/libs/redux/Slices/AllTokensTableSlice";
import { isDeepEqual } from "@/utils/utils";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from "@mui/lab";
import { AnimatedStartTourButton } from "../../../components/AnimatedStartTourButton";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { YesNoDialog } from "components";
import { FilterType, IPrefilterTokensFilterValues } from "components/src/models/token/IPrefilterTokensFilterValues";
import FilterBuilderDef from "devextreme-react/filter-builder";
import { ValueChangedEvent } from "devextreme/ui/filter_builder";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { CustomDeleteIcon } from "@/components/CustomDeleteIcon";
import { TourProvider, useTour } from "@reactour/tour";
import { FeatureAccessGuard } from "components";

const FILTER_BUILDER_TOUR_ID = "filter_builder_v1";

const TourManager = () => {
  const { isOpen, currentStep } = useTour();

  useEffect(() => {
    if (isOpen) {
        localStorage.setItem(`EI_TOUR_${FILTER_BUILDER_TOUR_ID}_VIEWED`, "1");

    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentStep >= 0) {
        localStorage.setItem(`EI_TOUR_${FILTER_BUILDER_TOUR_ID}_STEP`, currentStep.toString());

    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const popover = document.querySelector('.reactour__popover');
        const mask = document.querySelector('.reactour__mask');
        
        if (popover) {
          (popover as HTMLElement).style.zIndex = '99999999';
          (popover as HTMLElement).style.position = 'fixed';
          (popover as HTMLElement).style.display = 'block';
          (popover as HTMLElement).style.visibility = 'visible';
          (popover as HTMLElement).style.opacity = '1';
        }
        
        if (mask) {
          (mask as HTMLElement).style.zIndex = '99999998';
          (mask as HTMLElement).style.position = 'fixed';
          (mask as HTMLElement).style.display = 'block';
          (mask as HTMLElement).style.visibility = 'visible';
          (mask as HTMLElement).style.opacity = '0.8';
        }

        const styleId = 'reactour-modal-override';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
          .reactour__popover {
            z-index: 99999999 !important;
            position: fixed !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          .reactour__mask {
            z-index: 99999998 !important;
            position: fixed !important;
            display: block !important;
            visibility: visible !important;
            opacity: 0.8 !important;
          }
          .reactour__close {
            z-index: 100000000 !important;
          }
          .reactour__controls {
            z-index: 99999999 !important;
          }
          .reactour__navigation {
            z-index: 99999999 !important;
          }
        `;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return null; 
};

const TourPortalManager = ({ isTourOpen }: { 
  isTourOpen: boolean;
}) => {
  const { setIsOpen, setCurrentStep, currentStep } = useTour();

  useEffect(() => {
    if (isTourOpen) {
      setIsOpen(true);
      
      const savedStep = localStorage.getItem(`EI_TOUR_${FILTER_BUILDER_TOUR_ID}_STEP`);
      if (savedStep && !isNaN(Number(savedStep))) {
        const stepNumber = Number(savedStep);
        setTimeout(() => {
          setCurrentStep(stepNumber);
        }, 100);
      }
    } else {
      setIsOpen(false);
    }
  }, [isTourOpen, setIsOpen, setCurrentStep]);

  useEffect(() => {
    if (isTourOpen && currentStep >= 0) {
        localStorage.setItem(`EI_TOUR_${FILTER_BUILDER_TOUR_ID}_STEP`, currentStep.toString());
        localStorage.setItem(`EI_TOUR_${FILTER_BUILDER_TOUR_ID}_VIEWED`, "1");
    }
  }, [isTourOpen, currentStep]);

  return null;
};

const TourPortal = ({ tourSteps, isModalOpen, onStartTourRef }: { 
  tourSteps: any[], 
  isModalOpen: boolean,
  onStartTourRef: React.MutableRefObject<(() => void) | null>
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const handleStartTour = () => {
    setIsTourOpen(currentValue => {
      if (currentValue) {
        setTimeout(() => {
          setIsTourOpen(true);
        }, 100);
        return false;
      } else {
        return true;
      }
    });
  };

  useEffect(() => {
    onStartTourRef.current = handleStartTour;
  });

  useEffect(() => {
    if (isModalOpen && !isTourOpen) {
      const isTourViewed = localStorage.getItem(`EI_TOUR_${FILTER_BUILDER_TOUR_ID}_VIEWED`) === "1";
      if (!isTourViewed) {
        setTimeout(() => {
          setIsTourOpen(true);
        }, 1000); 
      }
    }
  }, [isModalOpen, isTourOpen]);

  useEffect(() => {
    if (!isModalOpen && isTourOpen) {
      setIsTourOpen(false);
    }
  }, [isModalOpen, isTourOpen]);

  useEffect(() => {
    if (isTourOpen) {
      const timer = setTimeout(() => {
        const popover = document.querySelector('.reactour__popover');
        const mask = document.querySelector('.reactour__mask');
        
        if (popover) {
          (popover as HTMLElement).style.zIndex = '99999999';
          (popover as HTMLElement).style.position = 'fixed';
          (popover as HTMLElement).style.display = 'block';
          (popover as HTMLElement).style.visibility = 'visible';
          (popover as HTMLElement).style.opacity = '1';
        }
        
        if (mask) {
          (mask as HTMLElement).style.zIndex = '99999998';
          (mask as HTMLElement).style.position = 'fixed';
          (mask as HTMLElement).style.display = 'block';
          (mask as HTMLElement).style.visibility = 'visible';
          (mask as HTMLElement).style.opacity = '0.8';
        }

        const styleId = 'reactour-modal-override';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
          .reactour__popover {
            z-index: 99999999 !important;
            position: fixed !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          .reactour__mask {
            z-index: 99999998 !important;
            position: fixed !important;
            display: block !important;
            visibility: visible !important;
            opacity: 0.8 !important;
          }
          .reactour__close {
            z-index: 100000000 !important;
          }
          .reactour__controls {
            z-index: 99999999 !important;
          }
          .reactour__navigation {
            z-index: 99999999 !important;
          }
        `;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isTourOpen]);

  if (typeof window === 'undefined' || !isModalOpen) {
    return null;
  }

  return createPortal(
    <TourProvider
      steps={tourSteps}
      showBadge={false}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: 16, 
          background: "#f7f5f2",
          color: "#6b7280",
          fontSize: "0.95rem",
          lineHeight: 1.8,
          zIndex: 99999999,
        }),
        maskArea: (base) => ({ 
          ...base, 
          rx: 10,
          zIndex: 99999998,
        }),
        badge: (base) => ({ ...base, display: "none" }),
        close: (base) => ({ 
          ...base, 
          zIndex: 100000000,
        }),
        controls: (base) => ({ 
          ...base, 
          zIndex: 99999999,
        }),
        navigation: (base) => ({ 
          ...base, 
          zIndex: 99999999,
        }),
      }}
      components={{
        Content: (props: any) => {
          const step = tourSteps[props.currentStep];
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
        Navigation: ({ setCurrentStep, currentStep, steps, setIsOpen }: any) => (
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
      <TourPortalManager isTourOpen={isTourOpen} />
    </TourProvider>,
    document.body
  );
};

const StartTourButton = ({ onStartTour }: { onStartTour: () => void }) => {
  return (
    <AnimatedStartTourButton 
      tourId="filter_builder_v1"
      onClick={onStartTour}
      sx={{ 
        fontWeight: 600,
        px: 2,
        py: 0.5,
      }}
    />
  );
};

export interface ICustomFilterBuilderProps {
  predefinedFilters: IPrefilterTokensFilterValues[];
  onCreateFilter: (filter: CreateFilterModel) => void;
  onUpdateFilter: (filter: IPrefilterTokensFilterValues) => void;
  onDeleteFilter: (filterId: string) => void;
  onDisableFilter: () => void;
  filterToAppply?: object | null;
  onApply: (filterValue: object[]) => void;
  filterType: FilterType;
  filterLoading?: boolean;
  filterDeletingLoading?: boolean;
  filterBuilderFields: FilterBuilderItems[];
}

export interface CustomFilterBuilderRef {
  onUpdateFilter: (filter: string | any[] | (() => any) | null) => void;
  onOpenBuilder: (status: boolean) => void;
}

const CustomFilterBuilder: React.FC<ICustomFilterBuilderProps & React.RefAttributes<CustomFilterBuilderRef>> = forwardRef<CustomFilterBuilderRef, ICustomFilterBuilderProps>(({
  predefinedFilters,
  onCreateFilter,
  onUpdateFilter,
  onDeleteFilter,
  onDisableFilter,
  filterToAppply,
  onApply,
  filterLoading,
  filterDeletingLoading,
  filterBuilderFields,
  filterType
}, ref) => {

  const videoLinks = {
    introduction: "https://www.youtube.com/embed/HMoJuK9mNtw",
    buildFilter: "https://www.youtube.com/embed/e1tWUwDouiw",
    nandGate: "https://www.youtube.com/embed/wYhxPBvQL1g",
    buildingNORGate: "https://www.youtube.com/embed/IMm88o07GLg",
    buildingORGate: "https://www.youtube.com/embed/PW-5hBCggu8",
    logicGateDiagramAND: "https://youtube.com/embed/pS3erHfCcY8",
    logicGateDiagramNOTAND: "https://youtube.com/embed/SI1gUt3xNFU",
    logicGateDiagramNorGate: "https://youtube.com/embed/c48K1wqo5ow",
    logicGateDiagramOR: "https://youtube.com/embed/xfSR3MgBWrc",
  };

  const sortedPredefinedFilters = useMemo(() => {
    return [...predefinedFilters].sort((a, b) => {
      return (a.isPublic ? 0 : 1) - (b.isPublic ? 0 : 1);
    });
  }, [predefinedFilters]);

  const [filterBuilderOpen, setFilterBuilderOpen] = useState(false);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<IPrefilterTokensFilterValues | null>(null);
  const [filterName, setFilterName] = useState<string | undefined>("");
  const [filterValue, setFilterValue] = useState<object[] | undefined | null>();
  const [filterToDelete, setFilterToDelete] = useState<IPrefilterTokensFilterValues | undefined>();
  const [isDeleteFilterModalOpened, setIsDeleteFilterModalOpened] = useState<boolean>(false);
  const { t } = useTranslation("CustomFilterBuilder");
  const theme = useTheme();
  const [openIntroduction, setOpenIntroduction] = useState(true);
  const [openLogicGate, setOpenLogicGate] = useState(true);
  const [openBuildFilter, setOpenBuildFilter] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(videoLinks.introduction);
  const [showGuidanceBanner, setShowGuidanceBanner] = useState(true);
  
  const startTourRef = useRef<(() => void) | null>(null);

  const tourSteps = [
    {
      selector: "#filter_builder_header",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>Filter Builder</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>You are in the Filter Builder (Income Platform)</Typography>
        </Box>
      ),
      position: "bottom" as const,
    },
    {
      selector: "#instruction_videos",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>Instruction Videos</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>Filter Builder instruction videos to help you get started</Typography>
        </Box>
      ),
      position: "right" as const,
    },
    {
      selector: "#custom_section",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>Custom Filter Build</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>Custom filter build section - create your own filters here</Typography>
        </Box>
      ),
      position: "bottom" as const,
    },
    {
      selector: "#saved_filters",
      content: () => (
        <Box>
          <Typography fontWeight={700} fontSize={18} sx={{ mb: 1, color: '#1a1a1a' }}>Saved Filters</Typography>
          <Typography sx={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>View your saved filters here</Typography>
        </Box>
      ),
      position: "left" as const,
    },
  ];

  useImperativeHandle(ref, () => ({
    onUpdateFilter: (filter) => {
      if (filter && !Array.isArray(filter)) {
        setFilterValue([filter] as object[]);
      } else {
        setFilterValue(filter as object[]);
      }

      const isPredefinedFilter = sortedPredefinedFilters.find(filter => filter.filter.toString() == filter?.toString());
      if (isPredefinedFilter) {
        setSelectedSavedFilter(isPredefinedFilter);
        setFilterName(isPredefinedFilter.name);
      } else {
        setSelectedSavedFilter(null);
        setFilterName("");
      }
    },
    onOpenBuilder: (status) => {
      handleFilterBuilderOpen(status);
    }
  }));

  useEffect(() => {
    if (filterToAppply && !Array.isArray(filterToAppply)) {
      setFilterValue([filterToAppply]);
    } else {
      setFilterValue(filterToAppply);
    }

    const isPredefinedFilter = sortedPredefinedFilters.find(filter => filter.filter.toString() == filterToAppply?.toString());
    if (isPredefinedFilter) {
      setSelectedSavedFilter(isPredefinedFilter);
      setFilterName(isPredefinedFilter.name);
    } else {
      setSelectedSavedFilter(null);
      setFilterName("");
    }
  }, [filterToAppply, sortedPredefinedFilters]);

  useEffect(() => {
    if (filterBuilderOpen) {
      setShowGuidanceBanner(true);
    }
  }, [filterBuilderOpen]);

  useEffect(() => {
    if (!selectedSavedFilter) return;
    const updatedFilter = sortedPredefinedFilters.find(filter => filter.id == selectedSavedFilter?.id);
    if (updatedFilter) setSelectedSavedFilter(updatedFilter);
  }, [sortedPredefinedFilters, selectedSavedFilter]);

  const handleFilterValueChanged = (event: ValueChangedEvent) => {
    if (isDeepEqual(event.value, filterValue)) {
      return;
    }

    setFilterValue(event.value);
  };

  const handleFilterBuilderClick = (e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('.dx-filterbuilder-action-icon.dx-icon-plus')) {
    setShowGuidanceBanner(false);
  }
};

  const handleApplyFilter = () => {
    if (filterValue) {
      onApply(filterValue);
      setFilterBuilderOpen(false);
    }
    else setFilterBuilderOpen(false);
  };

  const handleSavedFilterChange = (event: SelectChangeEvent<string>) => {
    const predefinedFilter = sortedPredefinedFilters.find(filter => filter.id === event.target.value[0]);
    if (predefinedFilter) {
      setSelectedSavedFilter(predefinedFilter);
      setFilterValue(predefinedFilter.filter);
      setFilterName(predefinedFilter.name);
    }
  };

  const handleVideoChange = (videoKey) => {
    setCurrentVideo(videoLinks[videoKey]);
  };

  const handleClearFilters = () => {
    onDisableFilter();
    setSelectedSavedFilter(null);
    setFilterValue(undefined);
    setFilterName("");
  };

  const handleDismissGuidanceBanner = () => {
    setShowGuidanceBanner(false);
  };

  const handleFilterBuilderOpen = (status: boolean) => {
    setFilterBuilderOpen(status);
    if (status) {
      setShowGuidanceBanner(true);
    }
  };

  const handleSaveFilter = () => {
    if (!filterName) return;
    if (selectedSavedFilter) {
      onUpdateFilter({
        id: selectedSavedFilter.id,
        name: filterName,
        filterType: filterType,
        description: filterName,
        icon: "filter",
        isPublic: true,
        OwnerUserId: "",
        isPublished: false,
        accessPlanName: "",
        filter: filterValue || [],
      });
    } else {
      onCreateFilter({
        name: filterName,
        description: filterName,
        filterType: filterType,
        icon: "filter",
        isPublic: true,
        OwnerUserId: "",
        isPublished: false,
        accessPlanName: "",
        filter: filterValue || [],
      });
    }
  };

  const handleApplyFilterChange = (event: SelectChangeEvent<string>) => {
    const predefinedFilter = sortedPredefinedFilters.find(filter => filter.id === event.target.value[0]);
    if (predefinedFilter) {
      onApply([predefinedFilter.filter]);
      setSelectedSavedFilter(predefinedFilter);
      setFilterValue(predefinedFilter.filter);
      setFilterName(predefinedFilter.name);
    }
  };

  const handleDeleteFilter = (
    filter: IPrefilterTokensFilterValues,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setFilterToDelete(filter);
    setIsDeleteFilterModalOpened(true);
  };

  const onAgree = () => {
    if (!filterToDelete) {
      return;
    }

    onDeleteFilter(filterToDelete.id);
    setIsDeleteFilterModalOpened(false);

    if (filterToDelete.id === selectedSavedFilter?.id) {
      setSelectedSavedFilter(null);
      setFilterValue(null);
    }
  };

  const mapFilterName = (filter: string | null | undefined, isPublic: boolean = true) => {
    return isPublic ? `Default - ${filter}` : `${filter}`;
  }

  const mapButtonFilterName = (filter: string | null | undefined, isPublic: boolean = true) => {
    if (filter) {
      return isPublic ? `Default - ${filter}` : `${filter}`;
    }

    return "SELECT PRE-BUILT FILTER";
  };

  const handleToggle = () => {
    setOpenIntroduction(prev => !prev);
  };

  const handleToggleBuildFilter = () => {
    setOpenBuildFilter(prev => !prev);
  };

  const handleToggleLogicGate = () => {
    setOpenLogicGate(prev => !prev);
  };

  return (
    <>
      <TourPortal tourSteps={tourSteps} isModalOpen={filterBuilderOpen} onStartTourRef={startTourRef} />
      <StyledAdaptivePageBox sx={{ width: "100%" }}>
        <Select
          id="filter_presets"
          fullWidth
          size="small"
          displayEmpty
          onChange={handleApplyFilterChange}
          sx={{
            minWidth: 250,
            maxWidth: 250,
            maxHeight: 32,
            marginRight: 1,
            backgroundColor: "#219a83",
            color: theme.palette.mode === "dark" ? "#363640" : "white",
            fontWeight: 600,
            textAlign: "center",
            borderColor: "#219a83",
            "@media (max-width: 1030px) and (min-width: 900px)": {
              width: "210px",
              minWidth: 200,
            },
            "@media (max-width: 900px)": {
              mt: 1,
            },
            "& .MuiSelect-icon": {
              fill: theme.palette.mode === "dark" ? "#363640" : "white",
            },
          }}
          renderValue={_value => mapButtonFilterName(selectedSavedFilter?.name, selectedSavedFilter?.isPublic)}>
          {sortedPredefinedFilters.map(filter => (
            <MenuItem
              selected={false}
              key={filter.id}
              value={[filter.id, filter.name]}>
              <ListItemText primary={mapFilterName(filter?.name, filter?.isPublic)} />
              {!filter.isPublic && (
                <IconButton
                  onClick={event => handleDeleteFilter(filter, event)}
                  disableRipple
                  sx={{
                    padding: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <CustomDeleteIcon />
                </IconButton>
              )}
            </MenuItem>
          ))}
        </Select>
        <StyledFilterButton
          id="filter_builder_btn"
          variant="contained"
          sx={{
            minWidth: 250,
            maxHeight: 32,
            "@media (min-width: 900px) and (max-width: 1030px)": {
              width: "210px",
              minWidth: 200,
            },
            "@media (max-width: 900px)": {
              mt: 1,
            },
          }}
          color={"success"}
          onClick={() => setFilterBuilderOpen(true)}
          startIcon={<TuneIcon />}>
          {t("BuildStrategyFilter")}
        </StyledFilterButton>
        <StyledFilterButton
          sx={{
            width: "150px",
            minWidth: 80,
            "@media (max-width: 1030px) and (min-width: 900px)": {
              width: "113px",
              minWidth: 80,
              fontSize: "12px",
            },
            "@media (max-width: 900px)": {
              mt: 1,
            },
          }}
          variant="contained"
          color={"error"}
          disabled={!filterValue || filterValue?.length == 0}
          onClick={() => handleClearFilters()}
          id="clear_filter_btn">
          {t("ClearFilter")}
        </StyledFilterButton>
      </StyledAdaptivePageBox>
      <YesNoDialog
        content={t("DeleteDialogContent")}
        title={t("DeleteDialogTitle")}
        onAgree={onAgree}
        open={isDeleteFilterModalOpened}
        onClose={() => setIsDeleteFilterModalOpened(false)}
      />
      <Dialog
        fullWidth
        open={filterBuilderOpen!}
        sx={{
          zIndex: 1300,
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              minHeight: "80%",
              minWidth: "90%",
            },
          },
        }}
        onClose={() => setFilterBuilderOpen(false)}>
        <IconButton
          sx={{ position: "absolute", right: "10px", top: "10px" }}
          onClick={() => setFilterBuilderOpen(false)}>
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ bgcolor: "background.paper" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" id="filter_builder_header">{t("FilterTokens")}</Typography>
            <StartTourButton onStartTour={() => startTourRef.current?.()} />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper" }}>
          <Box sx={{ width: "100%" }}>
            <ContentContainer>
              <Stack>
                <FilterBuilderComponentContainer id="custom_section">
                  <Box
                    sx={{
                      "& .dx-filterbuilder.dx-widget": {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}>
                    <Box
                      onClick={handleFilterBuilderClick}
                      sx={{
                        "& .dx-filterbuilder.dx-widget": {
                          backgroundColor: theme.palette.background.paper,
                        },
                      }}>
                      <FilterBuilderDef
                        value={filterValue as any[]}
                        fields={filterBuilderFields}
                        onValueChanged={handleFilterValueChanged}
                      />
                    </Box>
                  </Box>

                  {showGuidanceBanner && (!filterValue || filterValue.length === 0) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '40px',
                        maxWidth: '350px',
                        background: 'linear-gradient(135deg, #219a83 0%, #1a7a6b 100%)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        boxShadow: '0 2px 8px rgba(33, 154, 131, 0.2)',
                        zIndex: 1000,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                          💡
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            lineHeight: 1.4,
                            flex: 1,
                            color: "white"
                          }}
                        >
                          {t("ClickTheButtonToAddYourFirstFilterCondition")}
                        </Typography>
                        <IconButton
                          onClick={handleDismissGuidanceBanner}
                          size="small"
                          sx={{
                            color: '#219a83',
                            p: 0.5,
                            ml: 1,
                            flexShrink: 0
                          }}
                        >
                          <CloseIcon sx={{ fontSize: '16px', color:"white" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </FilterBuilderComponentContainer>
                <ClearButton
                  disabled={!filterValue || !filterValue.length || filterValue.length == 0}
                  onClick={handleClearFilters}
                  variant="contained"
                  color="warning">
                  {t("Clear", { ns: "Common" })}
                </ClearButton>

                <StyledDivider />
                <FilterControlsContainer>
                  <Stack
                    gap={2}
                    alignItems={"center"}
                    direction={"row"}>
                    <Typography
                      noWrap
                      fontWeight={500}
                      variant="body1"
                      minWidth={90}>
                      {t("SaveFilterAs")}
                    </Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={event => setFilterName(event.target.value)}
                      value={filterName}
                      size="small"
                    />
                  </Stack>
                  <Stack
                    minWidth={300}
                    direction={"row"}
                    gap={2}
                    justifyContent="space-between"
                    height={24}>
           <FeatureAccessGuard
             feature="saveStrategy"
             currentCount={sortedPredefinedFilters.filter(f => !f.isPublic).length}
             filterType={filterType ? String(filterType) : undefined}
             savedFilters={sortedPredefinedFilters}
           >
                      <LoadingButton
                        loading={filterLoading}
                        sx={{ minWidth: 90 }}
                        color="primary"
                        disabled={!filterName}
                        onClick={handleSaveFilter}
                        variant="contained">
                        {t("Save", { ns: "Common" })}
                      </LoadingButton>
                    </FeatureAccessGuard>
                    <Button
                      sx={{ width: "100%" }}
                      disabled={!filterValue}
                      onClick={handleApplyFilter}
                      variant="contained"
                      color={"success"}>
                      {t("ApplyFilter")}
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={2} id="instruction_videos">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mt: 2 }} >
                        {t("FilterBuilderTrainingVideos")}
                      </Typography>

                      <Box>
                        <Box
                          sx={{
                            backgroundColor: theme.palette.mode === "dark" ? "#5a5a5a" :"#cecece",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{t("IntroductionVideo")}</Typography>
                          <IconButton onClick={handleToggle}>
                            <ExpandMoreIcon sx={{ color: theme.palette.mode === "dark" ? "#fff" :"black" }} />
                          </IconButton>
                        </Box>

                        <Collapse in={openIntroduction}>
                          <Box sx={{ padding: "8px 16px" }}>
                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("introduction")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  color: "#2196F3",
                                  textDecoration: "none",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("FilterBuilderIntroGuide")}
                              </a>
                            </Typography>
                          </Box>
                        </Collapse>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            backgroundColor: theme.palette.mode === "dark" ? "#5a5a5a" :"#cecece",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{t("HowBuildLogicGate")}</Typography>
                          <IconButton onClick={handleToggleLogicGate}>
                            <ExpandMoreIcon sx={{ color: theme.palette.mode === "dark" ? "#fff" :"black" }} />
                          </IconButton>
                        </Box>

                        <Collapse in={openLogicGate}>
                          <Box sx={{ padding: "8px 16px" }}>
                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramAND")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramAND")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramNOTAND")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramNOTAND")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramNorGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramNORGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramOR")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramOR")}
                              </a>
                            </Typography>
                          </Box>
                        </Collapse>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            backgroundColor: theme.palette.mode === "dark" ? "#5a5a5a" :"#cecece",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{t("HowBuildFilter")}</Typography>
                          <IconButton onClick={handleToggleBuildFilter}>
                            <ExpandMoreIcon sx={{ color: theme.palette.mode === "dark" ? "#fff" :"black" }} />
                          </IconButton>
                        </Box>

                        <Collapse in={openBuildFilter}>
                          <Box sx={{ padding: "8px 16px" }}>
                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("buildFilter")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingANDGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("nandGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingNANDGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("buildingORGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingORGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("buildingNORGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingNORGate")}
                              </a>
                            </Typography>

                          </Box>
                        </Collapse>
                      </Box>
                    </Box>

                  </Stack>
                </FilterControlsContainer>
              </Stack>
              <Stack width="100%">
                <FilterSelectorContainer id="saved_filters">
                  <Typography
                    noWrap
                    fontWeight={500}
                    variant="body1"
                    minWidth={150}>
                    {t("SelectFilter")}
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    onChange={handleSavedFilterChange}
                    renderValue={_value => {
                      return <ListItemText primary={mapFilterName(selectedSavedFilter?.name, selectedSavedFilter?.isPublic)} />;
                    }}>
                    {sortedPredefinedFilters.map(filter => (
                      <MenuItem
                        selected={false}
                        key={filter.id}
                        value={[filter.id, filter.name]}>
                        <ListItemText primary={mapFilterName(filter?.name, filter?.isPublic)} />
                        {!filter.isPublic && (
                          <LoadingButton
                            loading={filter.id === filterToDelete?.id && filterDeletingLoading}
                            onClick={event => handleDeleteFilter(filter, event)}
                            variant="contained"
                            color="error"
                          >
                            {t("Delete", { ns: "Common" })}
                          </LoadingButton>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FilterSelectorContainer>
                <Box sx={{ width: "auto", display: "flex", justifyContent: "center", marginTop:"50px", marginLeft:"50px" }}>
                      {currentVideo && (
                        <iframe
                          width="100%"
                          height="515"
                          src={currentVideo}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                  </Box>
              </Stack>
            </ContentContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
});

CustomFilterBuilder.displayName = 'CustomFilterBuilder';

export default CustomFilterBuilder;

const FilterBuilderComponentContainer = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(16),
  minWidth: theme.spacing(60),
  position: 'relative',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignSelf: "center",
  width: "80%",
}));

const ClearButton = styled(Button)(({ theme }) => ({
  alignSelf: "center",
  width: "50%",
  marginTop: theme.spacing(2),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const FilterControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const FilterSelectorContainer = styled(Box)(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(2),
  },
}));

const StyledAdaptivePageBox = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "30px",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "self-start",
    justifyContent: "flex-start",
  },
}));

const StyledFilterButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.down("md")]: {
    marginRight: theme.spacing(2),
  },
}));
