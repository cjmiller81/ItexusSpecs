import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionProps, Box } from "@mui/material";
import { ICategory, IExchange, IPlatform, PageTitle, StatePersistedAccordion } from "components";
import DataSource from "devextreme/data/data_source";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledAccordionSummary } from "./IndexModelingSection";
import { PrefilterTokensTable } from "./PrefilterTokensTable";
import { filtersApi } from "../../../../components/src/services/filterService"




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
  const { t } = useTranslation("PrefilterTokensSection");
  const { sidebarOpened } = useAppSelector(store => store.ui);

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
        console.error("Ошибка при загрузке данных", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

console.log(chains);
console.log(exchanges);
console.log(categories);

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

  return (
    <StatePersistedAccordion
      persistKey={persisKey}
      defaultExpanded
      {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }}>{t("PrefilterTokens")}</PageTitle>
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ 
          bgcolor: "background.paper",
          width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
        }}>
         <MemoizedPrefilterTokensTable
         categories={categories|| []}
         chains={chains || []}
         exchanges={exchanges|| [] }
          onCurrentFilterChange={onFilterChanged}
          dataSource={dataSource}
          onExport={onExporting}
          onSorterChanged={onSorterChanged}
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedPrefilterTokensTable = React.memo(PrefilterTokensTable, (prevProps, nextProps) => {
  return (
    prevProps.dataSource === nextProps.dataSource
  );
});
