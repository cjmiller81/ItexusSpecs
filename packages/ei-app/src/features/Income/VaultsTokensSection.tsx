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
      let apy: string | null = null;

      const poolKey = pool.id;

      if (typeof poolKey !== "string") {
        return { ...pool, tvl, apy };
      }

      const tvlFound = Object.entries(tvlData).find(([key]) => tvlData[key][poolKey] !== undefined);
      if (tvlFound) {
        tvl = tvlFound[1][poolKey];
      } else {
        const fallbackKey = Object.keys(tvlData)[index];
        if (fallbackKey && tvlData[fallbackKey]) {
          tvl = Object.values(tvlData[fallbackKey])[0];
        }
      }

      const apyFound = Object.entries(totalApy).find(([key]) => totalApy[key]?.[poolKey] !== undefined);
      if (apyFound) {
        const apyValue = apyFound[1][poolKey]?.totalApy?.toString();
        apy = apyValue?.length > 8 ? apyValue.slice(0, 8) : apyValue;
      } else {
        const fallbackApyKey = Object.keys(totalApy)[index];
        if (fallbackApyKey && totalApy[fallbackApyKey]) {
          const fallbackApyValue = totalApy[fallbackApyKey].totalApy?.toString();
          apy = fallbackApyValue?.length > 8 ? fallbackApyValue.slice(0, 8) : fallbackApyValue;
        }
      }

      const isRetired = pool.status === "eol";

      return {
        ...pool,
        tvl,
        apy,
        isRetired,
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
