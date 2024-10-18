import { useAppSelector } from "@/libs/redux/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionProps, Box, Typography } from "@mui/material";
import { PageTitle, StatePersistedAccordion, StyledAccordionSummary } from "components";
import DataSource from "devextreme/data/data_source";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { VaultsPoolsTable } from "./VaultsPoolsTable";
import { VaultsData } from "./Models/VaultsData";
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
  const [vaults, setVaults] = useState<VaultsData[]>([]);
  const [totalApy, setTotalApy] = useState<ApyData | null>(null);
  const [tvlData, setTvlData] = useState<{ [key: string]: number }>({});
  const { data: vaultsData, isLoading: isVaultsLoading } = useGetAllDataQuery();
  const { t } = useTranslation("Vaults");
  const { sidebarOpened } = useAppSelector(store => store.ui);

  useEffect(() => {
    if (!isVaultsLoading) {
      setVaults(vaultsData.vaults);
      setTotalApy(vaultsData.apy);
      setTvlData(vaultsData.tvl);
    }
  }, [vaultsData, isVaultsLoading]);

  const combinedVaults = useMemo(() => {
    if (!vaults || !totalApy || !tvlData) return [];

    return vaults.map((pool, index) => {
      let tvl: number | null = null;
      const poolKey = pool.pool;

      if (typeof poolKey !== "string") {
        return { ...pool, tvl, apy: null };
      }

      for (const key of Object.keys(tvlData)) {
        if (tvlData[key][poolKey] !== undefined) {
          tvl = tvlData[key][poolKey];
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
          const poolApy = totalApy[key]?.[poolKey];
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
  }, [vaults, totalApy, tvlData]);

  const filteredTokensSource = useMemo(
    () =>
      new DataSource<VaultsData, string>({
        store: {
          type: "array",
          key: "id",
          data: combinedVaults,
        },
      }),
    [combinedVaults],
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
    <>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 0 }}>
        {t("VaultsPageTitle")}
      </Typography>
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
          <MemoizedDefiPoolsTable
            loading={isVaultsLoading}
            onUpdate={() => {}}
            onExport={onExporting}
            dataSource={filteredTokensSource}
          />
        </AccordionDetails>
      </StatePersistedAccordion>
    </>
  );
}

const MemoizedDefiPoolsTable = React.memo(VaultsPoolsTable, (prevProps, nextProps) => {
  return prevProps.dataSource === nextProps.dataSource;
});
