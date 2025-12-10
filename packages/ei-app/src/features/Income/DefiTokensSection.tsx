import { fetchFilters } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import appAxios from "@/libs/axios/axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useTheme,
} from "@mui/material";
import { PageTitle, StatePersistedAccordion } from "components";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useCallback, useEffect, useMemo, useRef, useState, isValidElement, cloneElement } from "react";
import { useTranslation } from "react-i18next";
import { DefiPoolsTable } from "./DefiPoolsTable";
import { PoolData } from "./Models/PoolData";
import { useGetDexsQuery } from "./DexApi";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { FeatureAccessGuard } from "components";
import { exportDataGridToXlsx } from "@/utils/exportDataGrid";
import { filtersApi } from "../../../../components/src/services/filterService";
import { CategoryFiltersSectionRef } from "@/components/CategoryFiltersSection";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
  startTourButton?: React.ReactNode;
  exportFileName: string;
  prefilterControls?: React.ReactNode;
};

const transformFilter = (filter: any): any => {
  if (!filter || !Array.isArray(filter)) {
    return filter;
  }

  if (filter.length === 3 && filter[1] === "between" && Array.isArray(filter[2])) {
    const [field, , values] = filter;
    const [minValue, maxValue] = values;

    return [[field, ">=", minValue], "and", [field, "<=", maxValue]];
  }

  return filter.map((item: any) => (Array.isArray(item) ? transformFilter(item) : item));
};

