import { Box, BoxProps } from "@mui/material"
import { SxProps, styled, useTheme } from "@mui/material/styles"
import { ApexOptions } from "apexcharts"
import { merge } from "ts-deepmerge"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export interface Props extends BoxProps {
  optionsOverrides?: ApexOptions
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined // eslint-disable-line no-undef
  height: number
  sx?: SxProps
}
export const AppChart = ({ optionsOverrides, series, height, ...props }: Props) => {
  const theme = useTheme()
  const defaultOptions: ApexOptions = {
    chart: {
      foreColor: theme.palette.text.primary,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      enabled: true,
    },
  }

  const options = optionsOverrides ? merge(defaultOptions, optionsOverrides) : defaultOptions
  //console.log(options)
  return (
    <Box {...props}>
      {typeof window !== "undefined" && (
        <StyledReactAppxChart
          width={"100%"}
          options={options}
          series={series}
          height={height}
          type="area"
        />
      )}
    </Box>
  )
}

const StyledReactAppxChart = styled(Chart)(({ theme }) => ({
  color: theme.palette.text.disabled,
  paddingBottom: 4,
  borderStyle: "solid",
  borderColor: theme.palette.divider,
  borderWidth: 1,
  "& .apexcharts-tooltip.apexcharts-theme-light": {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    borderColor: theme.palette.grey[500],
  },
  "& .apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title": {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
  },
  "& .apexcharts-xaxistooltip": {
    display: "none",
  },
}))
