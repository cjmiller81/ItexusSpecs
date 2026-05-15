import { CompareToValues } from "@/libs/redux/Slices/Shared";
import { useSubscription } from "components";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";
import { useTheme, Box, CircularProgress } from "@mui/material";
import { TabSelector } from "../../../../components/src/components/common/TabSelector";
import { AppChartHome } from "@/components/Charts/AppChartHome";
import { ApexOptions } from "apexcharts";

type Props = Omit<DashboardTileProps, "children" | "title" | "rightHeaderContent"> & {
  chartDataGrowth: CompareToValues | null;
  chartDataValue: CompareToValues | null;
  chartLoading?: boolean;
};

enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export const WalletWorthTile: FC<Props> = ({ icon, chartDataGrowth, chartDataValue, chartLoading, ...props }) => {
  const { t } = useTranslation("WalletWorthTile");
  const theme = useTheme();
  const { hasPageAccess } = useSubscription();

  const backgroundColor = theme.palette.mode === ThemeMode.DARK ? "transparent" : "#fff";

  const [selectedSection, setSelectedSection] = useState<"growth" | "value">("growth");

  const series =
    selectedSection === "growth"
      ? chartDataGrowth
        ? [...chartDataGrowth]
        : []
      : chartDataValue
        ? [...chartDataValue]
        : [];

  const chartOptions: ApexOptions = useMemo(() => {
    const growthFormatter = (value?: number) => {
      if (value === undefined || value === null) return "";
      return `${value.toFixed(0)}%`;
    };

    const valueFormatter = (value?: number) => {
      if (value === undefined || value === null) return "";
      return `${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} $`;
    };

    return {
      yaxis: {
        labels: {
          formatter: selectedSection === "growth" ? growthFormatter : valueFormatter,
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            day: "dd MMM",
          },
        },
        tickAmount: Math.floor((series?.length ?? 0) / 2),
      },
      tooltip: {
        y: {
          formatter: selectedSection === "growth" ? growthFormatter : valueFormatter,
        },
      },
    };
  }, [selectedSection, series]);

  return (
    <DashboardTile
      icon={icon}
      title={t("WalletsPerformance")}
      sectionLink={{
        href: "/myWallets/decentralized",
        text: t("GoToFullPage"),
        disabled: !hasPageAccess("/myWallets/decentralized"),
      }}
      rightHeaderContent={
        <Box
          display="flex"
          alignItems="center"
          gap={2}>
          <TabSelector
            options={[
              { label: t("Growth"), value: "growth" },
              { label: t("Value"), value: "value" },
            ]}
            value={selectedSection}
            onChange={v => setSelectedSection(v as "growth" | "value")}
            sx={{ minHeight: 36 }}
          />
        </Box>
      }
      {...props}>
      <Box sx={{ position: "relative" }}>
        <AppChartHome
          sx={{ backgroundColor }}
          series={[
            {
              name: selectedSection === "growth" ? t("Growth") : t("Value"),
              data: series,
            },
          ]}
          height={398}
          optionsOverrides={chartOptions}
          key={selectedSection}
        />
        {chartLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.15)",
              borderRadius: 1,
            }}>
            <CircularProgress
              sx={{ color: "success.main" }}
              size={48}
            />
          </Box>
        )}
      </Box>
    </DashboardTile>
  );
};
