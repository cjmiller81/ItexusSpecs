import { createFilter, deleteFilter, fetchFilters, updateFilter } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionProps, Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
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

import EthereumIcon from "@mui/icons-material/Token";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import PolygonIcon from "@mui/icons-material/AcUnit";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

export default function VaultsTokensSection({ persisKey, ...props }: Props) {
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);
  const [isPoolsLoading, setIsPoolsLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [filterBuilderOpen, setFilterBuilderOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<object[] | null | undefined>();

  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );

  const dispatch = useAppDispatch();
  const { t } = useTranslation("Yields");
  const { sidebarOpened } = useAppSelector(store => store.ui);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  useEffect(() => {
    const fetchBeefyData = async () => {
      try {
        const response = await fetch("https://api.beefy.finance/vaults");
        const data = await response.json();
        setPoolsData(data);
      } catch (error) {
        console.error("Error fetching Beefy API data:", error);
      } finally {
        setIsPoolsLoading(false);
      }
    };

    fetchBeefyData();
  }, []);

  useEffect(() => {
    console.log(poolsData, "poolsData");
  }, [poolsData]);

  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "liquidity-pool"), [filters]);

  const filteredData = useMemo(() => {
    if (selectedChain === "") return poolsData;
    return poolsData.filter(pool => pool?.chain === selectedChain);
  }, [poolsData, selectedChain]);

  const allTokensSource = useMemo(
    () =>
      new DataSource<PoolData, string>({
        store: {
          type: "array",
          key: "id",
          data: filteredData,
        },
      }),
    [filteredData],
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

  const handleChainChange = (event: SelectChangeEvent) => {
    setSelectedChain(event.target.value); // Update selected chain
  };

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
          width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
        }}>
        {/* Dropdown for selecting chain */}
        <Box sx={{ mb: 2 }}>
          <Select
            value={selectedChain}
            onChange={handleChainChange}
            displayEmpty>
            <MenuItem value="">
              <em>All Chains</em>
            </MenuItem>
            <MenuItem value="metis">
              <EthereumIcon style={{ marginRight: "8px" }} />
              Metis
            </MenuItem>{" "}
            <MenuItem value="ethereum">
              <EthereumIcon style={{ marginRight: "8px" }} />
              Ethereum
            </MenuItem>
            <MenuItem value="bsc">
              <CurrencyBitcoinIcon style={{ marginRight: "8px" }} />
              Binance Smart Chain
            </MenuItem>
            <MenuItem value="polygon">
              <PolygonIcon style={{ marginRight: "8px" }} />
              Polygon
            </MenuItem>
            {/* Add more chains as needed */}
          </Select>
        </Box>

        <SimpleBar style={{ maxHeight: "600px" }}>
          <CustomFilterBuilder
            filterType="liquidity-pool"
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
            filterToApply={currentFilter}
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

const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource && prevProps.currentFilter === nextProps.currentFilter;
});
