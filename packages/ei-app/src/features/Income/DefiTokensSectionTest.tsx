import { fetchFilters } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
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
import DataSource from "devextreme/data/data_source";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetPoolsQuery } from "./DefiApi";
import { DefiPoolsTable } from "./DefiPoolsTable";
import { PoolData } from "./Models/PoolData";
import { useGetDexsQuery } from "./DexApi";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { FeatureAccessGuard } from "components";
import { exportDataGridToXlsx } from "@/utils/exportDataGrid";
import { filtersApi } from "../../../../components/src/services/filterService";

type OverridesConfig = {
  pools?: PoolData[];
  dexs?: string[];
  loading?: boolean;
  title?: string;
  accordionTitle?: string;
  prefilterControls?: React.ReactNode;
};

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
  startTourButton?: React.ReactNode;
  exportFileName: string;
  overrides?: OverridesConfig;
};

export default function DefiTokensSectionTest({ persisKey, startTourButton, exportFileName, overrides, ...props }: Props) {
  const {
    pools: overridePools,
    dexs: overrideDexs,
    loading: overrideLoading,
    title: overrideTitle,
    accordionTitle: overrideAccordionTitle,
    prefilterControls,
  } = overrides || {};
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPoolsQuery(undefined, { skip: !!overridePools });
  const { data: dexsData, isLoading: isDexsLoading } = useGetDexsQuery(undefined, { skip: !!overrideDexs });
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["LiquidityPoolsPage", "Common"]);
  const theme = useTheme();
  const { sidebarOpened } = useAppSelector(store => store.ui);
  const dataGridRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [chains, setChains] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

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

  const tablePools = useMemo<PoolData[]>(() => {
    if (overridePools) {
      return overridePools;
    }
    return poolsData?.data ?? [];
  }, [overridePools, poolsData]);

  const tableDexs = useMemo<string[]>(() => {
    if (overrideDexs) {
      return overrideDexs;
    }
    return dexsData ?? [];
  }, [overrideDexs, dexsData]);

  const isLoading = useMemo(() => {
    if (typeof overrideLoading === "boolean") {
      return overrideLoading;
    }
    const poolsLoading = overridePools ? false : isPoolsLoading;
    const dexsLoading = overrideDexs ? false : isDexsLoading;
    return poolsLoading && dexsLoading;
  }, [overrideLoading, overridePools, overrideDexs, isPoolsLoading, isDexsLoading]);

  const allTokensSource = useMemo(
    () =>
      new DataSource<PoolData, string>({
        store: {
          type: "array",
          key: "pool",
          data: tablePools,
        },
      }),
    [tablePools],
  );

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
    backgroundColor: "#f7f5f2 !important"
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 0 }}
          id="income_header">
          {overrideTitle ?? t("PageTitleLiquidityPools")}
        </Typography>
        {startTourButton}
      </Box>
      <StatePersistedAccordion
        className="index-modeling-section-container"
        persistKey={persisKey}
        defaultExpanded
        sx={{
          ... (theme.palette.mode === "dark" ? darkThemeStyles : lightThemeStyles),
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
              {overrideAccordionTitle ?? t("PrefilterLiquidityPools")}
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
            <Box sx={{ mb: 3 }}>{prefilterControls}</Box>
          )}
          {loadingFilters ? (
            <div></div>
          ) : (
            <MemoizedDefiPoolsTable
              loading={isLoading}
              dexs={tableDexs}
              onUpdate={() => {}}
              dataSource={allTokensSource}
              dataGridRef={dataGridRef}
              chains={chains}
              categories={categories}
              projects={projects}
              symbols={symbols}
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
    prevProps.chains === nextProps.chains &&
    prevProps.categories === nextProps.categories &&
    prevProps.projects === nextProps.projects &&
    prevProps.symbols === nextProps.symbols
  );
});

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  transition: "none",
  backgroundColor:theme.palette.mode === "dark" ? "#363640" : "#f7f5f2",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  minHeight: "64px",
}));

