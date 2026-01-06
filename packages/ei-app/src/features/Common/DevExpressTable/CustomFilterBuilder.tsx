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
import { iconsAbortableApi } from "@/services/iconsService";
import appAxios from "@/libs/axios/axios";
import { filtersApi } from "../../../../../components/src/services/filterService";
import { LIQUIDITY_POOL, PREFILTER_ALL_CATEGORIES_MAP, PREFILTER_CATEGORIES_MAP } from "@/constants/prefilterKeys";
import { generateFilterKey } from "@/helpers/LiquidPoolsFilterFormatter";
import { PrefilterTabs } from "@/types/filter";

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
  filterToApply?: object | null;
  onApply: (filterValue: object[] | string[]) => void;
  filterType: FilterType;
  filterLoading?: boolean;
  filterDeletingLoading?: boolean;
  filterBuilderFields: FilterBuilderItems[];
  onFilterBuilderOpenChange?: (isOpen: boolean) => void;
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
  filterToApply,
  onApply,
  filterLoading,
  filterDeletingLoading,
  filterBuilderFields,
  filterType,
  onFilterBuilderOpenChange
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
  const [filterValue, setFilterValue] = useState<object[] | string[] | undefined | null>();
  const [filterToDelete, setFilterToDelete] = useState<IPrefilterTokensFilterValues | undefined>();
  const [isDeleteFilterModalOpened, setIsDeleteFilterModalOpened] = useState<boolean>(false);
  const { t } = useTranslation("CustomFilterBuilder");
  const theme = useTheme();
  const [openIntroduction, setOpenIntroduction] = useState(true);
  const [openLogicGate, setOpenLogicGate] = useState(true);
  const [openBuildFilter, setOpenBuildFilter] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(videoLinks.introduction);
  const [showGuidanceBanner, setShowGuidanceBanner] = useState(true);
  const isLiquidityPoolFilter = filterType === LIQUIDITY_POOL;
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
  const [customFilterType, setCustomFilterType] = useState<string | undefined>(undefined); 

  const allSymbolOptionsRef = useRef<string[]>([]);
  const allPoolSymbolOptionsRef = useRef<string[]>([]);
  const allPoolProjectOptionsRef = useRef<string[]>([]);
  const allVaultNameOptionsRef = useRef<string[]>([]);
  const allVaultPlatformOptionsRef = useRef<string[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTourRef = useRef<(() => void) | null>(null);
  const filterBuilderRef = useRef<any>(null);
  
  const editingConditionRef = useRef<{
    field: string | null;
    oldValue: any;
    path: number[] | null;
  } | null>(null);
  const filterBeforeEditRef = useRef<any[] | null>(null);
  const lastEditingValueRef = useRef<any>(null);

  useEffect(() => {
    if (isLiquidityPoolFilter && poolCategories.length === 0) {
      filtersApi.getPoolCategories()
        .then(data => {
          setPoolCategories(data);
        })
        .catch(error => {
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

  const transformFilterFromAnyof = useCallback((filter: any): any => {
    if (!filter || !Array.isArray(filter)) {
      return filter;
    }

    if (filter.length === 3 && filter[1] === 'anyof' && Array.isArray(filter[2])) {
      const [field, , values] = filter;
      if (values.length === 0) return [];
      if (values.length === 1) {
        return [field, 'contains', values[0]];
      }
      const conditions = values.map((value: any) => [field, 'contains', value]);
      const result: any[] = [];
      conditions.forEach((condition, index) => {
        if (index > 0) {
          result.push('or');
        }
        result.push(condition);
      });
      return result;
    }

    if (filter.length > 1 && (filter.includes('and') || filter.includes('or'))) {
      return filter.map((item: any) => {
        if (Array.isArray(item)) {
          return transformFilterFromAnyof(item);
        }
        return item;
      });
    }

    return filter;
  }, []);

  useEffect(() => {
    let processedFilter = filterToApply;
    
    if (isLiquidityPoolFilter && processedFilter && Array.isArray(processedFilter)) {
      processedFilter = transformFilterFromAnyof(processedFilter);
    }

    if (processedFilter && !Array.isArray(processedFilter)) {
      setFilterValue([processedFilter]);
    } else {
      setFilterValue(processedFilter);
    }

    const isPredefinedFilter = sortedPredefinedFilters.find(filter => filter.filter.toString() == filterToApply?.toString());
    if (isPredefinedFilter) {
      setSelectedSavedFilter(isPredefinedFilter);
      setFilterName(isPredefinedFilter.name);
    } else {
      setSelectedSavedFilter(null);
      setFilterName("");
    }
  }, [filterToApply, sortedPredefinedFilters, isLiquidityPoolFilter, transformFilterFromAnyof]);

  useEffect(() => {
    if (filterBuilderOpen) {
      setShowGuidanceBanner(true);
    }
    onFilterBuilderOpenChange?.(filterBuilderOpen);
  }, [filterBuilderOpen, onFilterBuilderOpenChange]);
  
  useEffect(() => {
    if (filterBuilderRef.current?.instance && filterValue !== undefined && filterValue !== null) {
      const fbInstance = filterBuilderRef.current.instance;
      const currentFbValue = fbInstance.option('value');
      const valuesEqual = isDeepEqual(filterValue, currentFbValue);
      
      if (!valuesEqual) {
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

  const clearCustomFilterType = () => setCustomFilterType(undefined);

  const defineCategoryAllTab = (categoryConditions) => {
    const categoryValues = categoryConditions.map((condition) => condition[2]);

    const matchedCategories = Object.keys(PREFILTER_CATEGORIES_MAP).filter((category) => {
      const subCategoryList = Object.keys(PREFILTER_CATEGORIES_MAP[category]);
      return subCategoryList.every((subCat) => categoryValues.includes(subCat));
    });

    if (matchedCategories.length === 1) {
      const matchedCategory = matchedCategories[0];
      const subCategoryList = Object.keys(PREFILTER_CATEGORIES_MAP[matchedCategory]);
      const hasExtraValues = categoryValues.some(val => !subCategoryList.includes(val));
      
      if (hasExtraValues) {
        return { categoryTab: PrefilterTabs.ALL_DEFI, categoryValue: undefined };
      }
      return  { categoryTab: matchedCategory, categoryValue: PREFILTER_ALL_CATEGORIES_MAP[matchedCategory] };
    }

    return { categoryTab: PrefilterTabs.ALL_DEFI, categoryValue: undefined };
  };

  const defineCategorySingleTab = (categoryValue: string) => {
    return Object.keys(PREFILTER_CATEGORIES_MAP).find((tabValue) => {
      const tabCategories = PREFILTER_CATEGORIES_MAP[tabValue];
      return !!(categoryValue in tabCategories);
    }) as `${PrefilterTabs}` | undefined;
  };

  useEffect(() => {
    if (!filterValue) {
      clearCustomFilterType();
      return;
    };

    if (filterValue[0] !== 'category') { // there are several conditions in filterValue
      const categoryConditions = filterValue.filter((item) => 
        Array.isArray(item) && item[0] === 'category'
      );
      
      if (categoryConditions.length === 0) {
        clearCustomFilterType();
        return;
      } else if (categoryConditions.length === 1) {
        const categoryValue = categoryConditions[0][2];
        const categoryTab = defineCategorySingleTab(categoryValue);
        const newFilterType = generateFilterKey(filterType, categoryTab, categoryValue);
        newFilterType && setCustomFilterType(newFilterType);
        return;
      }

      const { categoryTab, categoryValue } = defineCategoryAllTab(categoryConditions);
      const newFilterType = generateFilterKey(filterType, categoryTab as `${PrefilterTabs}`, categoryValue);
      newFilterType && setCustomFilterType(newFilterType); 
      return;
    }

    const categoryValue = filterValue[2];
    if (typeof categoryValue !== "string") return;

    const categoryTab = defineCategorySingleTab(categoryValue);
    if (!categoryTab) return;

    const newFilterType = generateFilterKey(filterType, categoryTab, categoryValue);
    newFilterType && setCustomFilterType(newFilterType);
  }, [filterValue, filterType]);

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
    setCustomFilterType(undefined);
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
        filterType: customFilterType ?? filterType,
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
        filterType: customFilterType ?? filterType,
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
          color="success"
          onClick={() => {
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
          color="error"
          disabled={!filterValue || filterValue?.length == 0}
          onClick={handleClearFilters}
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
                          const isChainsField = e.dataField === "chainsFormatted" || e.dataField === "chain";
                          const isCategoriesField = e.dataField === "categoriesFormatted" || e.dataField === "category";
                          const isExchangesField = e.dataField === "exchangesFormatted";
                          const isLookupField = isSymbolField || isPoolSymbolField || isPoolProjectField || isVaultNameField || isVaultPlatformField || isChainsField || isCategoriesField || isExchangesField;
                          
                          if (e.editorName === "dxSelectBox" && isLookupField) {
                            const fbInstance = filterBuilderRef.current?.instance;
                            const currentFilterValue = fbInstance ? fbInstance.option('value') : null;
                            
                            if (e.value !== null && e.value !== undefined && currentFilterValue) {
                              const findConditionPath = (filter: any, targetField: string, targetValue: any, path: number[] = [], visitedIndices: Set<number> = new Set()): number[] | null => {
                                if (!Array.isArray(filter)) return null;
                                
                                for (let i = 0; i < filter.length; i++) {
                                  if (visitedIndices.has(i)) continue;
                                  
                                  const item = filter[i];
                                  if (Array.isArray(item) && item.length === 3 && item[0] === targetField && item[2] === targetValue) {
                                    const fullPath = [...path, i];
                                    return fullPath;
                                  }
                                }
                                
                                for (let i = 0; i < filter.length; i++) {
                                  if (visitedIndices.has(i)) continue;
                                  
                                  const item = filter[i];
                                  if (Array.isArray(item) && !(item.length === 3 && typeof item[0] === 'string')) {
                                    const found = findConditionPath(item, targetField, targetValue, [...path, i], visitedIndices);
                                    if (found) return found;
                                  }
                                }
                                return null;
                              };
                              
                              const getAllConditionsWithField = (filter: any, field: string): Array<{ condition: any, index: number, path: number[] }> => {
                                const results: Array<{ condition: any, index: number, path: number[] }> = [];
                                
                                const traverse = (f: any, path: number[] = []) => {
                                  if (!Array.isArray(f)) return;
                                  
                                  for (let i = 0; i < f.length; i++) {
                                    const item = f[i];
                                    if (Array.isArray(item) && item.length === 3 && item[0] === field) {
                                      results.push({ condition: item, index: i, path: [...path, i] });
                                    } else if (Array.isArray(item) && !(item.length === 3 && typeof item[0] === 'string')) {
                                      traverse(item, [...path, i]);
                                    }
                                  }
                                };
                                
                                traverse(filter);
                                return results;
                              };
                              
                              const allConditions = getAllConditionsWithField(currentFilterValue, e.dataField);
                              
                              const matchingCondition = allConditions.find(c => c.condition[2] === e.value);
                              const conditionPath = matchingCondition ? matchingCondition.path : findConditionPath(currentFilterValue, e.dataField, e.value);
                              
                              editingConditionRef.current = {
                                field: e.dataField,
                                oldValue: e.value,
                                path: conditionPath,
                              };
                              filterBeforeEditRef.current = currentFilterValue ? JSON.parse(JSON.stringify(currentFilterValue)) : null;
                            } else {
                              editingConditionRef.current = null;
                              filterBeforeEditRef.current = null;
                            }
                            
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
                                if (editingTimeoutRef.current) {
                                  clearTimeout(editingTimeoutRef.current);
                                  editingTimeoutRef.current = null;
                                }
                                
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
                                
                                const editingInfo = editingConditionRef.current;
                                const valuesDifferent = currentValue && currentValue !== oldValue;
                                const hasEditingInfo = editingInfo && editingInfo.field === e.dataField && currentValue;
                                const shouldProcess = valuesDifferent || hasEditingInfo;
                                
                                if (shouldProcess) {
                                  setTimeout(() => {
                                    if (filterBuilderRef.current?.instance) {
                                      const fbInstance = filterBuilderRef.current.instance;
                                      let currentFilter = fbInstance.option('value') || [];
                                      
                                      const newCondition = [e.dataField, e.filterOperation || 'contains', currentValue];
                                      
                                      const filterBeforeEdit = filterBeforeEditRef.current;
                                      const isEditing = editingInfo && 
                                                        filterBeforeEdit &&
                                                        editingInfo.field === e.dataField && 
                                                        editingInfo.oldValue !== null && 
                                                        editingInfo.oldValue !== undefined &&
                                                        editingInfo.path !== null &&
                                                        Array.isArray(editingInfo.path) &&
                                                        editingInfo.path.length > 0 &&
                                                        oldValue !== null &&
                                                        oldValue !== undefined &&
                                                        editingInfo.oldValue === oldValue;
                                      
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
                                      
                                      const navigateAndReplace = (filter: any, path: number[], newCondition: any): any => {
                                        if (path.length === 0) return newCondition;
                                        if (!Array.isArray(filter)) return filter;
                                        
                                        const result = JSON.parse(JSON.stringify(filter));
                                        
                                        if (path.length === 1) {
                                          const idx = path[0];
                                          
                                          if (idx < result.length) {
                                            if (Array.isArray(result[idx]) && result[idx].length === 3) {
                                              result[idx] = newCondition;
                                              return result;
                                            } else {
                                              return filter;
                                            }
                                          } else {
                                            return filter;
                                          }
                                        }
                                        
                                        let current = result;
                                        for (let i = 0; i < path.length - 1; i++) {
                                          const idx = path[i];
                                          if (idx < current.length && Array.isArray(current[idx])) {
                                            current[idx] = [...current[idx]];
                                            current = current[idx];
                                          } else {
                                            return filter;
                                          }
                                        }
                                        
                                        const finalIdx = path[path.length - 1];
                                        if (finalIdx < current.length) {
                                          current[finalIdx] = newCondition;
                                        } else {
                                          return filter;
                                        }
                                        
                                        return result;
                                      };
                                      
                                      // Helper function to find condition by field and old value
                                      // Returns ALL matching conditions to help identify the correct one
                                      const findAllConditionsByValue = (filter: any, field: string, oldValue: any, path: number[] = []): Array<{ condition: any, path: number[] }> => {
                                        const results: Array<{ condition: any, path: number[] }> = [];
                                        
                                        if (!Array.isArray(filter)) return results;
                                        
                                        for (let i = 0; i < filter.length; i++) {
                                          const item = filter[i];
                                          if (Array.isArray(item) && item.length === 3 && item[0] === field && item[2] === oldValue) {
                                            results.push({ condition: item, path: [...path, i] });
                                          }
                                          if (Array.isArray(item) && !(item.length === 3 && typeof item[0] === 'string')) {
                                            const found = findAllConditionsByValue(item, field, oldValue, [...path, i]);
                                            results.push(...found);
                                          }
                                        }
                                        return results;
                                      };
                                      
                                      const findConditionByValue = (filter: any, field: string, oldValue: any, path: number[] = []): { condition: any, path: number[] } | null => {
                                        const allMatches = findAllConditionsByValue(filter, field, oldValue, path);
                                        
                                        // If we have a saved path, try to match it
                                        if (editingInfo && editingInfo.path && allMatches.length > 0) {
                                          const pathMatch = allMatches.find(m => JSON.stringify(m.path) === JSON.stringify(editingInfo.path));
                                          if (pathMatch) {
                                            return pathMatch;
                                          }
                                        }
                                        
                                        // Return first match if any
                                        return allMatches.length > 0 ? allMatches[0] : null;
                                      };
                                      
                                      const replaceOrAddCondition = (filter: any): any => {
                                        if (!Array.isArray(filter) || filter.length === 0) {
                                          return newCondition;
                                        }

                                        // If editing, try to replace the specific condition
                                        if (isEditing && editingInfo && editingInfo.path) {
                                          const pathIsValid = editingInfo.path.length === 1 && 
                                                             editingInfo.path[0] < filter.length &&
                                                             Array.isArray(filter[editingInfo.path[0]]) &&
                                                             filter[editingInfo.path[0]].length === 3 &&
                                                             filter[editingInfo.path[0]][0] === editingInfo.field &&
                                                             filter[editingInfo.path[0]][2] === editingInfo.oldValue;
                                          
                                          if (pathIsValid) {
                                            try {
                                              const replaced = navigateAndReplace(filter, editingInfo.path, newCondition);
                                              return replaced;
                                            } catch (error) {
                                              // Ignore error and continue to fallback logic
                                            }
                                          }
                                          
                                          if (editingInfo.field !== null) {
                                            const found = findConditionByValue(filter, editingInfo.field, editingInfo.oldValue);
                                            if (found) {
                                              const replaced = navigateAndReplace(filter, found.path, newCondition);
                                              return replaced;
                                            }
                                          }
                                        }

                                        if (typeof filter[0] === 'string') {
                                          if (filter[0] === e.dataField) {
                                            return newCondition;
                                          }
                                          return [filter, 'and', newCondition];
                                        }

                                        const hasOrOperator = filter.includes('or');
                                        const hasAndOperator = filter.includes('and');
                                        
                                        let foundSameField = false;
                                        let firstSameFieldIndex = -1;
                                        
                                        for (let i = 0; i < filter.length; i++) {
                                          const item = filter[i];
                                          if (Array.isArray(item) && typeof item[0] === 'string') {
                                            if (item[0] === e.dataField) {
                                              foundSameField = true;
                                              if (firstSameFieldIndex === -1) {
                                                firstSameFieldIndex = i;
                                              }
                                            }
                                          }
                                        }
                                        
                                        if (foundSameField) {
                                          const result = [...filter];
                                          result.splice(firstSameFieldIndex + 1, 0, 'or', newCondition);
                                          return result;
                                        }
                                        
                                        if (hasOrOperator && !hasAndOperator) {
                                          return [filter, 'and', newCondition];
                                        } else {
                                          const result = [...filter];
                                          result.push('and', newCondition);
                                          return result;
                                        }
                                      };
                                      
                                      let updatedFilter = replaceOrAddCondition(currentFilter);
                                      const currentOp = getCurrentOperator(currentFilter);
                                      const newOp = getCurrentOperator(updatedFilter);
                                      if (currentOp !== newOp && currentFilter.length > 0) {
                                        updatedFilter = replaceAllOperators(updatedFilter, newOp);
                                      }
                                      
                                      fbInstance.option('value', updatedFilter);
                                      
                                      setFilterValue(updatedFilter);
                                      
                                      editingConditionRef.current = null;
                                      filterBeforeEditRef.current = null;
                                      
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
                                      
                                      if (!args?.value) {
                                        if (args.component?.option) {
                                          args.component.option("text", args.value ?? args.component.option("text"));
                                          args.component.option("opened", true);
                                        }
                                        return;
                                      }
                                      
                                      if (!args.event) {
                                        if (editingTimeoutRef.current) {
                                          clearTimeout(editingTimeoutRef.current);
                                        }
                                        
                                        lastEditingValueRef.current = {
                                          value: args.value,
                                          dataField: e.dataField,
                                          filterOperation: e.filterOperation,
                                        };
                                        
                                        editingTimeoutRef.current = setTimeout(() => {
                                          if (lastEditingValueRef.current && editingConditionRef.current) {
                                            const stored = lastEditingValueRef.current;
                                            
                                            if (filterBuilderRef.current?.instance) {
                                              const fbInstance = filterBuilderRef.current.instance;
                                              let currentFilter = fbInstance.option('value') || [];
                                              const newCondition = [stored.dataField, stored.filterOperation || 'contains', stored.value];
                                              
                                              const editingInfo = editingConditionRef.current;
                                              const isEditing = editingInfo && 
                                                                editingInfo.field === stored.dataField && 
                                                                editingInfo.oldValue !== null && 
                                                                editingInfo.oldValue !== undefined &&
                                                                editingInfo.path !== null &&
                                                                Array.isArray(editingInfo.path) &&
                                                                editingInfo.path.length > 0;
                                              
                                              if (isEditing && editingInfo.path) {
                                                // Use the same replacement logic as in onClosed
                                                const navigateAndReplace = (filter: any, path: number[], newCondition: any): any => {
                                                  if (path.length === 0) return newCondition;
                                                  if (!Array.isArray(filter)) return filter;
                                                  
                                                  const result = JSON.parse(JSON.stringify(filter));
                                                  
                                                  if (path.length === 1) {
                                                    const idx = path[0];
                                                    if (idx < result.length && Array.isArray(result[idx]) && result[idx].length === 3) {
                                                      result[idx] = newCondition;
                                                      return result;
                                                    }
                                                  }
                                                  
                                                  let current = result;
                                                  for (let i = 0; i < path.length - 1; i++) {
                                                    const idx = path[i];
                                                    if (idx < current.length && Array.isArray(current[idx])) {
                                                      current[idx] = [...current[idx]];
                                                      current = current[idx];
                                                    } else {
                                                      return filter;
                                                    }
                                                  }
                                                  
                                                  const finalIdx = path[path.length - 1];
                                                  if (finalIdx < current.length) {
                                                    current[finalIdx] = newCondition;
                                                  }
                                                  
                                                  return result;
                                                };
                                                
                                                const pathIsValid = editingInfo.path.length === 1 && 
                                                                   editingInfo.path[0] < currentFilter.length &&
                                                                   Array.isArray(currentFilter[editingInfo.path[0]]) &&
                                                                   currentFilter[editingInfo.path[0]].length === 3 &&
                                                                   currentFilter[editingInfo.path[0]][0] === editingInfo.field;
                                                
                                                if (pathIsValid) {
                                                  const replaced = navigateAndReplace(currentFilter, editingInfo.path, newCondition);
                                                  fbInstance.option('value', replaced);
                                                  setFilterValue(replaced);
                                                  
                                                  // Clear editing info after update
                                                  editingConditionRef.current = null;
                                                  filterBeforeEditRef.current = null;
                                                  lastEditingValueRef.current = null;
                                                }
                                              }
                                            }
                                          }
                                        }, 500);
                                        
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
                                      
                                      // Check if we're editing an existing condition (same logic as in onClosed)
                                      const editingInfo = editingConditionRef.current;
                                      const filterBeforeEdit = filterBeforeEditRef.current;
                                      const isEditing = editingInfo && 
                                                        filterBeforeEdit &&
                                                        editingInfo.field === e.dataField && 
                                                        editingInfo.oldValue !== null && 
                                                        editingInfo.oldValue !== undefined &&
                                                        editingInfo.path !== null &&
                                                        Array.isArray(editingInfo.path) &&
                                                        editingInfo.path.length > 0 &&
                                                        oldValue !== null &&
                                                        oldValue !== undefined &&
                                                        editingInfo.oldValue === oldValue;
                                      
                                      const navigateAndReplace = (filter: any, path: number[], newCondition: any): any => {
                                        if (path.length === 0) return newCondition;
                                        if (!Array.isArray(filter)) return filter;
                                        
                                        const result = JSON.parse(JSON.stringify(filter));
                                        
                                        if (path.length === 1) {
                                          const idx = path[0];
                                          if (idx < result.length && Array.isArray(result[idx]) && result[idx].length === 3) {
                                            result[idx] = newCondition;
                                            return result;
                                          }
                                        }
                                        
                                        let current = result;
                                        for (let i = 0; i < path.length - 1; i++) {
                                          const idx = path[i];
                                          if (idx < current.length && Array.isArray(current[idx])) {
                                            current[idx] = [...current[idx]];
                                            current = current[idx];
                                          } else {
                                            return filter;
                                          }
                                        }
                                        
                                        const finalIdx = path[path.length - 1];
                                        if (finalIdx < current.length) {
                                          current[finalIdx] = newCondition;
                                        }
                                        
                                        return result;
                                      };
                                      
                                      const findConditionByValue = (filter: any, field: string, oldValue: any): { condition: any, path: number[] } | null => {
                                        if (!Array.isArray(filter)) return null;
                                        
                                        for (let i = 0; i < filter.length; i++) {
                                          const item = filter[i];
                                          if (Array.isArray(item) && item.length === 3 && item[0] === field && item[2] === oldValue) {
                                            return { condition: item, path: [i] };
                                          }
                                        }
                                        return null;
                                      };
                                      
                                      const replaceOrAddCondition = (filter: any): any => {
                                        if (!Array.isArray(filter) || filter.length === 0) {
                                          return newCondition;
                                        }

                                        if (isEditing === true && editingInfo && editingInfo.path) {
                                          const pathIsValid = editingInfo.path.length === 1 && 
                                                             editingInfo.path[0] < filter.length &&
                                                             Array.isArray(filter[editingInfo.path[0]]) &&
                                                             filter[editingInfo.path[0]].length === 3 &&
                                                             filter[editingInfo.path[0]][0] === editingInfo.field &&
                                                             filter[editingInfo.path[0]][2] === editingInfo.oldValue;
                                          
                                          if (pathIsValid) {
                                            const replaced = navigateAndReplace(filter, editingInfo.path, newCondition);
                                            return replaced;
                                          } else {
                                            if (editingInfo.field !== null) {
                                              const found = findConditionByValue(filter, editingInfo.field, editingInfo.oldValue);
                                              if (found) {
                                                const replaced = navigateAndReplace(filter, found.path, newCondition);
                                                return replaced;
                                              }
                                            }
                                          }
                                        }

                                        if (Array.isArray(filter) && filter.length === 3 && typeof filter[0] === 'string' && typeof filter[1] === 'string') {
                                          if (filter[0] === e.dataField) {
                                            return [filter, 'or', newCondition];
                                          } else {
                                            return [filter, 'and', newCondition];
                                          }
                                        }
                                        
                                        const hasOrOperator = filter.includes('or');
                                        const hasAndOperator = filter.includes('and');
                                        
                                        let foundSameField = false;
                                        let foundConditionIndex = -1;
                                        let foundConditionPath: number[] = [];
                                        
                                        const findConditionWithField = (f: any, path: number[] = []): { found: boolean, index: number, path: number[] } => {
                                          if (!Array.isArray(f)) return { found: false, index: -1, path: [] };
                                          
                                          for (let i = 0; i < f.length; i++) {
                                            const item = f[i];
                                            if (item === 'and' || item === 'or') continue;
                                            
                                            if (Array.isArray(item) && item.length !== 3 && typeof item !== 'string') {
                                              const nested = findConditionWithField(item, [...path, i]);
                                              if (nested.found) {
                                                return nested;
                                              }
                                            }
                                          }
                                          
                                          for (let i = 0; i < f.length; i++) {
                                            const item = f[i];
                                            if (item === 'and' || item === 'or') continue;
                                            
                                            if (Array.isArray(item) && item.length === 3 && typeof item[0] === 'string' && item[0] === e.dataField) {
                                              return { found: true, index: i, path: [...path, i] };
                                            }
                                          }
                                          
                                          return { found: false, index: -1, path: [] };
                                        };
                                        
                                        const fieldSearch = findConditionWithField(filter);
                                        foundSameField = fieldSearch.found;
                                        foundConditionIndex = fieldSearch.index;
                                        foundConditionPath = fieldSearch.path;
                                        
                                        if (foundSameField && foundConditionIndex >= 0) {
                                          const result = JSON.parse(JSON.stringify(filter));

                                          let current = result;
                                          for (let i = 0; i < foundConditionPath.length - 1; i++) {
                                            current = current[foundConditionPath[i]];
                                          }
                                          const conditionIndex = foundConditionPath[foundConditionPath.length - 1];
                                          const condition = current[conditionIndex];
                                          
                                          const parentArray = current;
                                          let isInOrGroup = false;
                                          
                                          for (let i = 0; i < parentArray.length; i++) {
                                            if (parentArray[i] === 'or') {
                                              isInOrGroup = true;
                                              break;
                                            }
                                          }
                                          
                                          if (isInOrGroup) {
                                            parentArray.push('or', newCondition);
                                          } else {
                                            current[conditionIndex] = [condition, 'or', newCondition];
                                          }
                                          
                                          return result;
                                        }
                                        
                                        if (hasOrOperator && !hasAndOperator) {
                                          return [filter, 'and', newCondition];
                                        } else if (hasAndOperator) {
                                          const result = JSON.parse(JSON.stringify(filter));
                                          const lastElement = result[result.length - 1];
                                          
                                          if (Array.isArray(lastElement) && lastElement.length === 3 && typeof lastElement[0] === 'string' && lastElement[0] === e.dataField) {
                                            result[result.length - 1] = [lastElement, 'or', newCondition];
                                            return result;
                                          } else if (Array.isArray(lastElement) && lastElement.length === 3 && typeof lastElement[0] === 'string') {
                                            result[result.length - 1] = [lastElement];
                                            result.push('and', newCondition);
                                          } else {
                                            result.push('and', newCondition);
                                          }
                                          
                                          return result;
                                        } else {
                                          const result = [...filter];
                                          result.push('and', newCondition);
                                          return result;
                                        }
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
                                    
                                    let foundSameField = false;
                                    let targetGroup: any = null;
                                    let targetGroupIndex = -1;
                                    
                                    const findFieldGroup = (f: any, parentIndex: number = -1, path: number[] = []): { found: boolean, group: any, groupIndex: number, path: number[] } => {
                                      if (!Array.isArray(f)) return { found: false, group: null, groupIndex: -1, path: [] };
                                      
                                      for (let i = 0; i < f.length; i++) {
                                        const item = f[i];
                                        if (item === 'and' || item === 'or') continue;
                                        
                                        if (Array.isArray(item) && item.length !== 3 && typeof item !== 'string') {
                                          const nested = findFieldGroup(item, i, [...path, i]);
                                          if (nested.found) {
                                            return nested;
                                          }
                                        }
                                      }
                                      
                                      let hasSameField = false;
                                      let hasOtherFields = false;
                                      let conditionCount = 0;
                                      
                                      for (let i = 0; i < f.length; i++) {
                                        const item = f[i];
                                        if (item === 'and' || item === 'or') continue;
                                        
                                        if (Array.isArray(item) && item.length === 3 && typeof item[0] === 'string') {
                                          conditionCount++;
                                          if (item[0] === e.dataField) {
                                            hasSameField = true;
                                          } else {
                                            hasOtherFields = true;
                                          }
                                        }
                                      }
                                      
                                      if (hasSameField && hasOtherFields) {
                                        return { found: false, group: null, groupIndex: -1, path: [] };
                                      }
                                      
                                      if (hasSameField && !hasOtherFields && conditionCount > 0) {
                                        return { found: true, group: f, groupIndex: parentIndex, path };
                                      }
                                      
                                      return { found: false, group: null, groupIndex: -1, path: [] };
                                    };
                                    
                                    const fieldSearch = findFieldGroup(filter);
                                    foundSameField = fieldSearch.found;
                                    targetGroup = fieldSearch.group;
                                    targetGroupIndex = fieldSearch.groupIndex;
                                    
                                    if (foundSameField && targetGroup) {
                                      const editingInfo = editingConditionRef.current;
                                      const isEditing = editingInfo && 
                                                        editingInfo.field === e.dataField && 
                                                        editingInfo.oldValue !== null && 
                                                        editingInfo.oldValue !== undefined;
                                      
                                      if (isEditing && editingInfo.oldValue) {
                                        const result = JSON.parse(JSON.stringify(filter));
                                        if (targetGroupIndex >= 0) {
                                          const updatedGroup = targetGroup.map((item: any) => {
                                            if (Array.isArray(item) && item.length === 3 && item[0] === e.dataField && item[2] === editingInfo.oldValue) {
                                              return newCondition;
                                            }
                                            return item;
                                          });
                                          result[targetGroupIndex] = updatedGroup;
                                        } else {
                                          const updatedGroup = targetGroup.map((item: any) => {
                                            if (Array.isArray(item) && item.length === 3 && item[0] === e.dataField && item[2] === editingInfo.oldValue) {
                                              return newCondition;
                                            }
                                            return item;
                                          });
                                          return updatedGroup;
                                        }
                                        return result;
                                      } else {
                                        const result = JSON.parse(JSON.stringify(filter));
                                        
                                        if (fieldSearch.path.length > 0) {
                                          let current = result;
                                          for (let i = 0; i < fieldSearch.path.length - 1; i++) {
                                            current = current[fieldSearch.path[i]];
                                          }
                                          const finalIndex = fieldSearch.path[fieldSearch.path.length - 1];
                                          current[finalIndex] = [...targetGroup, 'or', newCondition];
                                        } else if (targetGroupIndex >= 0) {
                                          result[targetGroupIndex] = [...targetGroup, 'or', newCondition];
                                        } else {
                                          result.push('or', newCondition);
                                        }
                                        
                                        return result;
                                      }
                                    }

                                    const hasOrOperator = filter.includes('or');
                                    const hasAndOperator = filter.includes('and');
                                    
                                    if (hasOrOperator && !hasAndOperator) {
                                      const result = [filter, 'and', newCondition];
                                      return result;
                                    }

                                    const result = [...filter, 'and', newCondition];
                                    return result;
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
                    alignItems="center"
                    direction="row"
                  >
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
                    direction="row"
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
