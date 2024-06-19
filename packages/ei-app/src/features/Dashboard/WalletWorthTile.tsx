import { AppChart } from "@/components/Charts/AppChart"
import { CompareToValues } from "@/libs/redux/Slices/Shared"
import { chartDateFormatString } from "components"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { DashboardTile, DashboardTileProps } from "./DashboardTile"

type Props = Omit<DashboardTileProps, "children"> & {
  chartData: CompareToValues | null
}

export const WalletWorthTile: FC<Props> = ({ title, icon, chartData, ...props }) => {
  const { t } = useTranslation("WalletWorthTile")
  const percentageFormatter = (value?: number) => {
    return `${(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}%`
  }

  const series: ApexAxisChartSeries = [
    {
      name: t("ChartSeriesTitle"),
      data: chartData || [],
    },
  ]
  return (
    <DashboardTile
      title={title}
      icon={icon}
      {...props}>
      <AppChart
        series={series}
        height={360}
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
  )
}
