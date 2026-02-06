import { useAppSelector } from "@/libs/redux/Store";
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
} from "@mui/material";
import { ICategory, IExchange, IPlatform, PageTitle, StatePersistedAccordion } from "components";
import DataSource from "devextreme/data/data_source";
import DownloadIcon from "@mui/icons-material/Download";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledAccordionSummary } from "./IndexModelingSection";
import { PrefilterTokensTable } from "./PrefilterTokensTable";
import { filtersApi } from "../../../../components/src/services/filterService";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { FeatureAccessGuard } from "components";
import { exportDataGridToXlsx } from "@/utils/exportDataGrid";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
  dataSource: DataSource;
  onFilterChanged: (filter: any) => void;
  onSorterChanged: (sorter: any) => void;
  id?: string;
  filterType?: string;
  exportFileName: string;
};

export default function PrefilterTokensSection({
  onSorterChanged,
  onFilterChanged,
  dataSource,
  persisKey,
  id,
  filterType = "market-cap",
  exportFileName,
  ...props
}: Props) {
  const { t } = useTranslation(["PrefilterTokensSection", "Common"]);

  const { sidebarOpened } = useAppSelector(store => store.ui);
  const theme = useTheme();
  const [chains, setChains] = useState<IPlatform[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [exchanges, setExchanges] = useState<IExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const dataGridRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chainsData, categoriesData, exchangesData] = await Promise.all([
          filtersApi.getChains(),
          filtersApi.getCategories(),
          filtersApi.getExchanges(),
        ]);

        setChains(chainsData);
        setCategories(categoriesData);
        setExchanges(exchangesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    backgroundColor: "#f7f5f2"
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
      console.error("Failed to export Prefilter tokens data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <StatePersistedAccordion
      className="index-modeling-section-container"
      persistKey={persisKey}
      defaultExpanded
      sx={theme.palette.mode === "dark" ? darkThemeStyles : lightThemeStyles}
      id={id}
      {...props}>
      <StyledAccordionSummary
        sx={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px", 
          backgroundColor: theme.palette.mode === "dark" ? "#363640" : "#f7f5f2",
          "&.MuiAccordionSummary-root:hover": {
            cursor: "default",
          },
        }}
        expandIcon={
          <CustomTooltip title={t("ToggleView", { ns: "Common" })}>
            <IconButton
              sx={{
                cursor: "pointer",
                pointerEvents: "auto",
                transform: "rotate(-90deg)",
              }}>
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
        }>

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
            {t("PrefilterTokens")}
          </PageTitle>
          <FeatureAccessGuard feature="tableExport">
            <Button
              id="export_button"
              disabled={isExporting}
              onClick={e => {
                e.stopPropagation();
                void onExport();
              }}
              variant="outlined"
              sx={{ ml: 4, marginRight: "17px" }}>
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
          backgroundColor: theme.palette.mode === "dark" ? "#363640 !important" : "#f7f5f2 !important",
          width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}>
        {loading ? (
          <div></div>
        ) : (
          <MemoizedPrefilterTokensTable
            categories={categories}
            chains={chains}
            exchanges={exchanges}
            onCurrentFilterChange={onFilterChanged}
            dataSource={dataSource}
            onSorterChanged={onSorterChanged}
            filterType={filterType}
            dataGridRef={dataGridRef}
          />
        )}
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedPrefilterTokensTable = React.memo(PrefilterTokensTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource;
});
