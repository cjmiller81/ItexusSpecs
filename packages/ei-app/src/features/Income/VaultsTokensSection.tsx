import React, { useRef, useState } from "react";
import { useAppSelector } from "@/libs/redux/Store";
import { useTranslation } from "react-i18next";
import {
  AccordionDetails,
  AccordionProps,
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
import { PageTitle, StatePersistedAccordion, StyledAccordionSummary } from "components";
import DataSource from "devextreme/data/data_source";
import DownloadIcon from "@mui/icons-material/Download";
import { VaultsPoolsTable } from "./VaultsPoolsTable";
import { useGetAllDataQuery } from "@/features/Income/VaultsApi";
import appAxios from "@/libs/axios/axios";
import { VaultsData } from "./Models/VaultsData";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { FeatureAccessGuard } from "components";
import { exportDataGridToXlsx } from "@/utils/exportDataGrid";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
  startTourButton?: React.ReactNode;
  exportFileName: string;
};

export default function VaultsTokensSection({ persisKey, startTourButton, exportFileName, ...props }: Props) {
  const [isVaultsLoading, setIsVaultsLoading] = useState(false);
  const { t } = useTranslation(["Vaults", "Common"]);
  const { sidebarOpened } = useAppSelector(store => store.ui);
  const theme = useTheme();
  const dataGridRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  const processedVaults = (data: VaultsData[]) => {
    return data.map(pool => {
      const anyPool = pool as any;
      const totalApy = pool.breakdowns?.totalApy ?? null;
      return {
        ...pool,
        apy:
          typeof totalApy === "number"
            ? Number(totalApy.toFixed(2))
            : totalApy,
        tvl: pool.tvls ? pool.tvls?.value : null,
        platformId: pool.platform_id || null,
        isRetired: pool.status === "eol",
        vaultApy:
          anyPool.vault_apy ?? anyPool.breakdowns?.vaultApy ?? null,
        beefyPerformanceFee:
          anyPool.beefy_performance_fee ??
          anyPool.breakdowns?.beefyPerformanceFee ??
          null,
        lpFee: anyPool.lp_fee ?? anyPool.breakdowns?.lpFee ?? null,
        tradingApr:
          anyPool.trading_apr ?? anyPool.breakdowns?.tradingApr ?? null,
        strategyTypeId: anyPool.strategy_type_id ?? null,
        earnedToken: anyPool.earned_token ?? null,
      };
    });
  };

  useGetAllDataQuery({});

  // DataSource instance for DevExtreme (async load, always fresh)
  const filteredTokensSource = React.useMemo(() => {
    const CustomStore = require("devextreme/data/custom_store").default;
    // Helper to recursively remove all 'assets' filters and collect their values
    // Also cleans up redundant logical operators (and/or) left after removal
    function removeAssetsFiltersAndCollectValues(filter: any, assetsParam: string[]): any {
      if (!filter) return filter;
      if (Array.isArray(filter)) {
        // If this is an 'assets' filter
        if (
          filter.length === 3 &&
          (filter[0] === "assets" || (filter[0] && filter[0].dataField === "assets")) &&
          (filter[1] === "contains" || filter[1] === "=" || filter[1] === "anyof")
        ) {
          // Collect value(s) without duplicates
          if (Array.isArray(filter[2])) {
            filter[2].forEach(val => {
              if (!assetsParam.includes(val)) assetsParam.push(val);
            });
          } else if (filter[2]) {
            if (!assetsParam.includes(filter[2])) assetsParam.push(filter[2]);
          }
          return null;
        }
        // Recursively process subfilters
        let processed = filter
          .map(sub => removeAssetsFiltersAndCollectValues(sub, assetsParam))
          .filter(x => x !== null && x !== undefined);

        // Remove leading/trailing and duplicate logical operators
        processed = processed.filter((item, idx, arr) => {
          if (item === 'and' || item === 'or') {
            if (idx === 0 || idx === arr.length - 1) return false;
            if (arr[idx - 1] === 'and' || arr[idx - 1] === 'or') return false;
            if (arr[idx + 1] === 'and' || arr[idx + 1] === 'or') return false;
          }
          return true;
        });

        // If after cleaning only one element remains, return it directly
        if (processed.length === 1) return processed[0];
        if (processed.length === 0) return null;
        return processed;
      }
      return filter;
    }

    // Transform anyof filters (from DevExtreme HeaderFilter) to contains/or format for the backend
    function transformAnyof(filter: any): any {
      if (!filter || !Array.isArray(filter)) return filter;
      if (filter.length === 3 && filter[1] === 'anyof' && Array.isArray(filter[2])) {
        const [field, , values] = filter;
        if (values.length === 0) return null;
        if (values.length === 1) return [field, 'contains', values[0]];
        const result: any[] = [];
        values.forEach((v: any, i: number) => {
          if (i > 0) result.push('or');
          result.push([field, 'contains', v]);
        });
        return result;
      }
      return filter.map((item: any) => Array.isArray(item) ? transformAnyof(item) : item);
    }

    // Helper: filter is meaningful if it contains anything except only logical operators
    function isMeaningfulFilter(f: any): boolean {
      if (!f) return false;
      if (typeof f === 'string') {
        return f !== 'and' && f !== 'or';
      }
      if (Array.isArray(f)) {
        const allLogic = f.every(x => typeof x === 'string' && (x === 'and' || x === 'or'));
        if (allLogic) return false;
        return f.some(x => isMeaningfulFilter(x));
      }
      if (typeof f === 'object' && f !== null) {
        return true;
      }
      return false;
    }

    return new DataSource(
      new CustomStore({
        key: "id",
        load: async (loadOptions: any) => {
          try {
            const params: any = {};
            if (loadOptions.skip != null) params.skip = loadOptions.skip;
            if (loadOptions.take != null) params.take = loadOptions.take;
            if (loadOptions.sort) params.sorter = JSON.stringify(loadOptions.sort);

            let assetsParam: string[] = [];
            let filter = loadOptions.filter;
            if (filter) {
              // Deep clone filter to avoid mutating DevExtreme state
              let filterCopy = Array.isArray(filter) ? JSON.parse(JSON.stringify(filter)) : filter;
              let filterWithoutAssets = removeAssetsFiltersAndCollectValues(filterCopy, assetsParam);
              filterWithoutAssets = transformAnyof(filterWithoutAssets);
              if (isMeaningfulFilter(filterWithoutAssets)) {
                params.filter = JSON.stringify(filterWithoutAssets);
              }
            }
            if (assetsParam.length > 0) {
              params.assets = assetsParam.join(",");
            }

            const response = await appAxios.get("/api/beefy/vaults", { params });
            const result = response.data;
            return {
              data: processedVaults(result.data),
              totalCount: result.totalCount ?? result.data.length,
            };
          } catch (error) {
            console.error("Failed to load vaults data:", error);
            return { data: [], totalCount: 0 };
          }
        },
      })
    );
  }, []);

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
      console.error("Failed to export vaults data:", error);
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
          {t("VaultsPageTitle")}
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
              arrow>
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
            "&.MuiAccordionSummary-root:hover": {
              cursor: "default",
            },
          }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              pointerEvents: "auto !important",
              cursor: "default",
            }}>
            <PageTitle
              sx={{ width: "100%" }}
              onClick={e => e.stopPropagation()}>
              {t("VaultsTitle")}
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
                disabled={isExporting}>
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
            bgcolor: theme.palette.mode === "dark" ? "#363640" : "#f7f5f2",
            width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
            transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            pointerEvents: "auto",
          }}>
          <MemoizedDefiPoolsTable
            loading={isVaultsLoading}
            onUpdate={() => {}}
            dataSource={filteredTokensSource}
            dataGridRef={dataGridRef}
          />
        </AccordionDetails>
      </StatePersistedAccordion>
    </>
  );
}

const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource;
});
