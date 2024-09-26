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
import axios from "axios";
import { chains } from "@/features/Income/CryptocurrencyList";

type Props = Omit<AccordionProps, "children"> & {
  persisKey: string;
};

export default function VaultsTokensSection({ persisKey, ...props }: Props) {
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);
  const [boostsData, setBoostsData] = useState<any[]>([]);
  const [isPoolsLoading, setIsPoolsLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [filterBuilderOpen, setFilterBuilderOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<object | null>(null);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [totalApy, setTotalApy] = useState<number | null>(null);

  const { filters, deletingFilterStatus, creatingFilterStatus, updatingFilterStatus } = useAppSelector(
    state => state.allTokensTable,
  );

  const dispatch = useAppDispatch();
  const { t } = useTranslation("Yields");
  const { sidebarOpened } = useAppSelector(store => store.ui);

  // Fetch filters on mount
  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  // Fetch vaults data from Beefy API
  useEffect(() => {
    const fetchBeefyData = async () => {
      setIsPoolsLoading(true);
      try {
        const response = await fetch("https://api.beefy.finance/vaults");
        const data = await response.json();
        console.log(data); // Check API response structure
        setPoolsData(data);
      } catch (error) {
        console.error("Error fetching Beefy API data:", error);
      } finally {
        setIsPoolsLoading(false);
      }
    };

    fetchBeefyData();
  }, []);

  // Fetch boosts data
  useEffect(() => {
    const fetchBoostData = async () => {
      try {
        const response = await fetch("https://api.beefy.finance/boosts");
        const data = await response.json();
        setBoostsData(data);
      } catch (error) {
        console.error("Error fetching Boosts API data:", error);
      }
    };

    fetchBoostData();
  }, []);

  // Fetch chain logos
  useEffect(() => {
    const fetchChainLogos = async () => {
      const logoData: { [key: string]: string } = {};
      try {
        const logoPromises = Object.entries(chains).map(async ([chain, symbol]) => {
          const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${symbol}`);
          const coinData = response.data;
          if (coinData?.image?.thumb) {
            logoData[chain] = coinData.image.thumb; // Store the logo URL
          }
        });
        await Promise.all(logoPromises); // Wait for all logo fetches
        setLogos(logoData); // Set logos after fetching
      } catch (error) {
        console.error("Error fetching chain logos:", error);
      }
    };

    fetchChainLogos();
  }, []);

  // Fetch total APY data
  useEffect(() => {
    const fetchApyData = async () => {
      const response = await fetch("https://api.beefy.finance/apy/breakdown");
      const data = await response.json();
      console.log(data, "!!!!!!!!!!!");
      setTotalApy(data.totalApy); // Assuming 'totalApy' is a direct key
    };

    fetchApyData();
  }, []); // Runs only once after the component is mounted

  // Combine pools and boosts data
  const combinedPoolsData = useMemo(() => {
    console.log(poolsData, "poolsData!!@#$");
    console.log(boostsData, "boostsData!!@#$");

    return poolsData.map(pool => {
      const boost = boostsData.find(boost => boost.poolId === pool.id);
      return {
        ...pool,
        boostName: boost ? boost.name : "", // Show the name if boost exists, otherwise an empty string
        totalApy: totalApy, // Add totalApy to the pool data
      };
    });
  }, [poolsData, boostsData, totalApy]);

  // Filter liquidity pool filters
  const liquidityPoolFilters = useMemo(() => filters.filter(f => f.filterType === "liquidity-pool"), [filters]);

  // Filter data based on selected chain
  const filteredData = useMemo(() => {
    if (selectedChain === "") return combinedPoolsData;
    return combinedPoolsData.filter(pool => pool.chain === selectedChain);
  }, [combinedPoolsData, selectedChain]);

  // Data source for Defi Pools Table (filtered data)
  const filteredTokensSource = useMemo(
    () =>
      new DataSource<PoolData, string>({
        store: {
          type: "array",
          key: "id",
          data: filteredData,
        },
      }),
    [filteredData, totalApy],
  );

  // Exporting data to Excel
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

      <div>
        {Object.entries(logos).map(([chain, logoUrl]) => (
          <div key={chain}>
            <h4>{chain}</h4>
            <img
              src={logoUrl}
              alt={`${chain} logo`}
            />
          </div>
        ))}
      </div>

      <AccordionDetails
        sx={{
          bgcolor: "background.paper",
          width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
        }}>
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
          dataSource={filteredTokensSource} // Use filtered data source
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

// Memoized version of VaultsPoolsTable to avoid unnecessary re-renders
const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource && prevProps.currentFilter === nextProps.currentFilter;
});
