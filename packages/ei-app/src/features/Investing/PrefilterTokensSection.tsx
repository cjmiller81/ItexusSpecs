import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
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
} from "@mui/material";
import { ICategory, IExchange, IPlatform, PageTitle, StatePersistedAccordion } from "components";
import DataSource from "devextreme/data/data_source";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledAccordionSummary } from "./IndexModelingSection";
import { PrefilterTokensTable } from "./PrefilterTokensTable";
import { filtersApi } from "../../../../components/src/services/filterService";
import { useTheme } from "@mui/material/styles";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
  dataSource: DataSource;
  onFilterChanged: (filter: any) => void;
  onSorterChanged: (sorter: any) => void;
};

export default function PrefilterTokensSection({
  onSorterChanged,
  onFilterChanged,
  dataSource,
  persisKey,
  ...props
}: Props) {
  const { t } = useTranslation(["PrefilterTokensSection", "Common"]);

  const { sidebarOpened } = useAppSelector(store => store.ui);
  const theme = useTheme();
  const [chains, setChains] = useState<IPlatform[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [exchanges, setExchanges] = useState<IExchange[]>([]);
  const [loading, setLoading] = useState(true);

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
    borderRadius: "2px",
    boxShadow: "8px 2px 10px rgba(0, 0, 0, 0.2), -8px 2px 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#363640",
    border: "1.6px solid #25252AFF",
    outline: "1.9px solid #363640",
    "& .MuiAccordionSummary-root": {
      background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(54, 54, 64, 0.7) 24px, #363640 100%)`,
    },
  };

    const onExport = () => {
      const updatedAssets = dataSource.items().map(asset => {
    
        return {
          symbol: asset.sym,
          price: asset.price,
          marketCap: asset.mCap ? asset.mCap : 0,
          fullyDilutedValuation: asset.fulDilVal ? asset.fulDilVal : 0,
          tokenomics: asset.tNom ? (asset.tNom * 100).toFixed(2) + "%" : "",
          volume: asset.tVol ? asset.tVol : 0,
          categories: asset.cats && Array.isArray(asset.cats) ? asset.cats.join(", ") : "",
          chains: (asset.chains && Array.isArray(asset.chains) && asset.chains[0] !== '') ? asset.chains.join(", ") : "",
          exchanges: (asset.exchanges && Array.isArray(asset.exchanges)) ? asset.exchanges.join(", ") : "",
        };
      });

    const worksheet = XLSX.utils.json_to_sheet(updatedAssets, {
      header: [
        "symbol",
        "price",
        "marketCap",
        "fullyDilutedValuation",
        "tokenomics",
        "volume",
        "categories",
        "chains",
        "exchanges",
      ],
    });

    const columnWidth = { wch: 20 };
    worksheet["!cols"] = [
      columnWidth, columnWidth, columnWidth, columnWidth, columnWidth, columnWidth, columnWidth, columnWidth, columnWidth,
    ];

    for (let i = 2; i < updatedAssets.length + 2; i++) {
      worksheet[`B${i}`].z = "$#,##0.00";
      worksheet[`C${i}`].z = "$#,##0.00";
      worksheet[`D${i}`].z = "$#,##0.00";
      worksheet[`F${i}`].z = "#,##0";
      worksheet[`G${i}`].z = "@";
      worksheet[`H${i}`].z = "@"; 
      worksheet[`I${i}`].z = "@"; 
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [["Symbol", "Price", "Market Cap", "Fully Diluted Valuation", "Tokenomics", "Volume", "Categories", "Chains", "Exchanges"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, "assets");

    XLSX.writeFile(workbook, "assets.xlsx", { compression: true });
  };

  return (
    <StatePersistedAccordion
      persistKey={persisKey}
      defaultExpanded
      sx={theme.palette.mode === "dark" ? darkThemeStyles : { cursor: "default !important", pointerEvents: "none" }}
      {...props}>
      <StyledAccordionSummary
        expandIcon={
          <CustomTooltip title={t("ToggleView", { ns: "Common" })}>
            <IconButton sx={{ cursor: "pointer", pointerEvents: "auto" }}>
              <ExpandMoreIcon />
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
            {t("PrefilterTokens")}
          </PageTitle>
          <Button
            onClick={e => {
              e.stopPropagation();
              onExport();
            }}
            variant="outlined"
            sx={{ ml: 4, marginRight:"17px" }}
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
          backgroundColor: theme.palette.mode === "dark" ? "#363640" : "background.paper",
          width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
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
          />
        )}
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedPrefilterTokensTable = React.memo(PrefilterTokensTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource;
});
