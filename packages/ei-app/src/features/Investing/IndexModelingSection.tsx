import { getIndexModelingTableColumns } from "@/constants/ColumnsDefs/IndexModelingTable";
import { currencyFormat, percentageFormat, qtyFormat } from "@/constants/xls";
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset";
import { Wallet } from "@/models/Wallet/Wallet";
import DownloadIcon from "@mui/icons-material/Download";
import { AccordionProps, AccordionSummary, Box, Button, styled, useTheme } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import { AppAccordionSection, AppNumberInput, AppPercentageField, nativeBarSx, StyledWalletsTable } from "components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { MarketCapWallet } from "../MyWallets/MarketCapWallet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Link from "next/link";
import { Typography } from "@mui/material";

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
  tableAssets: InvestingTableAsset[];
  isEqualWeight?: boolean;
  onTokensChange: (tokens: number) => void;
  tokens: number;
  weighted: number;
  persistKey: string;
}

export const IndexModelingSection = ({
  tokens,
  weighted,
  onTokensChange,
  title,
  tableAssets,
  isEqualWeight,
  persistKey,
  ...props
}: Props) => {
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const [isInfoPanelExpanded, setIsInfoPanelExpanded] = useState<boolean>(false);

  const onExport = () => {
    const updatedAssets = tableAssets.map(asset => ({
      symbol: asset.symbol,
      price: asset.price,
      marketCap: asset.marketCap,
      weight: asset.weight,
      qty: asset.qty * (tokens / 100),
    }));

    const worksheet = XLSX.utils.json_to_sheet(
      updatedAssets.map(asset => ({
        symbol: asset.symbol,
        price: asset.price,
        marketCap: asset.marketCap,
        weight: asset.weight,
        qty: asset.qty,
      })),
    );
    const columnWidth12 = { wch: 12 };
    worksheet["!cols"] = worksheet["!cols"] = [
      columnWidth12,
      columnWidth12,
      columnWidth12,
      columnWidth12,
      columnWidth12,
    ];

    for (let i = 2; i < tableAssets.length + 2; i++) {
      worksheet[`B${i}`].z = currencyFormat;
      worksheet[`C${i}`].z = currencyFormat;
      worksheet[`D${i}`].z = percentageFormat;
      worksheet[`E${i}`].z = qtyFormat;
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Symbol", "Price", "Market Cap", "Weight", "Qty"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "assets");
    XLSX.writeFile(workbook, "assets.xlsx", { compression: true });
  };

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
    <AppAccordionSection
      persistKey={persistKey}
      defaultExpanded
      sx={theme.palette.mode === "dark" ? darkThemeStyles : lightThemeStyles}
      title={title}
      tooltip={t("ToogleView", { ns: "Common" })}
      headerChildren={
        <Button
          sx={{ mr: 2, pointerEvents: "auto" }}
          onClick={event => {
            event.stopPropagation();
            onExport();
          }}
          variant="outlined">
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <DownloadIcon />
            {t("Export")}
          </Box>
        </Button>
      }
      {...props}>
      <MainContainer
      sx={{ width: "100%", pointerEvents: "auto" }}
        gap={2}>
        <LeftContainer>
          <AppNumberInput
            label={t("Tokens")}
            value={tokens}
            min={0}
            onChange={(_, value) => onTokensChange(value || 0)}
          />
          
          <Box sx={{ width: "100%" }}>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1, 
                cursor: "pointer",
                "&:hover": { opacity: 0.8 }
              }}
              onClick={() => setIsInfoPanelExpanded(!isInfoPanelExpanded)}
            >
              <Typography 
                sx={{ 
                  color: "#1976d2", 
                  fontSize: "14px",
                  fontWeight: 500
                }}
              >
                {t("HowTheTokensInputImpactsYourIndex")}
              </Typography>
              {isInfoPanelExpanded ? (
                <ExpandLessIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: "16px", color: "#1976d2" }} />
              )}
            </Box>
            
            {isInfoPanelExpanded ? (
              <Box 
                sx={{ 
                  mt: 1,
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(25, 118, 210, 0.1)" : "rgba(25, 118, 210, 0.05)",
                  borderLeft: "4px solid #1976d2",
                  borderTop: "1px solid rgba(25, 118, 210, 0.2)",
                  borderRight: "1px solid rgba(25, 118, 210, 0.2)",
                  borderBottom: "1px solid rgba(25, 118, 210, 0.2)"
                }}
              >
                <Typography 
                  sx={{ 
                    color: "#1976d2", 
                    fontSize: "14px",
                    fontWeight: 600,
                    mb: 1,
                    backgroundColor:"transparent"
                  }}
                >
                  {t("IndexContributionDetails")}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: "13px",
                    lineHeight: 1.5
                  }}
                >
                  {t("TheQuantityYouChooseDeterminesHowManyTokens")}
                </Typography>
                <Box component="ul" sx={{ mt: 1, mb: 1, pl: 2 }}>
                  <Typography component="li" sx={{ fontSize: "13px", mb: 0.5 }}>
                    {t("IncreaseTheWeightOfThisPosition")}
                  </Typography>
                  <Typography component="li" sx={{ fontSize: "13px", mb: 0.5 }}>
                    {t("AffectYourOverallPortfolioBalance")}
                  </Typography>
                  <Typography component="li" sx={{ fontSize: "13px", mb: 0.5 }}>
                    {t("ImpactRiskDistribution")}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    fontSize: "13px",
                    lineHeight: 1.5
                  }}
                >
                  {t("SeeThis")}
                  <Link 
                    href="https://www.investopedia.com/terms/c/capitalizationweightedindex.asp" 
                    target="_blank"
                    style={{ 
                      color: "#1976d2", 
                      textDecoration: "underline",
                      fontWeight: 500
                    }}
                  >
                    {t("InvestopediaPage")}
                  </Link>
                  {t("ForMoreInformation")}
                </Typography>
              </Box>
            ) : (<Box 
                sx={{ 
                  mt: 1,
                  paddingLeft:"10px",
                  paddingTop:"5px",
                  alignItems:"center",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(25, 118, 210, 0.1)" : "rgba(25, 118, 210, 0.05)",
                  borderLeft: "4px solid #1976d2",
                  borderTop: "1px solid rgba(25, 118, 210, 0.2)",
                  borderRight: "1px solid rgba(25, 118, 210, 0.2)",
                  borderBottom: "1px solid rgba(25, 118, 210, 0.2)"
                }}
              >
                <Typography 
                  sx={{ 
                    color: "#1976d2", 
                    fontSize: "14px",
                    fontWeight: 600,
                    mb: 1,
                    backgroundColor:"transparent"
                  }}
                >
                  {t("IndexContributionDetails")}
                </Typography>
                </Box>)}
          </Box>
          
          {isEqualWeight && (
            <AppPercentageField
              label={t("EqualWeight")}
              onChange={() => {}}
              value={weighted}
              inputProps={{
                disabled: true,
              }}
              maxDecimals={2}
            />
          )}
        </LeftContainer>
        <RightContainer>
          <MarketCapWallet
            sx={{
              ...tableScrollSx,
            }}
            hideFooter
            rowSelection={false}
            checkboxSelection={false}
            apiRef={apiRef}
            getRowId={x => x.id}
            columns={getIndexModelingTableColumns()}
            rows={tableAssets}
          />
        </RightContainer>
      </MainContainer>
    </AppAccordionSection>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

const LeftContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "30%",
  gap: theme.spacing(4),
  [theme.breakpoints.between("xs", "sm")]: {
    width: "100%",
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  width: "70%",
  [theme.breakpoints.between("xs", "sm")]: {
    width: "100%",
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "flex",
  width: "100%",
  backgroundColor: theme.palette.mode === "dark" ? "#363640" : "#aaaaaa",
  pointerEvents: "auto",
  [theme.breakpoints.between("xs", "sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));


const StyledIndexModelingTable = styled(StyledWalletsTable)(() => ({
  "& .MuiDataGrid-main": {
    height: "auto",
  },
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  transition: "none",
  backgroundColor:theme.palette.mode === "dark" ? "#363640" : "#aaaaaa",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  minHeight: "64px",
  "&.Mui-expanded": {
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
  },
}));

