import { getIndexModelingTableColumns } from "@/constants/ColumnsDefs/IndexModelingTable";
import { currencyFormat, percentageFormat, qtyFormat } from "@/constants/xls";
import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset";
import DownloadIcon from "@mui/icons-material/Download";
import { AccordionProps, AccordionSummary, Box, Button, styled, useTheme } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import { AppAccordionSection, AppNumberInput, AppPercentageField, nativeBarSx, StyledWalletsTable } from "components";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
  tableAssets: InvestingTableAsset[];
  isEqualWeight?: boolean;
  onTokensChange: (tokens: number) => void;
  onCapitalChange: (capital: number) => void;
  capital: number;
  tokens: number;
  weighted: number;
  persistKey: string;
}

export const IndexModelingSection = ({
  tokens,
  capital,
  weighted,
  onCapitalChange,
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
    <AppAccordionSection
      persistKey={persistKey}
      defaultExpanded
      sx={theme.palette.mode === "dark" ? darkThemeStyles : { cursor: "default !important", pointerEvents: "none" }}
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
          <AppNumberInput
            label={t("TotalCapital")}
            min={0}
            step={10}
            value={capital}
            onChange={(_, value) => onCapitalChange(value || 0)}
          />
        </LeftContainer>
        <RightContainer>
          <StyledWalletsTable
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

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  transition: "none",
}));
