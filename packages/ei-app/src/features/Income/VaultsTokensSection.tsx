import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/libs/redux/Store";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { VaultsData } from "./Models/VaultsData";
import { useGetAllDataQuery } from "@/features/Income/VaultsApi";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { FeatureAccessGuard } from "components";
import { exportDataGridToXlsx } from "@/utils/exportDataGrid";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
  startTourButton?: React.ReactNode;
  exportFileName: string;
};

export default function VaultsTokensSection({ persisKey, startTourButton, exportFileName, ...props }: Props) {
  const [vaults, setVaults] = useState<VaultsData[]>([]);
  const { data: vaultsData, isLoading: isVaultsLoading } = useGetAllDataQuery();
  const { t } = useTranslation(["Vaults", "Common"]);
  const { sidebarOpened } = useAppSelector(store => store.ui);
  const theme = useTheme();
  const dataGridRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isVaultsLoading && vaultsData) {
      setVaults(vaultsData.data);
    }
  }, [vaultsData, isVaultsLoading]);

  const processedVaults = useMemo(() => {
    return vaults.map(pool => ({
      ...pool,
            apy: pool.breakdowns && pool.breakdowns.totalApy != null && pool.breakdowns.totalApy !== "Infinity" ?
        (typeof pool.breakdowns.totalApy === 'number' ? pool.breakdowns.totalApy.toFixed(2) : pool.breakdowns.totalApy) : null,
      tvl: pool.tvls ? pool.tvls?.value : null,
      platformId: pool.platform_id || null,
      isRetired: pool.status === "eol",
    }));
  }, [vaults]);

  const filteredTokensSource = useMemo(
    () =>
      new DataSource<VaultsData, string>({
        store: {
          type: "array",
          key: "id",
          data: processedVaults,
        },
        paginate: true,
        pageSize: 10,
      }),
    [processedVaults],
  );
  const calculateSafetyScore = (risks: string[]) => {
    if (!risks || risks.length === 0) return 0;

    let score = 3;

    if (risks.includes("IL_HIGH")) score -= 1;
    if (risks.includes("MCAP_MICRO")) score -= 1;

    return Math.max(score, 0);
  };

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
