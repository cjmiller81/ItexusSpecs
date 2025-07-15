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
import * as XLSX from "xlsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetPoolsQuery } from "./DefiApi";
import { DefiPoolsTable } from "./DefiPoolsTable";
import { PoolData } from "./Models/PoolData";
import { useGetDexsQuery } from "./DexApi";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

export default function DefiTokensSection({ persisKey, ...props }: Props) {
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPoolsQuery();
  const { data: dexsData, isLoading: isDexsLoading } = useGetDexsQuery();
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

  const onExport = () => {
    const updatedAssets = allTokensSource.items().map(asset => {
      return {
        pool: asset.symbol || "N/A",
        project: asset.project || "N/A",
        chain: asset.chain || "N/A",
        dex: asset.dex ? asset.dex.join(", ") : "N/A",
        tvl: asset.tvlUsd ? `$${asset.tvlUsd}` : "$0.00",
        apy: asset.apy ? `${asset.apy}%` : "0.00%",
        apyMean30d: asset.apyMean30d ? `${asset.apyMean30d}%` : "0.00%",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(updatedAssets, {
      header: ["pool", "project", "chain", "dex", "tvl", "apy", "apyMean30d"],
    });

    const columnWidth = { wch: 20 };
    worksheet["!cols"] = [columnWidth, columnWidth, columnWidth, columnWidth, columnWidth, columnWidth, columnWidth];

    for (let i = 2; i < updatedAssets.length + 2; i++) {
      worksheet[`E${i}`].z = "$#,##0.00";
      worksheet[`F${i}`].z = "0.00%";
      worksheet[`G${i}`].z = "0.00%";
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Pool", "Project", "Chain", "DEX", "TVL", "APY", "APY Mean 30d"]], {
      origin: "A1",
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "assets");

    XLSX.writeFile(workbook, "assets.xlsx", { compression: true });
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
    backgroundColor: "#aaaaaa !important"
  };

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
              {t("PrefilterLiquidityPools")}
            </PageTitle>
            <Button
              onClick={e => {
                e.stopPropagation();
                onExport();
              }}
              variant="outlined"
              sx={{ ml: 4, marginRight: "17px" }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <DownloadIcon />
                {t("Export")}
              </Box>
            </Button>
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#363640" : "#aaaaaa !important",
            width: sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)",
            transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            pointerEvents: "auto",
          }}
        >
          <MemoizedDefiPoolsTable
            loading={isPoolsLoading && isDexsLoading}
            dexs={dexsData || []}
            onUpdate={() => {}}
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

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  transition: "none",
  backgroundColor:theme.palette.mode === "dark" ? "#363640" : "#aaaaaa",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  minHeight: "64px",
}));
