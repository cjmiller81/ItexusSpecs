import { createFilter, deleteFilter, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionProps, Box } from "@mui/material";
import { PageTitle, StatePersistedAccordion } from "components";
import DataSource from "devextreme/data/data_source";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { filterBuilderFields } from "../../constants/PrefilterTokensTable";
import { CustomFilterBuilder } from "../Common/DevExpressTable/CustomFilterBuilder";
import { StyledAccordionSummary } from "./IndexModelingSection";
import { PrefilterTokensTable } from "./PrefilterTokensTable";

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
  const { filters, updatingFilterStatus, deletingFilterStatus, creatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const marketCapFilters = useMemo(() => filters.filter(f => f.filterType === "market-cap"), [filters]);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const [filterBuildeOpen, setFilterBuilderOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("PrefilterTokensSection");
  const { sidebarOpened } = useAppSelector(store => store.ui);

  useEffect(() => {
    onFilterChanged(currentFilter);
  }, [currentFilter]);

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
        <CustomFilterBuilder
          filterType="market-cap"
          filterBuilderFields={filterBuilderFields}
          filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
          filterDeletingLoading={deletingFilterStatus === "loading"}
          open={filterBuildeOpen}
          onCreateFilter={filter => dispatch(createFilter(filter))}
          onClose={() => setFilterBuilderOpen(false)}
          predefinedFilters={marketCapFilters}
          onUpdateFilter={filter => dispatch(updateFilter(filter))}
          onApply={filter => {
            setCurrentFilter(filter);
            setFilterBuilderOpen(false);
          }}
          filterToAppply={currentFilter}
          onDeleteFilter={filterId => dispatch(deleteFilter({ id: filterId }))}
        />

        <MemoizedPrefilterTokensTable
          onFilterBuilderOpen={() => setFilterBuilderOpen(true)}
          dataSource={dataSource}
          onExport={onExporting}
          onSorterChanged={onSorterChanged}
          currentFilter={currentFilter}
          onCurrentFilterChange={filter => setCurrentFilter(filter)}
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedPrefilterTokensTable = React.memo(PrefilterTokensTable, (prevProps, nextProps) => {
  return (
    prevProps.dataSource === nextProps.dataSource &&
    prevProps.currentFilter === nextProps.currentFilter
  );
});
