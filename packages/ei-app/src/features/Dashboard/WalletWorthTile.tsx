import { CompareToValues } from "@/libs/redux/Slices/Shared";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";
import { useTheme, ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { AppChartHome } from "@/components/Charts/AppChartHome";
import { ApexOptions } from "apexcharts";

type Props = Omit<
  DashboardTileProps,
  "children" | "title" | "rightHeaderContent"
> & {
  chartDataGrowth: CompareToValues | null;
  chartDataValue: CompareToValues | null;
};

enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export const WalletWorthTile: FC<Props> = ({
  icon,
  chartDataGrowth,
  chartDataValue,
  ...props
}) => {
  const { t } = useTranslation("WalletWorthTile");
  const theme = useTheme();

  const backgroundColor =
    theme.palette.mode === ThemeMode.DARK ? "transparent" : "#fff";

  const [selectedSection, setSelectedSection] = useState<"growth" | "value">(
    "growth"
  );

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
          formatter:
            selectedSection === "growth" ? growthFormatter : valueFormatter,
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
          formatter:
            selectedSection === "growth" ? growthFormatter : valueFormatter,
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
        text: t("GoToFullPage")
      }}
      rightHeaderContent={
        <Box display="flex" alignItems="center" gap={2}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={selectedSection}
            onChange={(_, newValue) => {
              if (newValue !== null) {
                setSelectedSection(newValue);
              }
            }}
            aria-label="Select chart type"
          >
            <ToggleButton
              value="growth"
              sx={{
                textTransform: "none",
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                },
              }}
            >
              {t("Growth")}
            </ToggleButton>
            <ToggleButton
              value="value"
              sx={{
                textTransform: "none",
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                },
              }}
            >
              {t("Value")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      }
      {...props}
    >
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
    </DashboardTile>
  );
};
