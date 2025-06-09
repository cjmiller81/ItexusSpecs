import { CompareToValues } from "@/libs/redux/Slices/Shared";
import { chartDateFormatString } from "components";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";
import { useTheme } from "@mui/material";
import { AppChartHome } from "@/components/Charts/AppChartHome";

type Props = Omit<DashboardTileProps, "children"> & {
  chartData: CompareToValues | null;
};

enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export const WalletWorthTile: FC<Props> = ({ title, icon, chartData, ...props }) => {
  const { t } = useTranslation("WalletWorthTile");
  const theme = useTheme();
  const backgroundColor = theme.palette.mode === ThemeMode.DARK ? "transparent" : "#fff";
  const percentageFormatter = (value?: number) => {
    return `${(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}%`;
  };

  // eslint-disable-next-line no-undef
  const series: ApexAxisChartSeries = [
    {
      name: t("ChartSeriesTitle"),
      data: chartData || [],
    },
  ];
  return (
    <DashboardTile
      title={title}
      icon={icon}
      {...props}>
      <AppChartHome
        sx={{ backgroundColor: backgroundColor }}
        series={series}
        height={398}
        optionsOverrides={{
          legend: {
            show: true,
            showForSingleSeries: true,
            onItemClick: {
              toggleDataSeries: true,
            },
          },
          grid: {
            strokeDashArray: 0,
          },
          yaxis: {
            labels: {
              formatter: percentageFormatter,
            },
          },
          chart: {
            animations: {
              enabled: false,
              dynamicAnimation: {
                enabled: false,
              },
            },

            zoom: {
              enabled: true,
              type: "x",
              autoScaleYaxis: false,
              zoomedArea: {
                fill: {
                  color: "#90CAF9",
                  opacity: 0.4,
                },
                stroke: {
                  color: "#0D47A1",
                  opacity: 0.4,
                  width: 1,
                },
              },
            },
          },
          markers: {
            radius: 0,
          },
          stroke: {
            width: 3,
            curve: "smooth",
          },
          tooltip: {
            x: {
              format: chartDateFormatString,
            },
            y: {
              formatter: percentageFormatter,
            },
          },
        }}
      />
    </DashboardTile>
  );
};
