import { createFilter, deleteFilter, fetchFilters, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionProps, Box } from "@mui/material";
import { PageTitle, StatePersistedAccordion, StyledAccordionSummary } from "components";
import DataSource from "devextreme/data/data_source";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomFilterBuilder } from "../Common/DevExpressTable/CustomFilterBuilder";
import { useGetPoolsQuery } from "./DefiApi";
import { DefiPoolsTable } from "./DefiPoolsTable";
import { PoolData } from "./Models/PoolData";
import { defiFilterBuilderFields } from "./tableConstants";
import SimpleBar from "simplebar-react";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

export default function DefiTokensSection({ persisKey, ...props }: Props) {
  const { data: poolsData, isLoading: isPoolsLoading } = useGetPoolsQuery();
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const [filterBuildeOpen, setFilterBuilderOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("Yields");
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

  return (
    <StatePersistedAccordion
      persistKey={persisKey}
      defaultExpanded
      {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }}>{t("Yields")}</PageTitle>
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails
        sx={{
          bgcolor: "background.paper",
          width: `${sidebarOpened ? "calc(100vw - 285px)" : "calc(100vw - 108px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
        }}>
        <SimpleBar style={{ maxHeight: "600px" }}>
          <CustomFilterBuilder
            filterBuilderFields={defiFilterBuilderFields}
            filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
            filterDeletingLoading={deletingFilterStatus === "loading"}
            open={filterBuildeOpen}
            onCreateFilter={filter => dispatch(createFilter(filter))}
            onClose={() => setFilterBuilderOpen(false)}
            predefinedFilters={filters}
            onUpdateFilter={filter => dispatch(updateFilter(filter))}
            onApply={filter => {
              setCurrentFilter(filter);
              setFilterBuilderOpen(false);
            }}
            filterToAppply={currentFilter}
            onDeleteFilter={filterId => dispatch(deleteFilter({ id: filterId }))}
          />
        </SimpleBar>
        <MemoizedDefiPoolsTable
          onFilterBuilderOpen={() => setFilterBuilderOpen(true)}
          loading={isPoolsLoading}
          onUpdate={() => {}}
          onExport={onExporting}
          currentFilter={currentFilter}
          onCurrentFilterChange={filter => setCurrentFilter(filter)}
          dataSource={allTokensSource}
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedDefiPoolsTable = React.memo(DefiPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource && prevProps.currentFilter === nextProps.currentFilter;
});