export default function DefiTokensSection({ persisKey, startTourButton, exportFileName, prefilterControls, ...props }: Props) {
  const { data: dexsData, isLoading: isDexsLoading } = useGetDexsQuery();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["LiquidityPoolsPage", "Common"]);
  const theme = useTheme();
  const { sidebarOpened } = useAppSelector(store => store.ui);
  const dataGridRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const [externalFilter, setExternalFilter] = useState<object[] | null | undefined>();
  const [chains, setChains] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const categoryFiltersSectionRef = useRef<CategoryFiltersSectionRef>(null);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chainsData, categoriesData, projectsData, symbolsData] = await Promise.all([
          filtersApi.getPoolChains(),
          filtersApi.getPoolCategories(),
          filtersApi.getPoolProjects(),
          filtersApi.getPoolSymbols(),
        ]);

        setChains(chainsData);
        setCategories(categoriesData);
        setProjects(projectsData);
        setSymbols(symbolsData);
      } catch (error) {
        console.error("Failed to load chains, categories, projects and symbols:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchData();
  }, []);

  const poolsDataSource = useMemo(() => {
    const store = new CustomStore<PoolData, string>({
      key: "pool",
      load: async loadOptions => {
        try {
          const {
            skip = 0,
            take = 20,
            sort,
            filter,
          } = loadOptions ?? {};

          const normalizeSort = (value: unknown): Array<{ selector: string; desc: boolean }> | undefined => {
            if (!value) return undefined;
            if (Array.isArray(value)) {
              const normalized = value
                .map(item => {
                  if (!item) return undefined;
                  if (typeof item === "string") {
                    return { selector: item, desc: false };
                  }
                  const anyItem = item as any;
                  if (typeof anyItem.selector === "string") {
                    return { selector: anyItem.selector, desc: !!anyItem.desc };
                  }
                  if (typeof anyItem.field === "string") {
                    return { selector: anyItem.field, desc: !!anyItem.desc };
                  }
                  return undefined;
                })
                .filter((itm): itm is { selector: string; desc: boolean } => Boolean(itm));
              return normalized.length > 0 ? normalized : undefined;
            }
            if (typeof value === "string") {
              return [{ selector: value, desc: false }];
            }
            const anyValue = value as any;
            if (anyValue && typeof anyValue.selector === "string") {
              return [{ selector: anyValue.selector, desc: !!anyValue.desc }];
            }
            return undefined;
          };

          const sortArray = normalizeSort(sort) ?? [{ selector: "tvlUsd", desc: true }];
          const sorter = JSON.stringify(sortArray);

          let filterParam = "[]";
          if (filter) {
            try {
              const transformed = transformFilter(filter);
              filterParam = JSON.stringify(transformed ?? []);
            } catch (error) {
              filterParam = "[]";
            }
          }

          const response = await appAxios.get("/api/defi/pools", {
            params: {
              sorter,
              filter: filterParam,
              skip,
              take,
            },
            withCredentials: true,
          });

          const rawData = response.data ?? {};
          const data: PoolData[] = rawData?.data ?? [];
          const totalCount: number = rawData?.totalCount ?? data.length ?? 0;

          return {
            data,
            totalCount,
          };
        } catch (error: any) {
          if (error?.response?.status === 404) {
            return {
              data: [],
              totalCount: 0,
            };
          }

          console.error("Failed to load pools", error);
          throw error;
        }
      },
    });

    return new DataSource<PoolData, string>({
      store,
      paginate: true,
      pageSize: 20,
    });
  }, []);

  const [isGridLoading, setIsGridLoading] = useState<boolean>(true);

  useEffect(() => {
    const handler = (isLoading: boolean) => {
      setIsGridLoading(isLoading);
    };

    poolsDataSource.on("loadingChanged", handler);
    setIsGridLoading(poolsDataSource.isLoading());

    return () => {
      poolsDataSource.off("loadingChanged", handler);
    };
  }, [poolsDataSource]);

 const onExport = async () => {
    if (isExporting) {
      return;
    }

    const dataGridInstance = dataGridRef.current?.instance;
    if (!dataGridInstance) {
      console.error("DataGrid instance is not ready for export.");
      return;
    }

    setIsExporting(true);
    try {
      await exportDataGridToXlsx({
        dataGrid: dataGridInstance,
        fileBaseName: exportFileName,
        worksheetName: exportFileName,
      });
    } catch (error) {
      console.error("Failed to export liquidity pools data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip
      {...props}
      arrow
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
      color: "white",
    },
  }));

  const darkThemeStyles = {
    cursor: "default !important",
    pointerEvents: "none",
    position: "inherit",
    borderRadius: "10px",
    boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#363640",
    border: "1px solid #25252AFF",
  };

  const lightThemeStyles = {
    cursor: "default !important",
    pointerEvents: "none",
    position: "inherit",
    boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    backgroundColor: "#f7f5f2 !important",
  };

  const handleFilterValueChange = useCallback(
    (filter: object[] | null | undefined) => {
      setCurrentFilter(filter);
    },
    [],
  );

  const handleCategoryFilterChange = useCallback(
    (filter: any[] | null) => {
      setExternalFilter(filter || null);
    },
    [],
  );

  const handleClearCategoryFilter = useCallback(() => {
    categoryFiltersSectionRef.current?.clearFilter();
    setExternalFilter(null);
  }, []);

  const handleFilterBuilderOpenChange = useCallback((isOpen: boolean) => {
    if (isOpen) {
      categoryFiltersSectionRef.current?.clearTooltips();
    }
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0 }}>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 0 }}
          id="income_header">
          {t("PageTitleLiquidityPools")}
        </Typography>
        {startTourButton}
      </Box>
      <StatePersistedAccordion
        className="index-modeling-section-container"
        persistKey={persisKey}
        defaultExpanded
        sx={{
          ...(theme.palette.mode === "dark" ? darkThemeStyles : lightThemeStyles),
          borderRadius: "10px",
          overflow: "hidden",
          "&.Mui-expanded": {
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          },
          "&:not(.Mui-expanded)": {
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          },
        }}
        {...props}
      >
        <StyledAccordionSummary
          expandIcon={
            <CustomTooltip
              title={t("ToggleView", { ns: "Common" })}
              arrow
            >
              <IconButton sx={{ cursor: "pointer", pointerEvents: "auto", transform: "rotate(-90deg)" }}>
                <ArrowBackIosNewOutlinedIcon
                  sx={{
                    "& path": {
                      stroke: "currentColor",
                      strokeWidth: 2,
                      fill: "currentColor",
                    },
                  }}
                />
              </IconButton>
            </CustomTooltip>
          }
          sx={{
            borderBottom: "none",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            "&.Mui-expanded": {
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
            "&.MuiAccordionSummary-root:hover": {},
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              pointerEvents: "auto !important",
              cursor: "default",
            }}
          >
            <PageTitle
              sx={{ width: "100%" }}
              onClick={e => e.stopPropagation()}>
              {t("PrefilterLiquidityPools")}
            </PageTitle>
            <FeatureAccessGuard feature="tableExport">
              <Button
                onClick={e => {
                  e.stopPropagation();
                  void onExport();
                }}
                variant="outlined"
                sx={{ ml: 4, marginRight: "17px" }}
                id="income_export"
                disabled={isExporting}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <DownloadIcon />
                  {t("Export")}
                </Box>
              </Button>
            </FeatureAccessGuard>
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#363640" : "#f7f5f2 !important",
            width: sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)",
            transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            pointerEvents: "auto",
          }}
        >
          {prefilterControls && (
            <Box sx={{ mb: 3 }}>
              {isValidElement(prefilterControls)
                ? cloneElement(prefilterControls as React.ReactElement<any>, {
                    onFilterChange: handleCategoryFilterChange,
                    ref: categoryFiltersSectionRef,
                  })
                : prefilterControls}
            </Box>
          )}
          {loadingFilters ? (
            <div></div>
          ) : (
            <MemoizedDefiPoolsTable
              loading={isGridLoading}
              dexs={dexsData || []}
              onUpdate={() => {}}
              dataSource={poolsDataSource}
              onFilterValueChange={handleFilterValueChange}
              dataGridRef={dataGridRef}
              chains={chains}
              categories={categories}
              projects={projects}
              symbols={symbols}
              externalFilter={externalFilter}
              onClearCategoryFilter={handleClearCategoryFilter}
              onFilterBuilderOpenChange={handleFilterBuilderOpenChange}
            />
          )}
        </AccordionDetails>
      </StatePersistedAccordion>
    </>
  );
}

const MemoizedDefiPoolsTable = React.memo(DefiPoolsTable, (prevProps, nextProps) => {
  return (
    prevProps.dataSource === nextProps.dataSource &&
    prevProps.dataGridRef === nextProps.dataGridRef &&
    prevProps.chains === nextProps.chains &&
    prevProps.categories === nextProps.categories &&
    prevProps.projects === nextProps.projects &&
    prevProps.symbols === nextProps.symbols &&
    prevProps.externalFilter === nextProps.externalFilter &&
    prevProps.onFilterBuilderOpenChange === nextProps.onFilterBuilderOpenChange
  );
});

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  transition: "none",
  backgroundColor:theme.palette.mode === "dark" ? "#363640" : "#f7f5f2",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  minHeight: "64px",
}));
