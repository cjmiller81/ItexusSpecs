/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";
import { CreateFilterModel } from "@/libs/redux/Slices/AllTokensTableSlice";
import { isDeepEqual } from "@/utils/utils";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  Popover,
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
import { LIQUIDITY_POOL, PREFILTER_TAB_KEYS, PREFILTER_ALL_CATEGORIES_MAP, PREFILTER_CATEGORIES_MAP } from "@/constants/prefilterKeys";
import { generateFilterKey } from "@/helpers/LiquidPoolsFilterFormatter";
import { PrefilterTabs, PrefilterCategories } from "@/types/filter";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { MainTab, MAIN_TABS } from "@/components/CategoryFiltersSection";
import { reactourService } from "../../../../../components/src/services/reactourService";

const FILTER_BUILDER_TOUR_ID = "filter_builder_v1";
const FILTER_BUILDER_TOUR_VIEWED_KEY = "EI_TOUR_filter_builder_v1_VIEWED";

const TourManager = () => {
  const { isOpen, currentStep } = useTour();

  useEffect(() => {
    if (isOpen) {
      reactourService.updateTourStatus(FILTER_BUILDER_TOUR_VIEWED_KEY, { viewed: true });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentStep >= 0) {
      // Optionally, persist current step to backend if needed
      // reactourService.updateTourStatus(FILTER_BUILDER_TOUR_ID, { step: currentStep });
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
    } else {
      setIsOpen(false);
    }
  }, [isTourOpen, setIsOpen]);

  useEffect(() => {
    if (isTourOpen && currentStep >= 0) {
      reactourService.updateTourStatus(FILTER_BUILDER_TOUR_VIEWED_KEY, { viewed: true });
      // Optionally, persist current step
      // reactourService.updateTourStatus(FILTER_BUILDER_TOUR_ID, { step: currentStep });
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
  const [loadingTourViewed, setLoadingTourViewed] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (isModalOpen) {
      setLoadingTourViewed(true);
      reactourService.getReactourSettings().then(settings => {
        const viewed = settings?.tours?.[FILTER_BUILDER_TOUR_VIEWED_KEY] === 1;
        if (mounted) {
          setIsTourOpen(!viewed);
          setLoadingTourViewed(false);
        }
      }).catch(() => {
        if (mounted) {
          setIsTourOpen(false);
          setLoadingTourViewed(false);
        }
      });
    } else {
      setIsTourOpen(false);
    }
    return () => { mounted = false; };
  }, [isModalOpen]);

  const handleStartTour = () => {
    setIsTourOpen(currentValue => {
      if (currentValue) {
        return true;
      } else {
        reactourService.updateTourStatus(FILTER_BUILDER_TOUR_VIEWED_KEY, { viewed: true });
        return true;
      }
    });
  };

  useEffect(() => {
    onStartTourRef.current = handleStartTour;
  });

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

  if (typeof window === 'undefined' || !isModalOpen || loadingTourViewed) {
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
  onTreeViewFilterChange?: (filter: any, filterContext: { tab?: MainTab; category?: string }) => void;
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
  onFilterBuilderOpenChange,
  onTreeViewFilterChange
}, ref) => {

  const handleTreeViewChange = (filter: any, filterContext: { tab?: string; category?: string }) => {
    const { tab, category } = filterContext;

    let mainTab = tab as MainTab;
    if (!mainTab) {
      mainTab = MAIN_TABS[0];
    }

    if (onTreeViewFilterChange) {
      onTreeViewFilterChange(filter, { tab: mainTab, category });
    }
  };

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
    console.log("Predefined Filters:", predefinedFilters);
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

  // State for filter tree popover
  const [filterTreeAnchorEl, setFilterTreeAnchorEl] = useState<null | HTMLElement>(null);
  const isFilterTreeOpen = Boolean(filterTreeAnchorEl);

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

  const findAllConditionsByValue = useCallback((filter: any, field: string, oldValue: any, path: number[] = []): Array<{ condition: any, path: number[] }> => {
    const results: Array<{ condition: any, path: number[] }> = [];
    if (!Array.isArray(filter)) return results;

    if (filter.length === 2 && filter[0] === '!' && Array.isArray(filter[1])) {
      const nested = findAllConditionsByValue(filter[1], field, oldValue, [...path, 1]);
      results.push(...nested);
      return results;
    }

    for (let i = 0; i < filter.length; i++) {
      const item = filter[i];
      if (Array.isArray(item)) {
        if (item.length === 3 && typeof item[0] === 'string' && item[0] === field && item[2] === oldValue) {
          results.push({ condition: item, path: [...path, i] });
        } else {
          const nested = findAllConditionsByValue(item, field, oldValue, [...path, i]);
          results.push(...nested);
        }
      }
    }
    return results;
  }, []);

  const findConditionByValue = useCallback((filter: any, field: string, oldValue: any): { condition: any, path: number[] } | null => {
    const all = findAllConditionsByValue(filter, field, oldValue);
    return all.length > 0 ? all[0] : null;
  }, [findAllConditionsByValue]);

  const navigateAndReplace = useCallback((filter: any, path: number[], newCondition: any): any => {
    if (path.length === 0) return newCondition;
    if (!Array.isArray(filter)) return filter;

    const result = JSON.parse(JSON.stringify(filter));
    let current = result;
    for (let i = 0; i < path.length - 1; i++) {
      const idx = path[i];
      if (!Array.isArray(current) || idx >= current.length) return filter;
      current[idx] = JSON.parse(JSON.stringify(current[idx]));
      current = current[idx];
    }
    const finalIdx = path[path.length - 1];
    if (!Array.isArray(current) || finalIdx >= current.length) return filter;
    current[finalIdx] = newCondition;
    return result;
  }, []);

  const replaceOrAddCondition = useCallback((
    currentFilter: any,
    dataField: string,
    newCondition: any,
    editingInfo: { field: string | null; oldValue: any; path: number[] | null } | null,
    oldValue: any
  ): any => {
    if (!currentFilter || !Array.isArray(currentFilter) || currentFilter.length === 0) {
      return newCondition;
    }

    if (editingInfo && editingInfo.field === dataField && editingInfo.oldValue !== null && editingInfo.oldValue !== undefined) {
      const matches = findAllConditionsByValue(currentFilter, dataField, editingInfo.oldValue);
      if (matches.length > 0) {
        let targetPath: number[] | null = null;
        if (editingInfo.path && Array.isArray(editingInfo.path)) {
          const exactMatch = matches.find(m => JSON.stringify(m.path) === JSON.stringify(editingInfo.path));
          if (exactMatch) targetPath = exactMatch.path;
        }
        if (!targetPath) {
          targetPath = matches[0].path;
        }
        return navigateAndReplace(currentFilter, targetPath, newCondition);
      }
    }

    const isNegated = currentFilter.length === 2 && currentFilter[0] === '!' && Array.isArray(currentFilter[1]);
    if (isNegated) {
      const innerFilter = currentFilter[1];
      const updatedInner = replaceOrAddCondition(innerFilter, dataField, newCondition, null, oldValue);
      return ['!', updatedInner];
    }

    if (currentFilter.length === 3 && typeof currentFilter[0] === 'string' && typeof currentFilter[1] === 'string') {
      return [currentFilter, 'and', newCondition];
    }

    const operators = currentFilter.filter((item: any) => item === 'and' || item === 'or');
    
    if (operators.length === 0) {
      return [...currentFilter, 'and', newCondition];
    }

    const lastOperator = operators[operators.length - 1];
    return [...currentFilter, lastOperator, newCondition];
  }, [findAllConditionsByValue, navigateAndReplace]);

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
    if (justSavedFilterRef.current) {
      justSavedFilterRef.current = false;
      return;
    }

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
      if (!selectedSavedFilter && !filterName) {
        setSelectedSavedFilter(null);
        setFilterName("");
      }
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
  
  // Filter tree popover handlers
  const handleFilterTreeOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterTreeAnchorEl(event.currentTarget);
  };

  const handleFilterTreeClose = () => {
    setFilterTreeAnchorEl(null);
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

  const justSavedFilterRef = useRef(false);

  const handleSaveFilter = () => {
    if (!filterName) return;

    justSavedFilterRef.current = true;

    if (selectedSavedFilter) {
      const updatedFilter: IPrefilterTokensFilterValues = {
        ...selectedSavedFilter,
        name: filterName,
        filterType: customFilterType ?? filterType,
        description: filterName,
        filter: filterValue || [],
      };
      
      onUpdateFilter(updatedFilter);
      setSelectedSavedFilter(updatedFilter);
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
      setFilterName("");
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

  const generateTopLevelKeys = (): Record<string, string> => {
    const filterTypes: FilterType[] = ["market-cap", "market-cap-equal", "liquidity-pool", "vaults"];
    const topLevelKeys: Record<string, string> = {};

    filterTypes.forEach(type => {
      if (type) {
        if (type === "liquidity-pool") {
          topLevelKeys[type] = "All Defi";
        } else {
          const formattedName = type
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          topLevelKeys[type] = formattedName;
        }
      }
    });

    return topLevelKeys;
  };

  const topLevelKeys = generateTopLevelKeys();

  const buildFilterTree = (filters: IPrefilterTokensFilterValues[]) => {
    const tree: Record<string, any> = {};

    filters.forEach(filter => {
      const rawFilterType = filter.filterType || '';
      let topLevelKey = Object.keys(topLevelKeys).find(key => rawFilterType === key);
      if (!topLevelKey) {
        topLevelKey = Object.keys(topLevelKeys).find(key => rawFilterType.startsWith(key));
      }

      if (!topLevelKey) {
        console.error(`Unknown top-level filter type: ${rawFilterType}`);
        return;
      }

      let childFilterType = rawFilterType.replace(`${topLevelKey}`, '');
      
      if (childFilterType) {
        childFilterType = childFilterType.startsWith('-') ? childFilterType.slice(1) : childFilterType;
        if (topLevelKey === LIQUIDITY_POOL) {
          childFilterType = childFilterType.startsWith('all-') ? childFilterType.slice(4) : childFilterType;
          const tabName = Object.entries(PREFILTER_TAB_KEYS).find(([, value]) => childFilterType.startsWith(value))?.[0];
          const tabKey = Object.entries(PREFILTER_TAB_KEYS).find(([, value]) => childFilterType.startsWith(value))?.[1];

          if (tabName) {
            const tabNodeId = `${topLevelKey}-${tabName}`;
            
            if (!tree[tabNodeId]) {
              tree[tabNodeId] = {
                name: tabName,
                tabName: tabName,
                children: [],
                nodeId: tabNodeId,
                isTab: true
              };
            }

            if (typeof tabKey === 'string' && tabKey.length > 0) {
              childFilterType = childFilterType.replace(tabKey, '');
              childFilterType = childFilterType.startsWith('-') ? childFilterType.slice(1) : childFilterType;

              if (childFilterType) {
                const formattedTabKey = childFilterType.toUpperCase().replace(/-/g, "_");
                const categoryName = PrefilterCategories[formattedTabKey as keyof typeof PrefilterCategories];

                if (categoryName) {
                  let categoryNode = tree[tabNodeId].children.find((child: any) => child.name === categoryName);
                  
                  if (!categoryNode) {
                    categoryNode = {
                      name: categoryName,
                      categoryName: categoryName,
                      tabName: tabName,
                      children: [],
                      nodeId: `${tabNodeId}-${categoryName}`
                    };
                    tree[tabNodeId].children.push(categoryNode);
                  }

                  categoryNode.children.push({
                    id: filter.id,
                    name: filter.name,
                    filterValue: filter.filter,
                    isPublic: filter.isPublic,
                    filterObject: filter,
                    nodeId: filter.id,
                    categoryName: categoryName,
                    tabName: tabName,
                    hasChildren: false
                  });
                }
              } else {
                tree[tabNodeId].children.push({
                  id: filter.id,
                  name: filter.name,
                  filterValue: filter.filter,
                  isPublic: filter.isPublic,
                  filterObject: filter,
                  nodeId: filter.id,
                  tabName: tabName,
                  hasChildren: false
                });
              }
            } else {
              tree[tabNodeId].children.push({
                id: filter.id,
                name: filter.name,
                filterValue: filter.filter,
                isPublic: filter.isPublic,
                filterObject: filter,
                nodeId: filter.id,
                tabName: tabName,
                hasChildren: false
              });
            }
          }
        }
      } else {
        if (!tree[topLevelKey]) {
          tree[topLevelKey] = { 
            name: topLevelKeys[topLevelKey], 
            children: [],
            nodeId: topLevelKey
          };
          
          if (topLevelKey === LIQUIDITY_POOL) {
            const samplesHeader = {
              name: "Samples",
              children: [],
              nodeId: `${topLevelKey}-samples`
            };
            
            const customHeader = {
              name: "Custom", 
              children: [],
              nodeId: `${topLevelKey}-custom`
            };
            
            tree[topLevelKey].children.push(samplesHeader, customHeader);
          }
        }
        
        const targetHeaderName = filter.isPublic ? "Samples" : "Custom";
        const targetHeader = topLevelKey === LIQUIDITY_POOL ? tree[topLevelKey].children.find(
            (child: any) => child.name === targetHeaderName
          ) : tree[topLevelKey];

        if (targetHeader) {
          targetHeader.children.push({
            id: filter.id,
            name: filter.name,
            filterValue: filter.filter,
            isPublic: filter.isPublic,
            filterObject: filter,
            nodeId: filter.id,
            hasChildren: false
          });
        }
      }
    });

    return tree;
  };

  const filterTree = useMemo(() => {
    const tree = buildFilterTree(predefinedFilters);
    console.log("Filter Tree:", tree);
    return tree;
  }, [predefinedFilters]);

  const renderTreeNodes = (nodes: any[], parentNodeId: string = "") => {
    if (!nodes || !Array.isArray(nodes)) return null;

    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      
      if (hasChildren) {
        return (
          <TreeItem
            key={node.nodeId}
            nodeId={node.nodeId}
            label={
              <Typography 
                sx={{ 
                  fontSize: '0.875rem',
                  color: 'rgba(0, 0, 0, 0.87)',
                  fontWeight: 500,
                }}
              >
                {node.name}
              </Typography>
            }
            sx={{
              "& .MuiTreeItem-content": {
                backgroundColor: 'transparent',
                padding: '6px 8px',
                "&:hover": {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              },
              "& .MuiTreeItem-label": {
                padding: 0,
                margin: 0,
              },
            }}
          >
            {renderTreeNodes(node.children, node.nodeId)}
          </TreeItem>
        );
      } else {
        return (
          <TreeItem
            key={node.id}
            nodeId={node.id}
            label={
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography 
                  sx={{ 
                    flex: 1,
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                  {node.name}
                </Typography>
                {!node.isPublic && (
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteFilter(node.filterObject, event);
                    }}
                    sx={{
                      padding: '4px',
                      marginRight: '-8px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <CustomDeleteIcon />
                  </IconButton>
                )}
              </Box>
            }
            onClick={() => {
              if (node.filterObject.filterType !== "liquidity-pool") {
                handleFilterSelect(node.filterObject);
              }
              handleFilterTreeClose();
            }}
            sx={{
              "& .MuiTreeItem-content": {
                backgroundColor: 'transparent',
                padding: '6px 8px',
                "&:hover": {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                "&.Mui-selected": {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  "&:hover": {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  },
                },
              },
              "& .MuiTreeItem-label": {
                padding: 0,
                margin: 0,
                width: '100%',
              },
            }}
          />
        );
      }
    });
  };

  const handleFilterSelect = (filter: IPrefilterTokensFilterValues) => {
    setSelectedSavedFilter(filter);
    setFilterValue(filter.filter);
    setFilterName(filter.name);
    onApply(filter.filter);

    const filterContext = determineFilterContext(filter.filterType);
    if (onTreeViewFilterChange) {
      onTreeViewFilterChange(filter.filter, filterContext);
    }
  };

  const determineFilterContext = (filterType?: string | null): { tab?: MainTab; category?: string } => {
    if (!filterType) {
      return {};
    }
    const parts = filterType.split("-");
    if (parts.length === 1 && MAIN_TABS.includes(parts[0] as MainTab)) {
      return { tab: parts[0] as MainTab };
    } else if (parts.length === 2 && MAIN_TABS.includes(parts[0] as MainTab)) {
      return { tab: parts[0] as MainTab, category: `All ${parts[1]}` };
    } else if (parts.length === 3 && MAIN_TABS.includes(parts[0] as MainTab)) {
      return { tab: parts[0] as MainTab, category: parts[2] };
    }
    return {};
  };

  const rootNodes = useMemo(() => {
    return Object.values(filterTree).sort((a: any, b: any) => (a?.name ?? "").localeCompare(b?.name ?? ""));
  }, [filterTree]);

  const defaultExpandedNodes = useMemo(() => {
    //return rootNodes.map(node => node.nodeId);
    return [];
  }, [rootNodes]);

  const findNodeById = (tree: any, nodeId: string): any => {
    const findNode = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.nodeId === nodeId) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    return findNode(Object.values(tree));
  };

  return (
    <>
      <TourPortal tourSteps={tourSteps} isModalOpen={filterBuilderOpen} onStartTourRef={startTourRef} />
      <StyledAdaptivePageBox sx={{ width: "100%" }}>
        {/* Filter Tree with Popover */}
        <Box sx={{ position: "relative", display: 'inline-block', mr: 1 }}>
          <Button
            onClick={handleFilterTreeOpen}
            sx={{
              minWidth: 250,
              maxWidth: 250,
              height: 32,
              backgroundColor: "#219a83",
              color: theme.palette.mode === "dark" ? "#363640" : "white",
              fontWeight: 600,
              textAlign: "center",
              border: "1px solid #219a83",
              borderRadius: "4px",
              padding: "4px 8px",
              "@media (max-width: 1030px) and (min-width: 900px)": {
                width: "210px",
                minWidth: 200,
              },
              "@media (max-width: 900px)": {
                mt: 1,
              },
              "&:hover": {
                backgroundColor: "#1c8d74",
              },
            }}
          >
            {mapButtonFilterName(selectedSavedFilter?.name, selectedSavedFilter?.isPublic)}
            {isFilterTreeOpen ? <ExpandLessIcon sx={{ ml: 1 }} /> : <ExpandMoreIcon sx={{ ml: 1 }} />}
          </Button>
          
          <Popover
            open={isFilterTreeOpen}
            anchorEl={filterTreeAnchorEl}
            onClose={handleFilterTreeClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                maxHeight: 400,
                overflowY: 'auto',
                minWidth: 250,
                backgroundColor: "#f7f5f2",
                color: "rgba(0, 0, 0, 0.87)",
                mt: 0.5,
                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
              }
            }}
          >
            <TreeView
              defaultExpanded={defaultExpandedNodes}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              onNodeSelect={(event, nodeId) => {
                const node = findNodeById(filterTree, nodeId);
                if (node && (!node.children || node.children.length === 0)) {
                  handleTreeViewChange(node.filterObject, { tab: node.tabName, category: node.categoryName });
                }
              }}
              sx={{
                padding: '8px 0',
                "& .MuiTreeItem-root": {
                  "& .MuiTreeItem-content": {
                    minHeight: '36px',
                  },
                },
              }}
            >
              {renderTreeNodes(rootNodes)}
            </TreeView>
          </Popover>
        </Box>
        
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
                                      const updatedFilter = replaceOrAddCondition(
                                        currentFilter,
                                        e.dataField,
                                        newCondition,
                                        editingConditionRef.current,
                                        e.value
                                      );
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
                                          if (lastEditingValueRef.current) {
                                            const stored = lastEditingValueRef.current;
                                            if (filterBuilderRef.current?.instance) {
                                              const fbInstance = filterBuilderRef.current.instance;
                                              let currentFilter = fbInstance.option('value') || [];
                                              const newCondition = [stored.dataField, stored.filterOperation || 'contains', stored.value];
                                              const updatedFilter = replaceOrAddCondition(
                                                currentFilter,
                                                stored.dataField,
                                                newCondition,
                                                editingConditionRef.current,
                                                e.value
                                              );
                                              fbInstance.option('value', updatedFilter);
                                              setFilterValue(updatedFilter);

                                              editingConditionRef.current = null;
                                              filterBeforeEditRef.current = null;
                                              lastEditingValueRef.current = null;
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
                                        if (!filterBuilderRef.current?.instance) return;
                                        const fbInstance = filterBuilderRef.current.instance;
                                        let currentFilter = fbInstance.option("value") || [];
                                        const newCondition = [e.dataField, e.filterOperation || "contains", args.value];
                                        const updatedFilter = replaceOrAddCondition(
                                          currentFilter,
                                          e.dataField,
                                          newCondition,
                                          editingConditionRef.current,
                                          e.value
                                        );
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
                                  const updatedFilter = replaceOrAddCondition(
                                    currentFilter,
                                    e.dataField,
                                    newCondition,
                                    editingConditionRef.current,
                                    e.value
                                  );
                                  fbInstance.option('value', updatedFilter);
                                  setFilterValue(updatedFilter);
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