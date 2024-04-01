import { AppChart } from "@/components/Charts/AppChart"
import AppDatePicker from "@/components/common/inputs/AppDatePicker"
import AppSelect from "@/components/common/inputs/AppSelect"
import SymbolLookup, { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import PageTitle from "@/components/TextDisplay/PageTitle"
import { chartDateFormatString } from "@/constants/Common"
import LoadingButton from "@mui/lab/LoadingButton"
import { Box, BoxProps, MenuItem } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useState } from "react"
import { useTranslation } from "react-i18next"
export type Period = "daily" | "weekly" | "monthly"

interface Props extends BoxProps {
  title: string
  period: Period
  onPeriodChange: (period: Period) => void
  onFromDateChange: (date: Date | null) => void
  fromDate: Date | null
  onChartSubmit: () => void
  lookupLoading: boolean
  lookupOptions: LookUpOption[]
  lookupOption?: LookUpOption | null
  onOptionChange: (option: LookUpOption | null) => void
  minChartValue: number
  maxChartValue: number
  chartAxisTicks: number
  chartDataLoading?: boolean
  onToggleSeries: (seriesIndex: 0 | 1) => void
  onLookUpSearchChange: (search: string) => void
  submitButtonDisabled: boolean
  sumbitButtonText?: string
  //eslint-disable-next-line no-undef
  chartSeries?: ApexAxisChartSeries | null
}
export const HistoricalWalletsWorth = ({
  title,
  period,
  onPeriodChange,
  onFromDateChange,
  fromDate,
  onChartSubmit,
  lookupLoading,
  lookupOptions,
  lookupOption,
  onOptionChange,
  minChartValue,
  maxChartValue,
  chartAxisTicks,
  chartDataLoading,
  onToggleSeries,
  onLookUpSearchChange,
  submitButtonDisabled,
  chartSeries,
  sumbitButtonText,
  ...props
}: Props) => {
  const { t } = useTranslation("HistoricalWalletsWorth")

  const percentageFormatter = (value?: number) => {
    return `${(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}%`
  }

  const [inputSearch, setInputSearch] = useState("")

  return (
    <StyledWalletWorthContainer {...props}>
      <StyledWalletWorthMenuContainer>
        <StyledTypographyWalletsWorthTitle alignContent={"center"}>{title}</StyledTypographyWalletsWorthTitle>
        <StyledWalletWorthMenu>
          <AppSelect
            sx={{ width: "100%" }}
            label={t("Period")}
            value={period}
            variant="outlined"
            defaultValue={"daily"}
            onChange={event => onPeriodChange(event.target.value as Period)}>
            <MenuItem value={"daily"}>{t("Daily")}</MenuItem>
            <MenuItem value={"weekly"}>{t("Weekly")}</MenuItem>
            <MenuItem value={"monthly"}>{t("Monthly")}</MenuItem>
          </AppSelect>
          <AppDatePicker
            disableFuture
            value={fromDate}
            onChange={date => onFromDateChange(date)}
            maxDate={new Date()}
            label={t("FromDate")}
          />
          <StyledSymbolLookup
            loading={lookupLoading}
            disableListWrap
            value={lookupOption}
            onChange={(event, value) => onOptionChange(value)}
            autoComplete={true}
            onInputChange={(event, value) => {
              onLookUpSearchChange(value)
              setInputSearch(value)
            }}
            filterOptions={x => x}
            inputValue={inputSearch}
            options={lookupOptions}
            label={t("CompareToSymbol")}
          />
          <LoadingButton
            loading={chartDataLoading}
            onClick={onChartSubmit}
            disabled={submitButtonDisabled}
            sx={{ width: "50%", alignSelf: "center" }}
            variant="contained">
            {sumbitButtonText || t("Sumbit", { ns: "Common" })}
          </LoadingButton>
        </StyledWalletWorthMenu>
      </StyledWalletWorthMenuContainer>
      <Box sx={{ width: "100%" }}>
        <AppChart
          series={chartSeries ?? []}
          height={460}
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
            chart: {
              events: {
                legendClick: (chart: any, seriesIndex?: number) => {
                  if (seriesIndex !== undefined) onToggleSeries(seriesIndex as 0 | 1)
                },
              },
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
            annotations: {
              yaxis: [
                {
                  y: 0,
                  strokeDashArray: 0,
                  borderWidth: 2,
                  borderColor: "#F1F1F1",
                },
              ],
            },
            yaxis: {
              min: minChartValue,
              max: maxChartValue,
              forceNiceScale: true,
              tickAmount: chartAxisTicks,
              labels: {
                formatter: percentageFormatter,
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
      </Box>
    </StyledWalletWorthContainer>
  )
}

export const StyledWalletWorthContainer = styled(Box)(({ theme }) => ({
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  gap: theme.spacing(4),
  display: "flex",
  width: "100%",
}))

export const StyledSymbolLookup = styled(SymbolLookup)(() => ({
  flexGrow: 1,
}))

export const StyledWalletWorthMenuContainer = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "35%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    textWrap: "noWrap",
    display: "flex",
    width: "100%",
  },
  alignItems: "center",
  justifyContent: "flex-start",
}))

export const StyledWalletWorthMenu = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  marginTop: theme.spacing(7),
  gap: theme.spacing(5),
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(2),
  },
  [theme.breakpoints.between("sm", "md")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  [theme.breakpoints.down("xs")]: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
}))

export const StyledTypographyWalletsWorthTitle = styled(PageTitle)(({ theme }) => ({
  textWrap: "wrap",
  [theme.breakpoints.down("md")]: {
    flexBasis: "20%",
    textAlign: "center",
  },
}))
