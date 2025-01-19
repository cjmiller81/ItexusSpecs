import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/libs/redux/Store";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionDetails,
  AccordionProps,
  Box,
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
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { VaultsPoolsTable } from "./VaultsPoolsTable";
import { VaultsData } from "./Models/VaultsData";
import { useGetAllDataQuery } from "@/features/Income/VaultsApi";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

export default function VaultsTokensSection({ persisKey, ...props }: Props) {
  const [vaults, setVaults] = useState<VaultsData[]>([]);
  const { data: vaultsData, isLoading: isVaultsLoading } = useGetAllDataQuery();
  const { t } = useTranslation(["Vaults", "Common"]);
  const { sidebarOpened } = useAppSelector(store => store.ui);
  const theme = useTheme();

  useEffect(() => {
    if (!isVaultsLoading && vaultsData) {
      setVaults(vaultsData.data);
    }
  }, [vaultsData, isVaultsLoading]);

  const processedVaults = useMemo(() => {
    return vaults.map(pool => ({
      ...pool,
      apy: pool.breakdowns ? pool.breakdowns.totalApy.toFixed(2) : null,
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
      }),
    [processedVaults],
  );

  const onExporting = useCallback(async (e: any) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Vaults");
    const currentDate = new Date();

    await exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Vaults-Data-${currentDate.toISOString().split("T")[0]}.xlsx`,
    );
    e.cancel = true;
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
    mt: 2,
    pointerEvents: "none",
    position: "inherit",
    borderRadius: "2px",
    boxShadow: "8px 2px 10px rgba(0, 0, 0, 0.2), -8px 2px 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#363640",
    border: "1.6px solid #25252AFF",
    outline: "1.9px solid #363640",
    "& .MuiAccordionSummary-root": {
      background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(54, 54, 64, 0.7) 24px, #363640 100%)`,
    },
  };

  return (
    <>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 0 }}>
        {t("VaultsPageTitle")}
      </Typography>
      <StatePersistedAccordion
        persistKey={persisKey}
        sx={theme.palette.mode === "dark" ? darkThemeStyles : { cursor: "default !important", mt: 2 }}
        defaultExpanded
        {...props}>
        <StyledAccordionSummary
          expandIcon={
            <CustomTooltip
              title={t("ToggleView", { ns: "Common" })}
              arrow>
              <IconButton sx={{ cursor: "pointer", pointerEvents: "auto" }}>
                <ExpandMoreIcon />
              </IconButton>
            </CustomTooltip>
          }
          sx={{
            pointerEvents: "none",
            "&.MuiAccordionSummary-root:hover": {
              cursor: "default",
            },
          }}>
          <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
            <PageTitle
              sx={{ width: "100%" }}
              onClick={e => e.stopPropagation()}>
              {t("VaultsTitle")}
            </PageTitle>
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "background.default" : "background.paper",
            width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
            transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            pointerEvents: "auto",
          }}>
          <MemoizedDefiPoolsTable
            loading={isVaultsLoading}
            onUpdate={() => {}}
            onExport={onExporting}
            dataSource={filteredTokensSource}
          />
        </AccordionDetails>
      </StatePersistedAccordion>
    </>
  );
}

const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource;
});
