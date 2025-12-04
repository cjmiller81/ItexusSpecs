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
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { CustomDeleteIcon } from "@/components/CustomDeleteIcon";
import { TourProvider, useTour } from "@reactour/tour";
import { FeatureAccessGuard } from "components";
import { useGetChainsQuery } from "@/features/Investing/chainsApi";
import { useGetCategoriesQuery } from "@/features/Investing/categoriesApi";
import { useGetExchangesQuery } from "@/features/Investing/exchangesApi";
import { iconsApi, iconsAbortableApi } from "@/services/iconsService";
import appAxios from "@/libs/axios/axios";
import { filtersApi } from "../../../../../components/src/services/filterService";

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
  const isLiquidityPoolFilter = filterType === "liquidity-pool";
  const isVaultsFilter = filterType === "vaults";
  const { data: chains, isLoading: chainsLoading } = useGetChainsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery(undefined, { 
    skip: isLiquidityPoolFilter 
  });
  const { data: exchanges, isLoading: exchangesLoading } = useGetExchangesQuery(undefined, { 
    skip: isLiquidityPoolFilter 
  });
  const [allSymbolOptions, setAllSymbolOptions] = useState<string[]>([]);
  const [allPoolSymbolOptions, setAllPoolSymbolOptions] = useState<string[]>([]);
  const [allPoolProjectOptions, setAllPoolProjectOptions] = useState<string[]>([]);
  const [allVaultNameOptions, setAllVaultNameOptions] = useState<string[]>([]);
  const [allVaultPlatformOptions, setAllVaultPlatformOptions] = useState<string[]>([]);
  const [customChains, setCustomChains] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customExchanges, setCustomExchanges] = useState<string[]>([]);
  const [poolCategories, setPoolCategories] = useState<string[]>([]);
  
  const allSymbolOptionsRef = useRef<string[]>([]);
  const allPoolSymbolOptionsRef = useRef<string[]>([]);
  const allPoolProjectOptionsRef = useRef<string[]>([]);
  const allVaultNameOptionsRef = useRef<string[]>([]);
  const allVaultPlatformOptionsRef = useRef<string[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const startTourRef = useRef<(() => void) | null>(null);
  const filterBuilderRef = useRef<any>(null);

  // Load pool categories once for liquidity-pool filter type
  useEffect(() => {
    if (isLiquidityPoolFilter && poolCategories.length === 0) {
      filtersApi.getPoolCategories()
        .then(data => {
          setPoolCategories(data);
        })
        .catch(error => {
          console.error("Failed to load pool categories:", error);
        });
    }
  }, [isLiquidityPoolFilter]);

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
    if (filterBuilderRef.current?.instance && filterValue !== undefined && filterValue !== null) {
      const fbInstance = filterBuilderRef.current.instance;
      const currentFbValue = fbInstance.option('value');
      if (!isDeepEqual(filterValue, currentFbValue)) {
        fbInstance.option('value', filterValue);
        fbInstance.repaint();
      }
    }
  }, [filterValue]);

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
    if (filterBuilderRef.current?.instance) {
      const fbInstance = filterBuilderRef.current.instance;
      const currentFbValue = fbInstance.option('value');
      
      if (currentFbValue && !isDeepEqual(currentFbValue, filterValue)) {
        onApply(currentFbValue);
        setFilterBuilderOpen(false);
        return;
      }
    }
    
    if (filterValue) {
      onApply(filterValue);
      setFilterBuilderOpen(false);
    }
    else {
      setFilterBuilderOpen(false);
    }
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
    if (status && isLiquidityPoolFilter) {
      onDisableFilter();
      setFilterValue(undefined);
      setSelectedSavedFilter(null);
      setFilterName("");
    }
    setFilterBuilderOpen(status);
    if (status) {
      setShowGuidanceBanner(true);
    }
  };
  
  useEffect(() => {
    allSymbolOptionsRef.current = allSymbolOptions;
  }, [allSymbolOptions]);
  
  useEffect(() => {
    allPoolSymbolOptionsRef.current = allPoolSymbolOptions;
  }, [allPoolSymbolOptions]);

  useEffect(() => {
    allPoolProjectOptionsRef.current = allPoolProjectOptions;
  }, [allPoolProjectOptions]);
  
  useEffect(() => {
    allVaultNameOptionsRef.current = allVaultNameOptions;
  }, [allVaultNameOptions]);
  
  useEffect(() => {
    allVaultPlatformOptionsRef.current = allVaultPlatformOptions;
  }, [allVaultPlatformOptions]);
  
  const extractValuesFromFilter = (filter: any, dataField: string): string[] => {
    if (!filter || !Array.isArray(filter)) return [];
    
    const values: string[] = [];
    
    const traverse = (item: any) => {
      if (Array.isArray(item)) {
        if (item.length === 3 && typeof item[0] === 'string' && item[0] === dataField) {
          const value = item[2];
          if (value && typeof value === 'string') {
            values.push(value);
          }
        } else {
          item.forEach(subItem => traverse(subItem));
        }
      }
    };
    
    traverse(filter);
    return values;
  };

  useEffect(() => {
    if (filterBuilderOpen && filterValue) {
      const filterSymbols = extractValuesFromFilter(filterValue, 'sym');
      
      if (filterSymbols.length > 0) {
        const symbolsArray = filterSymbols.map(sym => sym.toUpperCase());
        
        symbolsArray.forEach(sym => {
          if (!allSymbolOptionsRef.current.includes(sym)) {
            allSymbolOptionsRef.current.push(sym);
          }
        });
        
        setAllSymbolOptions([...allSymbolOptionsRef.current]);
      }

      const filterPoolSymbols = extractValuesFromFilter(filterValue, 'symbol');
      if (filterPoolSymbols.length > 0) {
        const poolSymbolsArray = filterPoolSymbols.map(sym => (sym.toUpperCase()));
        poolSymbolsArray.forEach(sym => {
          if (!allPoolSymbolOptionsRef.current.includes(sym)) {
            allPoolSymbolOptionsRef.current.push(sym);
          }
        });
        setAllPoolSymbolOptions([...allPoolSymbolOptionsRef.current]);
      }

      const filterPoolProjects = extractValuesFromFilter(filterValue, 'project');
      if (filterPoolProjects.length > 0) {
        const poolProjectsArray = filterPoolProjects.map(project => (project.toUpperCase()));
        poolProjectsArray.forEach(project => {
          if (!allPoolProjectOptionsRef.current.includes(project)) {
            allPoolProjectOptionsRef.current.push(project);
          }
        });
        setAllPoolProjectOptions([...allPoolProjectOptionsRef.current]);
      }

      if (isVaultsFilter) {
        const filterVaultNames = extractValuesFromFilter(filterValue, 'name');
        if (filterVaultNames.length > 0) {
          const vaultNamesArray = filterVaultNames
            .map(value => (typeof value === "string" ? value.trim() : value))
            .filter((value): value is string => typeof value === "string" && value.length > 0);

          vaultNamesArray.forEach(name => {
            if (!allVaultNameOptionsRef.current.includes(name)) {
              allVaultNameOptionsRef.current.push(name);
            }
          });
          setAllVaultNameOptions([...allVaultNameOptionsRef.current]);
        }

        const filterVaultPlatforms = extractValuesFromFilter(filterValue, 'platformId');
        if (filterVaultPlatforms.length > 0) {
          const vaultPlatformsArray = filterVaultPlatforms
            .map(value => (typeof value === "string" ? value.trim() : value))
            .filter((value): value is string => typeof value === "string" && value.length > 0);

          vaultPlatformsArray.forEach(platform => {
            if (!allVaultPlatformOptionsRef.current.includes(platform)) {
              allVaultPlatformOptionsRef.current.push(platform);
            }
          });
          setAllVaultPlatformOptions([...allVaultPlatformOptionsRef.current]);
        }
      }
    }
  }, [filterBuilderOpen]);

  const searchTokensDynamically = async (searchText: string, component?: any) => {
    if (!searchText || searchText.length < 2) {
      return;
    }
    
    try {
      const result = await iconsAbortableApi.getIcons(
        searchText,
        0,
        50,
        undefined,
        0 
      );
      
      if (result.items.length > 0) {
        const newSymbols = result.items.map(item => item.sym.toUpperCase());
        
        const existingSymbols = allSymbolOptionsRef.current.filter(sym => !newSymbols.includes(sym));
        const uniqueSymbols = [...newSymbols, ...existingSymbols];
        
        if (component) {
          component.option('dataSource', uniqueSymbols);       
          if (!component.option('opened')) {
            component.open();
          }
        }
      }
    } catch (error) {
      // Silently handle error
    }
  };

  const searchPoolSymbolsDynamically = async (searchText: string, component?: any) => {
    if (!searchText || searchText.length < 2) {
      return;
    }

    try {
      const response = await appAxios.get<string[]>(
        `/api/defi/pools/symbols`,
        {
          params: {
            searchString: searchText,
          },
          withCredentials: true,
        }
      );

      let newSymbols = Array.isArray(response.data)
        ? response.data
            .filter((sym): sym is string => typeof sym === "string" && sym.trim().length > 0)
            .map(sym => sym.toUpperCase())
            .slice(0, 70)
        : [];

      if (newSymbols.length === 0) {
        if (component) {
          component.option('dataSource', []);
        }
        return;
      }

      const existingSymbols = allPoolSymbolOptionsRef.current.filter(sym => !newSymbols.includes(sym));
      const uniqueSymbols = [...newSymbols, ...existingSymbols];

      allPoolSymbolOptionsRef.current = uniqueSymbols;

      if (component) {
        component.option('dataSource', uniqueSymbols);
        if (!component.option('opened')) {
          component.open();
        }
      } else {
        setAllPoolSymbolOptions([...uniqueSymbols]);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return;
      }
      throw error;
    }
  };

  const searchPoolProjectsDynamically = async (searchText: string, component?: any) => {
    if (!searchText || searchText.length < 2) {
      return;
    }

    try {
      const response = await appAxios.get<string[]>(
        `/api/defi/pools/projects`,
        {
          params: {
            searchString: searchText,
          },
          withCredentials: true,
        }
      );

      let newProjects = Array.isArray(response.data)
        ? response.data
            .filter((project): project is string => typeof project === "string" && project.trim().length > 0)
            .map(project => project.trim())
            .slice(0, 70)
        : [];

      if (newProjects.length === 0) {
        if (component) {
          component.option('dataSource', []);
        }
        return;
      }

      const existingProjects = allPoolProjectOptionsRef.current.filter(project => !newProjects.includes(project));
      const uniqueProjects = [...newProjects, ...existingProjects];

      allPoolProjectOptionsRef.current = uniqueProjects;

      if (component) {
        component.option('dataSource', uniqueProjects);
        if (!component.option('opened')) {
          component.open();
        }
      } else {
        setAllPoolProjectOptions([...uniqueProjects]);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return;
      }
      throw error;
    }
  };

  const searchVaultNamesDynamically = async (searchText: string, component?: any) => {
    if (!isVaultsFilter || !searchText || searchText.length < 2) {
      return;
    }

    try {
      const normalizedSymbols = encodeURIComponent(searchText);
      const response = await appAxios.get<string[]>(
        `/api/beefy/vaults/names/${normalizedSymbols}`,
        {
          withCredentials: true,
          params: {
            symbols: searchText,
          },
        }
      );

      let newNames = Array.isArray(response.data)
        ? response.data
            .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
            .map(name => name.trim())
            .slice(0, 70)
        : [];

      if (newNames.length === 0) {
        if (component) {
          component.option('dataSource', []);
        }
        return;
      }

      const existingNames = allVaultNameOptionsRef.current.filter(name => !newNames.includes(name));
      const uniqueNames = [...newNames, ...existingNames];

      allVaultNameOptionsRef.current = uniqueNames;

      if (component) {
        component.option('dataSource', uniqueNames);
        if (!component.option('opened')) {
          component.open();
        }
      } else {
        setAllVaultNameOptions([...uniqueNames]);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (component) {
          component.option('dataSource', []);
        }
        return;
      }
      throw error;
    }
  };

  const searchVaultPlatformsDynamically = async (searchText: string, component?: any) => {
    if (!isVaultsFilter || !searchText || searchText.length < 2) {
      return;
    }

    try {
      const normalizedSymbols = encodeURIComponent(searchText);
      const response = await appAxios.get<string[]>(
        `/api/beefy/vaults/platforms/${normalizedSymbols}`,
        {
          withCredentials: true,
          params: {
            symbols: searchText,
          },
        }
      );

      let newPlatforms = Array.isArray(response.data)
        ? response.data
            .filter((platform): platform is string => typeof platform === "string" && platform.trim().length > 0)
            .map(platform => platform.trim())
            .slice(0, 70)
        : [];

      if (newPlatforms.length === 0) {
        if (component) {
          component.option('dataSource', []);
        }
        return;
      }

      const existingPlatforms = allVaultPlatformOptionsRef.current.filter(platform => !newPlatforms.includes(platform));
      const uniquePlatforms = [...newPlatforms, ...existingPlatforms];

      allVaultPlatformOptionsRef.current = uniquePlatforms;

      if (component) {
        component.option('dataSource', uniquePlatforms);
        if (!component.option('opened')) {
          component.open();
        }
      } else {
        setAllVaultPlatformOptions([...uniquePlatforms]);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        if (component) {
          component.option('dataSource', []);
        }
        return;
      }
      throw error;
    }
  };


  const processedFields = useMemo(() => {
    return filterBuilderFields.map(field => {
      const isSymbolField = field.dataField === "sym";
      const isPoolSymbolField = field.dataField === "symbol";
      const isPoolProjectField = field.dataField === "project";
      const isVaultNameField = isVaultsFilter && field.dataField === "name";
      const isVaultPlatformField = isVaultsFilter && field.dataField === "platformId";
      const isSymbolLikeField =
        isSymbolField || isPoolSymbolField || isPoolProjectField || isVaultNameField || isVaultPlatformField;
      

      if (isSymbolLikeField) {
        const resolveDataSource = () => {
          if (isSymbolField) {
            return allSymbolOptions;
          }
          if (isPoolSymbolField) {
            return allPoolSymbolOptions;
          }
          if (isPoolProjectField) {
            return allPoolProjectOptions;
          }
          if (isVaultNameField) {
            return allVaultNameOptions;
          }
          return allVaultPlatformOptions;
        };

        return {
          ...field,
          lookup: {
            dataSource: resolveDataSource(),
            allowClearing: true,
          },
          editorOptions: {
            searchEnabled: true,
            searchMode: "contains",
            showClearButton: true,
            acceptCustomValue: true,
            minSearchLength: 0,
            showDropDownButton: true,
            openOnFieldClick: true,
          },
          calculateFilterExpression: function(this: any, filterValue: any, selectedFilterOperation: any) {
            if (!filterValue) {
              return "";
            }
            return [this.dataField, selectedFilterOperation || "=", filterValue];
          },
        };
      }
      
      if ((field.dataField === "chainsFormatted" || field.dataField === "chain") && chains) {
        let chainsOptions = chains.map(c => c.name);
        
        customChains.forEach(chain => {
          if (!chainsOptions.includes(chain)) {
            chainsOptions.push(chain);
          }
        });
        
        if (filterValue) {
          const filterChains = extractValuesFromFilter(filterValue, field.dataField);
          filterChains.forEach(chain => {
            if (!chainsOptions.includes(chain)) {
              chainsOptions.push(chain);
            }
          });
        }
        
        return {
          ...field,
          lookup: {
            dataSource: chainsOptions,
            allowClearing: true,
          },
          editorOptions: {
            searchEnabled: true,
            searchMode: "contains",
            showClearButton: true,
            acceptCustomValue: true,
          },
          calculateFilterExpression: function(this: any, filterValue: any, selectedFilterOperation: any) {
            if (!filterValue) {
              return "";
            }
            return [this.dataField, selectedFilterOperation || "=", filterValue];
          },
        };
      }
      
      if ((field.dataField === "categoriesFormatted" || field.dataField === "category")) {
        // For liquidity-pool, use pool categories; otherwise use regular categories
        let categoriesOptions: string[] = [];
        
        if (isLiquidityPoolFilter && poolCategories.length > 0) {
          categoriesOptions = [...poolCategories];
        } else if (categories) {
          categoriesOptions = categories.map(c => c.name);
        }
        
        customCategories.forEach(category => {
          if (!categoriesOptions.includes(category)) {
            categoriesOptions.push(category);
          }
        });
        
        if (filterValue) {
          const filterCategories = extractValuesFromFilter(filterValue, field.dataField);
          filterCategories.forEach(category => {
            if (!categoriesOptions.includes(category)) {
              categoriesOptions.push(category);
            }
          });
        }
        
        return {
          ...field,
          lookup: {
            dataSource: categoriesOptions,
            allowClearing: true,
          },
          editorOptions: {
            searchEnabled: true,
            searchMode: "contains",
            showClearButton: true,
            acceptCustomValue: true,
          },
          calculateFilterExpression: function(this: any, filterValue: any, selectedFilterOperation: any) {
            if (!filterValue) {
              return "";
            }
            return [this.dataField, selectedFilterOperation || "=", filterValue];
          },
        };
      }
      
      if (field.dataField === "exchangesFormatted" && exchanges) {
        let exchangesOptions = exchanges.map(e => e.name);
        
        customExchanges.forEach(exchange => {
          if (!exchangesOptions.includes(exchange)) {
            exchangesOptions.push(exchange);
          }
        });
        
        if (filterValue) {
          const filterExchanges = extractValuesFromFilter(filterValue, 'exchangesFormatted');
          filterExchanges.forEach(exchange => {
            if (!exchangesOptions.includes(exchange)) {
              exchangesOptions.push(exchange);
            }
          });
        }
        
        return {
          ...field,
          lookup: {
            dataSource: exchangesOptions,
            allowClearing: true,
          },
          editorOptions: {
            searchEnabled: true,
            searchMode: "contains",
            showClearButton: true,
            acceptCustomValue: true,
          },
          calculateFilterExpression: function(this: any, filterValue: any, selectedFilterOperation: any) {
            if (!filterValue) {
              return "";
            }
            return [this.dataField, selectedFilterOperation || "=", filterValue];
          },
        };
      }
      
      return field;
    });
  }, [filterBuilderFields, chains, categories, exchanges, allSymbolOptions, allPoolSymbolOptions, allPoolProjectOptions, allVaultNameOptions, allVaultPlatformOptions, customChains, customCategories, customExchanges, isVaultsFilter, isLiquidityPoolFilter, poolCategories, filterValue]);

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
      onApply(predefinedFilter.filter);
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

  const poolsDataSource = useMemo(() => {
    return [
      {
        text: "All",
        value: "all",
      },
      {
        text: "Symbol",
        value: "symbol",
      },
      {
        text: "Project",
        value: "project",
      },
    ];
  }, []);

  return (
    <>
      <TourPortal tourSteps={tourSteps} isModalOpen={filterBuilderOpen} onStartTourRef={startTourRef} />
      <StyledAdaptivePageBox sx={{ width: "100%" }}>
        <Select
          id="filter_presets"
          fullWidth
          size="small"
          displayEmpty
          value={selectedSavedFilter?.id || ''}
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
          onClick={() => {
            if (isLiquidityPoolFilter) {
              onDisableFilter();
              setFilterValue(undefined);
              setSelectedSavedFilter(null);
              setFilterName("");
            }
            setFilterBuilderOpen(true);
          }}
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
                        ref={filterBuilderRef}
                        value={filterValue as any[]}
                        fields={processedFields}
                        onValueChanged={handleFilterValueChanged}
                        onEditorPreparing={(e: any) => {
                          const isSymbolField = e.dataField === "sym";
                          const isPoolSymbolField = e.dataField === "symbol";
                        const isPoolProjectField = e.dataField === "project";
                        const isVaultNameField = isVaultsFilter && e.dataField === "name";
                        const isVaultPlatformField = isVaultsFilter && e.dataField === "platformId";
                        const isSymbolLikeField = e.dataField === "sym" || e.dataField === "symbol" || e.dataField === "project" || isVaultNameField || isVaultPlatformField;
                          const isChainsField = e.dataField === "chainsFormatted" || e.dataField === "chain";
                          const isCategoriesField = e.dataField === "categoriesFormatted" || e.dataField === "category";
                          const isExchangesField = e.dataField === "exchangesFormatted";
                        const isLookupField = isSymbolField || isPoolSymbolField || isPoolProjectField || isVaultNameField || isVaultPlatformField || isChainsField || isCategoriesField || isExchangesField;
                          
                          if (e.editorName === "dxSelectBox" && isLookupField) {
                            const originalOptions = e.editorOptions || {};
                            
                            let currentDataSource = originalOptions.dataSource;
                            if (isSymbolField) {
                              currentDataSource = allSymbolOptionsRef.current;
                            } else if (isPoolSymbolField) {
                              currentDataSource = allPoolSymbolOptionsRef.current;
                            } else if (isPoolProjectField) {
                              currentDataSource = allPoolProjectOptionsRef.current;
                            } else if (isVaultNameField) {
                              currentDataSource = allVaultNameOptionsRef.current;
                            } else if (isVaultPlatformField) {
                              currentDataSource = allVaultPlatformOptionsRef.current;
                            }
                            
                            e.editorOptions = {
                              ...originalOptions,
                              dataSource: currentDataSource,
                              acceptCustomValue: true,
                              onInput: (args: any) => {
                                  const searchText = args.event?.target?.value;
                                  const component = args.component;
                                const fbInstance = filterBuilderRef.current?.instance;
                                const fbValue = fbInstance?.option?.("value");
                                const displayFilter = Array.isArray(fbValue) ? JSON.stringify(fbValue) : fbValue;
                                const currentComponentValue = component.option("value");
                                  
                                  if (searchTimeoutRef.current) {
                                    clearTimeout(searchTimeoutRef.current);
                                  }
                                  
                                if (isSymbolField) {
                                  const normalized = typeof searchText === "string" ? searchText.toUpperCase() : searchText;

                                  if (
                                    currentComponentValue &&
                                    normalized &&
                                    typeof normalized === "string" &&
                                    normalized !== currentComponentValue
                                  ) {
                                    component.option("value", normalized);
                                  }

                                  if (!component.option("opened")) {
                                    component.open();
                                  }

                                  if (normalized && typeof normalized === "string" && normalized.length >= 2) {
                                    searchTimeoutRef.current = setTimeout(() => {
                                      searchTokensDynamically(normalized, component);
                                    }, 300);
                                  }

                                  return;
                                }

                                const normalizedValue = (() => {
                                  if (typeof searchText !== "string") return searchText;
                                  if (isPoolSymbolField) return searchText.toUpperCase();
                                  if (isPoolProjectField) return searchText.trim();
                                  if (isVaultNameField || isVaultPlatformField) return searchText.trim();
                                  return searchText;
                                })();

                                if (!component.option("opened")) {
                                  component.open();
                                }

                                if (
                                  normalizedValue &&
                                  typeof normalizedValue === "string" &&
                                  normalizedValue.length > 0 &&
                                  currentComponentValue &&
                                  normalizedValue !== currentComponentValue
                                ) {
                                  component.option("value", normalizedValue);
                                }

                                if (normalizedValue && typeof normalizedValue === "string" && normalizedValue.length >= 2) {
                                  searchTimeoutRef.current = setTimeout(() => {
                                    if (isPoolSymbolField) {
                                      searchPoolSymbolsDynamically(normalizedValue, component);
                                    } else if (isPoolProjectField) {
                                      searchPoolProjectsDynamically(normalizedValue, component);
                                    } else if (isVaultNameField) {
                                      searchVaultNamesDynamically(normalizedValue, component);
                                    } else if (isVaultPlatformField) {
                                      searchVaultPlatformsDynamically(normalizedValue, component);
                                    }
                                  }, 300);
                                }
                              },
                              onClosed: (args: any) => {
                                const component = args.component;
                                let currentValue = component.option('value');
                                const currentText = component.option('text');

                                const fbInstanceInitial = filterBuilderRef.current?.instance;
                                const fbValueBefore = fbInstanceInitial ? fbInstanceInitial.option("value") : undefined;

                                if (typeof currentText === "string" && currentText.trim().length > 0) {
                                  const normalizedFromText = (() => {
                                    if (isSymbolField || isPoolSymbolField) return currentText.toUpperCase();
                                    if (isPoolProjectField) return currentText.trim();
                                    if (isVaultNameField || isVaultPlatformField) return currentText.trim();
                                    return currentText;
                                  })();

                                  if (!currentValue) {
                                    component.option("value", normalizedFromText);
                                    currentValue = normalizedFromText;
                                  } else if (normalizedFromText && normalizedFromText !== currentValue) {
                                    component.option("value", normalizedFromText);
                                    currentValue = normalizedFromText;
                                  }
                                }
                                const oldValue = e.value;
                                
                                if (currentValue && currentValue !== oldValue) {
                                  setTimeout(() => {
                                    if (filterBuilderRef.current?.instance) {
                                      const fbInstance = filterBuilderRef.current.instance;
                                      let currentFilter = fbInstance.option('value') || [];
                                      
                                      const newCondition = [e.dataField, e.filterOperation || 'contains', currentValue];
                                      
                                      const getCurrentOperator = (filter: any): string => {
                                        if (!Array.isArray(filter)) return 'and';
                                        if (filter[0] === '!' && Array.isArray(filter[1])) {
                                          const innerOp = getCurrentOperator(filter[1]);
                                          return innerOp === 'or' ? '!or' : '!and';
                                        }
                                        for (const item of filter) {
                                          if (typeof item === 'string' && (item === 'and' || item === 'or')) {
                                            return item;
                                          }
                                        }
                                        return 'and';
                                      };
                                      
                                      const replaceAllOperators = (filter: any, newOperator: string): any => {
                                        if (!Array.isArray(filter)) return filter;
                                        const isNot = newOperator.startsWith('!');
                                        const baseOp = isNot ? newOperator.substring(1) : newOperator;
                                        if (filter[0] === '!' && Array.isArray(filter[1])) {
                                          const innerFilter = filter[1].map(item => {
                                            if (typeof item === 'string' && (item === 'and' || item === 'or')) {
                                              return baseOp;
                                            }
                                            return item;
                                          });
                                          return isNot ? ['!', innerFilter] : innerFilter;
                                        }
                                        const result = filter.map(item => {
                                          if (typeof item === 'string' && (item === 'and' || item === 'or')) {
                                            return baseOp;
                                          }
                                          return item;
                                        });
                                        return isNot ? ['!', result] : result;
                                      };
                                      
                                      const replaceOrAddCondition = (filter: any): any => {
                                        if (!Array.isArray(filter) || filter.length === 0) {
                                          return newCondition;
                                        }

                                        if (typeof filter[0] === 'string') {
                                          if (filter[0] === e.dataField) {
                                            return newCondition;
                                          }
                                          return [filter, 'and', newCondition];
                                        }

                                        const result = [...filter];
                                        let replaced = false;

                                        for (let i = 0; i < result.length; i++) {
                                          const item = result[i];
                                          if (Array.isArray(item) && typeof item[0] === 'string') {
                                            if (item[0] === e.dataField) {
                                              result[i] = newCondition;
                                            replaced = true;
                                            break;
                                          }
                                        }
                                        }

                                        if (replaced) {
                                          return result;
                                        }

                                        return [...filter, 'and', newCondition];
                                      };
                                      
                                      let updatedFilter = replaceOrAddCondition(currentFilter);
                                      const currentOp = getCurrentOperator(currentFilter);
                                      const newOp = getCurrentOperator(updatedFilter);
                                      if (currentOp !== newOp && currentFilter.length > 0) {
                                        updatedFilter = replaceAllOperators(updatedFilter, newOp);
                                      }
                                      
                                      fbInstance.option('value', updatedFilter);
                                      const fbValueAfter = fbInstance.option('value');
                                      if (typeof e.setValue === 'function') {
                                        e.setValue(currentValue);
                                      }
                                      
                                      if (currentValue) {
                                        if (isSymbolField) {
                                        if (!allSymbolOptionsRef.current.includes(currentValue)) {
                                          allSymbolOptionsRef.current = [...allSymbolOptionsRef.current, currentValue];
                                          }
                                          setAllSymbolOptions([...allSymbolOptionsRef.current]);
                                        } else if (isPoolSymbolField) {
                                          if (!allPoolSymbolOptionsRef.current.includes(currentValue)) {
                                            allPoolSymbolOptionsRef.current = [...allPoolSymbolOptionsRef.current, currentValue];
                                          }
                                          setAllPoolSymbolOptions([...allPoolSymbolOptionsRef.current]);
                                        } else if (isPoolProjectField) {
                                          if (!allPoolProjectOptionsRef.current.includes(currentValue)) {
                                            allPoolProjectOptionsRef.current = [...allPoolProjectOptionsRef.current, currentValue];
                                          }
                                          setAllPoolProjectOptions([...allPoolProjectOptionsRef.current]);
                                        } else if (isVaultNameField) {
                                          if (!allVaultNameOptionsRef.current.includes(currentValue)) {
                                            allVaultNameOptionsRef.current = [...allVaultNameOptionsRef.current, currentValue];
                                          }
                                          setAllVaultNameOptions([...allVaultNameOptionsRef.current]);
                                        } else if (isVaultPlatformField) {
                                          if (!allVaultPlatformOptionsRef.current.includes(currentValue)) {
                                            allVaultPlatformOptionsRef.current = [...allVaultPlatformOptionsRef.current, currentValue];
                                          }
                                          setAllVaultPlatformOptions([...allVaultPlatformOptionsRef.current]);
                                        }
                                      }
                                    }
                                  }, 10);
                                }
                              },
                              onValueChanged: (args: any) => {
                                      const fbInstance = filterBuilderRef.current?.instance;
                                      const fbValue = fbInstance?.option?.("value");
                                      if (!args?.value || !args.event) {
                                        if (args.component?.option) {
                                          args.component.option("text", args.value ?? args.component.option("text"));
                                          args.component.option("opened", true);
                                        }
                                        return;
                                      }

                                      if (typeof e.setValue === "function") {
                                        e.setValue(args.value);
                                      }

                                  setTimeout(() => {
                                        if (!filterBuilderRef.current?.instance) {
                                          return;
                                        }

                                        const fbInstance = filterBuilderRef.current.instance;
                                        let currentFilter = fbInstance.option("value") || [];
                                        const newCondition = [e.dataField, e.filterOperation || "contains", args.value];
                                      const oldValue = e.value;
                                        if (typeof e.setValue === "function") {
                                          e.setValue(args.value);
                                        }
                                      
                                      const getCurrentOperator = (filter: any): string => {
                                        if (!Array.isArray(filter)) return "and";
                                        if (filter[0] === "!" && Array.isArray(filter[1])) {
                                          const innerOp = getCurrentOperator(filter[1]);
                                      return innerOp === "or" ? "!or" : "!and";
                                        }
                                        for (const item of filter) {
                                      if (typeof item === "string" && (item === "and" || item === "or")) {
                                            return item;
                                          }
                                        }
                                    return "and";
                                      };
                                      
                                      const replaceAllOperators = (filter: any, newOperator: string): any => {
                                        if (!Array.isArray(filter)) return filter;
                                    const isNot = newOperator.startsWith("!");
                                        const baseOp = isNot ? newOperator.substring(1) : newOperator;
                                    if (filter[0] === "!" && Array.isArray(filter[1])) {
                                          const innerFilter = filter[1].map(item => {
                                        if (typeof item === "string" && (item === "and" || item === "or")) {
                                              return baseOp;
                                            }
                                            return item;
                                          });
                                      return isNot ? ["!", innerFilter] : innerFilter;
                                        }
                                        const result = filter.map(item => {
                                      if (typeof item === "string" && (item === "and" || item === "or")) {
                                            return baseOp;
                                          }
                                          return item;
                                        });
                                    return isNot ? ["!", result] : result;
                                      };
                                      
                                      const replaceOrAddCondition = (filter: any): any => {
                                        if (!Array.isArray(filter) || filter.length === 0) {
                                          return newCondition;
                                        }

                                        // одиночное условие
                                        if (typeof filter[0] === 'string') {
                                          if (filter[0] === e.dataField) {
                                            return newCondition;
                                          }
                                          return [filter, 'and', newCondition];
                                        }
                                        
                                        const result = [...filter];
                                        let replaced = false;
                                        
                                        for (let i = 0; i < result.length; i++) {
                                          const item = result[i];
                                          if (Array.isArray(item) && typeof item[0] === 'string') {
                                            if (item[0] === e.dataField) {
                                              result[i] = newCondition;
                                            replaced = true;
                                            break;
                                            }
                                          }
                                        }
                                        
                                        if (replaced) {
                                          return result;
                                        }
                                        
                                        return [...filter, 'and', newCondition];
                                      };
                                      
                                  let updatedFilter = replaceOrAddCondition(currentFilter);
                                      const currentOp = getCurrentOperator(currentFilter);
                                      const newOp = getCurrentOperator(updatedFilter);
                                      
                                      if (currentOp !== newOp && currentFilter.length > 0) {
                                        updatedFilter = replaceAllOperators(updatedFilter, newOp);
                                      }
                                      
                                  fbInstance.option("value", updatedFilter);
                                  setFilterValue(updatedFilter);
                                  if (typeof e.setValue === "function") {
                                    e.setValue(args.value);
                                    }
                                    
                                  const filterBuilderEl = document.querySelector(".dx-filterbuilder");
                                    if (filterBuilderEl) {
                                      (filterBuilderEl as HTMLElement).click();
                                      
                                      if (isSymbolField) {
                                        setTimeout(() => {
                                          if (!allSymbolOptionsRef.current.includes(args.value)) {
                                            allSymbolOptionsRef.current = [...allSymbolOptionsRef.current, args.value];
                                          }
                                          setAllSymbolOptions([...allSymbolOptionsRef.current]);
                                        }, 100);
                                    } else if (isPoolSymbolField) {
                                      setTimeout(() => {
                                        if (!allPoolSymbolOptionsRef.current.includes(args.value)) {
                                          allPoolSymbolOptionsRef.current = [...allPoolSymbolOptionsRef.current, args.value];
                                        }
                                        setAllPoolSymbolOptions([...allPoolSymbolOptionsRef.current]);
                                      }, 100);
                                    } else if (isPoolProjectField) {
                                      setTimeout(() => {
                                        if (!allPoolProjectOptionsRef.current.includes(args.value)) {
                                          allPoolProjectOptionsRef.current = [...allPoolProjectOptionsRef.current, args.value];
                                        }
                                        setAllPoolProjectOptions([...allPoolProjectOptionsRef.current]);
                                  }, 100);
                                } else if (isVaultNameField) {
                                  setTimeout(() => {
                                    if (!allVaultNameOptionsRef.current.includes(args.value)) {
                                      allVaultNameOptionsRef.current = [...allVaultNameOptionsRef.current, args.value];
                                    }
                                    setAllVaultNameOptions([...allVaultNameOptionsRef.current]);
                                  }, 100);
                                } else if (isVaultPlatformField) {
                                  setTimeout(() => {
                                    if (!allVaultPlatformOptionsRef.current.includes(args.value)) {
                                      allVaultPlatformOptionsRef.current = [...allVaultPlatformOptionsRef.current, args.value];
                                    }
                                    setAllVaultPlatformOptions([...allVaultPlatformOptionsRef.current]);
                                  }, 100);
                                }
                                  }
                                }, 100);
                              },
                              onEnterKey: (args: any) => {
                                if (searchTimeoutRef.current) {
                                  clearTimeout(searchTimeoutRef.current);
                                  searchTimeoutRef.current = null;
                                }
                                
                                const component = args.component;
                                const inputText = component.option('text');
                                const currentValue = component.option('value');
                                
                                if (inputText) {
                                  const customValue = (() => {
                                    if (typeof inputText !== "string") return inputText;
                                    if (isSymbolField || isPoolSymbolField) return inputText.toUpperCase();
                                    if (isPoolProjectField) return inputText.trim();
                                    if (isVaultNameField || isVaultPlatformField) return inputText.trim();
                                    return inputText;
                                  })();
                                  if (typeof e.setValue === "function") {
                                    e.setValue(customValue);
                                  }
                                }
                              },
                              onCustomItemCreating: (args: any) => {
                                const customValue = (() => {
                                  if (typeof args.text !== "string") return args.text;
                                  if (isSymbolField || isPoolSymbolField) return args.text.toUpperCase();
                                  if (isPoolProjectField) return args.text.trim();
                                  if (isVaultNameField || isVaultPlatformField) return args.text.trim();
                                  return args.text;
                                })();
                                let currentDS = args.component.option('dataSource');
                                
                                if (!Array.isArray(currentDS)) {
                                  if (isSymbolField) {
                                    currentDS = allSymbolOptionsRef.current;
                                  } else if (isPoolSymbolField) {
                                    currentDS = allPoolSymbolOptionsRef.current;
                                  } else if (isPoolProjectField) {
                                    currentDS = allPoolProjectOptionsRef.current;
                                  } else if (isVaultNameField) {
                                    currentDS = allVaultNameOptionsRef.current;
                                  } else if (isVaultPlatformField) {
                                    currentDS = allVaultPlatformOptionsRef.current;
                                  } else {
                                    currentDS = [];
                                  }
                                }
                                
                                if (!currentDS.includes(customValue)) {
                                  const newDS = [...currentDS, customValue];
                                  
                                  if (isSymbolField) {
                                    allSymbolOptionsRef.current = newDS;
                                    setAllSymbolOptions([...allSymbolOptionsRef.current]);
                                  } else if (isPoolSymbolField) {
                                    allPoolSymbolOptionsRef.current = newDS;
                                    setAllPoolSymbolOptions([...allPoolSymbolOptionsRef.current]);
                                  } else if (isPoolProjectField) {
                                    allPoolProjectOptionsRef.current = newDS;
                                    setAllPoolProjectOptions([...allPoolProjectOptionsRef.current]);
                                  } else if (isVaultNameField) {
                                    allVaultNameOptionsRef.current = newDS;
                                    setAllVaultNameOptions([...allVaultNameOptionsRef.current]);
                                  } else if (isVaultPlatformField) {
                                    allVaultPlatformOptionsRef.current = newDS;
                                    setAllVaultPlatformOptions([...allVaultPlatformOptionsRef.current]);
                                  } else if (isChainsField) {
                                    setCustomChains(prev => [...prev, customValue]);
                                  } else if (isCategoriesField) {
                                    setCustomCategories(prev => [...prev, customValue]);
                                  } else if (isExchangesField) {
                                    setCustomExchanges(prev => [...prev, customValue]);
                                  }
                                  
                                  args.component.option('dataSource', newDS);
                                }
                                
                                args.customItem = customValue;
                                if (typeof e.setValue === "function") {
                                  e.setValue(customValue);
                                }
                                
                                if (filterBuilderRef.current?.instance && e.setValue) {
                                  const fbInstance = filterBuilderRef.current.instance;
                                  let currentFilter = fbInstance.option('value') || [];
                                  
                                  const newCondition = [e.dataField, e.filterOperation || 'contains', customValue];
                                  
                                  const replaceOrAddCondition = (filter: any): any => {
                                    if (!Array.isArray(filter) || filter.length === 0) {
                                      return newCondition;
                                    }
                                    
                                    if (typeof filter[0] === 'string') {
                                      if (filter[0] === e.dataField) {
                                      return newCondition;
                                      }
                                      return [filter, 'and', newCondition];
                                    }
                                    
                                    const result = [...filter];
                                    let replaced = false;

                                    for (let i = 0; i < result.length; i++) {
                                      const item = result[i];
                                      if (Array.isArray(item) && typeof item[0] === 'string') {
                                        if (item[0] === e.dataField) {
                                          result[i] = newCondition;
                                          replaced = true;
                                          break;
                                        }
                                      }
                                    }

                                    if (replaced) {
                                      return result;
                                    }

                                    return [...filter, 'and', newCondition];
                                  };
                                  
                                  const updatedFilter = replaceOrAddCondition(currentFilter);
                                  
                                  fbInstance.option('value', updatedFilter);
                                  if (typeof e.setValue === "function") {
                                    e.setValue(customValue);
                                  }
                                  
                                  setFilterValue(updatedFilter);
                                  if (typeof e.setValue === "function") {
                                    e.setValue(customValue);
                                  }
                                  
                                  setTimeout(() => {
                                    const filterBuilderEl = document.querySelector('.dx-filterbuilder');
                                    if (filterBuilderEl) {
                                      (filterBuilderEl as HTMLElement).click();
                                      
                                      if (isSymbolField) {
                                        setTimeout(() => {
                                          setAllSymbolOptions([...allSymbolOptionsRef.current]);
                                        }, 100);
                                      }
                                      if (isPoolProjectField) {
                                        setTimeout(() => {
                                          if (!allPoolProjectOptionsRef.current.includes(customValue)) {
                                            allPoolProjectOptionsRef.current = [...allPoolProjectOptionsRef.current, customValue];
                                          }
                                          setAllPoolProjectOptions([...allPoolProjectOptionsRef.current]);
                                        }, 100);
                                      }
                                      if (isPoolSymbolField) {
                                        setTimeout(() => {
                                          if (!allPoolSymbolOptionsRef.current.includes(customValue)) {
                                            allPoolSymbolOptionsRef.current = [...allPoolSymbolOptionsRef.current, customValue];
                                          }
                                          setAllPoolSymbolOptions([...allPoolSymbolOptionsRef.current]);
                                        }, 100);
                                      }
                                      if (isVaultNameField) {
                                        setTimeout(() => {
                                          if (!allVaultNameOptionsRef.current.includes(customValue)) {
                                            allVaultNameOptionsRef.current = [...allVaultNameOptionsRef.current, customValue];
                                          }
                                          setAllVaultNameOptions([...allVaultNameOptionsRef.current]);
                                        }, 100);
                                      }
                                      if (isVaultPlatformField) {
                                        setTimeout(() => {
                                          if (!allVaultPlatformOptionsRef.current.includes(customValue)) {
                                            allVaultPlatformOptionsRef.current = [...allVaultPlatformOptionsRef.current, customValue];
                                          }
                                          setAllVaultPlatformOptions([...allVaultPlatformOptionsRef.current]);
                                        }, 100);
                                      }
                                    }
                                  }, 100);
                                }
                              },
                            };
                          }
                        }}
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
                    value={selectedSavedFilter?.id || ''}
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
