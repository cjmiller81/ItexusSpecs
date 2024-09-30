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

interface PoolApy {
  totalApy: number;
}

interface ApyData {
  [pool: string]: PoolApy;
}

export default function VaultsTokensSection({ persisKey, ...props }: Props) {
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);
  const [isPoolsLoading, setIsPoolsLoading] = useState(true);
  const [filterBuilderOpen, setFilterBuilderOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<object | null>(null);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const [totalApy, setTotalApy] = useState<ApyData | null>(null);
  const [tvlData, setTvlData] = useState<{ [key: string]: number }>({});

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
      setIsPoolsLoading(true);
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
    const fetchChainLogos = async () => {
      const logoData: { [key: string]: string } = {};
      try {
        const logoPromises = Object.entries(chains).map(async ([chain, symbol]) => {
          const response = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${symbol}`);
          const coinData = response.data;
          if (coinData?.image?.thumb) {
            logoData[chain] = coinData.image.thumb;
          }
        });
        await Promise.all(logoPromises);
        setLogos(logoData);
      } catch (error) {
        console.error("Error fetching chain logos:", error);
      }
    };

    fetchChainLogos();
  }, []);

  useEffect(() => {
    const fetchApyData = async () => {
      try {
        const response = await fetch("https://api.beefy.finance/apy/breakdown");
        const apyData: ApyData = await response.json();
        console.log(apyData, "totalApy");
        setTotalApy(apyData);
      } catch (error) {
        console.error("Error fetching APY data:", error);
      }
    };

    fetchApyData();
  }, []);

  useEffect(() => {
    const fetchTvlData = async () => {
      try {
        const response = await fetch("https://api.beefy.finance/tvl");
        const tvlData = await response.json();
        setTvlData(tvlData);
      } catch (error) {
        console.error("Error fetching TVL data:", error);
      }
    };

    fetchTvlData();
  }, []);

  const combinedPoolsData = useMemo(() => {
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
          dataSource={filteredTokensSource}
          totalApy={totalApy}
        />
      </AccordionDetails>
    </StatePersistedAccordion>
  );
}

const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource && prevProps.currentFilter === nextProps.currentFilter;
});
