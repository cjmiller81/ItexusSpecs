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
import SimpleBar from "simplebar-react";
import { CustomFilterBuilder } from "../Common/DevExpressTable/CustomFilterBuilder";
import { VaultsPoolsTable } from "./VaultsPoolsTable";
import { PoolData } from "./Models/PoolData";
import { defiFilterBuilderFields } from "./tableConstants";
import { useGetAllDataQuery } from "@/features/Income/VaultsApi";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

interface PoolApy {
  totalApy: number;
}

interface ApyData {
  [pool: string]: PoolApy;
}

export default function VaultsTokensSection({ persisKey, ...props }: Props) {
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);
  const [filterBuilderOpen, setFilterBuilderOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();
  const [totalApy, setTotalApy] = useState<ApyData | null>(null);
  const [tvlData, setTvlData] = useState<{ [key: string]: number }>({});

  const { data: vaultsData, isLoading: isVaultsLoading } = useGetAllDataQuery();
  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );

  useEffect(() => {
    if (!isVaultsLoading) {
      setPoolsData(vaultsData.vaults);
      setTotalApy(vaultsData.apy);
      setTvlData(vaultsData.tvl);
    }
  }, [vaultsData, isVaultsLoading]);

  const dispatch = useAppDispatch();
  const { t } = useTranslation("Vaults");
  const { sidebarOpened } = useAppSelector(store => store.ui);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  const combinedPoolsData = useMemo(() => {
    if (!poolsData || !totalApy || !tvlData) return [];
    return poolsData.map((pool, index) => {
      let tvl = null;
      for (const key of Object.keys(tvlData)) {
        if (tvlData[key][pool.pool] !== undefined) {
          tvl = tvlData[key][pool.pool];
          break;
        }
      }

      if (tvl === null) {
        const keys = Object.keys(tvlData);
        if (keys.length > index) {
          const fallbackKey = keys[index];
          const fallbackData = tvlData[fallbackKey];
          if (fallbackData) {
            tvl = Object.values(fallbackData)[0];
          }
        }
      }

      let apy: string | null = null;

      if (totalApy && typeof totalApy === "object") {
        for (const key of Object.keys(totalApy)) {
          const poolApy = totalApy[key][pool.pool];
          if (poolApy !== undefined) {
            const apyValue = poolApy.totalApy?.toString();
            apy = apyValue?.length > 8 ? apyValue.slice(0, 8) : apyValue;
            break;
          }
        }

        if (apy === null) {
          const apyKeys = Object.keys(totalApy);
          if (apyKeys.length > index) {
            const fallbackApyKey = apyKeys[index];
            const fallbackApyData = totalApy[fallbackApyKey];
            if (fallbackApyData) {
              const fallbackApyValue = fallbackApyData.totalApy?.toString();
              apy = fallbackApyValue?.length > 8 ? fallbackApyValue.slice(0, 8) : fallbackApyValue;
            }
          }
        }
      }

      return {
        ...pool,
        tvl,
        apy,
      };
    });
  }, [poolsData, totalApy, tvlData]);

  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "liquidity-pool"), [filters]);

  const filteredTokensSource = useMemo(
    () =>
      new DataSource<PoolData, string>({
        store: {
          type: "array",
          key: "id",
          data: combinedPoolsData,
        },
      }),
    [combinedPoolsData],
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
          <PageTitle sx={{ width: "100%" }}>{t("VaultsTitle")}</PageTitle>
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails
        sx={{
          bgcolor: "background.paper",
          width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
        }}>
        <SimpleBar style={{ maxHeight: "600px" }}>
          <CustomFilterBuilder
            filterType="vaults"
            filterBuilderFields={defiFilterBuilderFields}
            filterLoading={updatingFilterStatus === "loading" || creatingFilterStatus === "loading"}
            filterDeletingLoading={deletingFilterStatus === "loading"}
            open={filterBuilderOpen}
            onCreateFilter={filter => dispatch(createFilter(filter))}
            onClose={() => setFilterBuilderOpen(false)}
            predefinedFilters={liquidityPoolFilters}
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
          loading={isVaultsLoading}
          onUpdate={() => {}}
          onExport={onExporting}
          currentFilter={currentFilter}
          onCurrentFilterChange={filter => setCurrentFilter(filter)}
          dataSource={filteredTokensSource}
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource && prevProps.currentFilter === nextProps.currentFilter;
});
