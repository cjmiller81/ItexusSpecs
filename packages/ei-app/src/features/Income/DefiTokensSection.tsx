import { fetchFilters } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetPoolsQuery } from "./DefiApi";
import { DefiPoolsTable } from "./DefiPoolsTable";
import { PoolData } from "./Models/PoolData";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

export default function DefiTokensSection({ persisKey, ...props }: Props) {
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPoolsQuery();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["LiquidityPoolsPage", "Common"]);
  const theme = useTheme();
  const { sidebarOpened } = useAppSelector(store => store.ui);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  const allTokensSource = useMemo(
    () =>
      new DataSource<PoolData, string>({
        store: {
          type: "array",
          key: "pool",
          data: poolsData ? poolsData.data : [],
        },
      }),
    [poolsData],
  );

  const onExporting = useCallback(async (e: any): Promise<void> => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    const currentDate = new Date();

    await exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    });

    await workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `TokenSets-Model-Prefilter-Tokens-${currentDate.toISOString().split("T")[0]}.xlsx`,
      );
    });
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

  return (
    <>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 0 }}>
        {t("PageTitleLiquidityPools")}
      </Typography>
      <StatePersistedAccordion
        persistKey={persisKey}
        defaultExpanded
        sx={{ cursor: "default !important", mt: 2 }}
        {...props}>
        <StyledAccordionSummary
          expandIcon={
            <CustomTooltip
              title={t("ToggleView", { ns: "Common" })}
              arrow>
              <IconButton sx={{ cursor: "pointer" }}>
                <ExpandMoreIcon />
              </IconButton>
            </CustomTooltip>
          }
          sx={{
            "&.MuiAccordionSummary-root:hover": {
              cursor: "default",
            },
          }}>
          <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
            <PageTitle
              sx={{ width: "100%" }}
              onClick={e => e.stopPropagation()}>
              {t("PrefilterLiquidityPools")}
            </PageTitle>
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{
            bgcolor: "background.paper",
            width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
            transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          }}>
          <MemoizedDefiPoolsTable
            loading={isPoolsLoading}
            onUpdate={() => {}}
            onExport={onExporting}
            dataSource={allTokensSource}
          />
        </AccordionDetails>
      </StatePersistedAccordion>
    </>
  );
}

const MemoizedDefiPoolsTable = React.memo(DefiPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource;
});
