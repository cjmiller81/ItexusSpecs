import { AppChart } from "@/components/Charts/AppChart"
import AppDatePicker from "@/components/common/inputs/AppDatePicker"
import AppSelect from "@/components/common/inputs/AppSelect"
import PageTitle from "@/components/TextDisplay/PageTitle"
import { Box, BoxProps, MenuItem, SelectChangeEvent } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useState } from "react"
export type Period = "daily" | "weekly" | "monthly"

export const HistoricalWalletsWorth = ({ ...props }: BoxProps) => {
  const [period, setPeriod] = useState<Period>("daily")

  const series = [
    {
      name: "series1",
      data: [1, 131, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [1, 11, 32, 45, 32, 34, 52, 41],
    },
  ]

  const categories = [
    "2018-09-19T00:00:00.000Z",
    "2018-09-19T01:30:00.000Z",
    "2018-09-19T02:30:00.000Z",
    "2018-09-19T03:30:00.000Z",
    "2018-09-19T04:30:00.000Z",
    "2018-09-19T05:30:00.000Z",
    "2018-09-19T06:30:00.000Z",
  ]

  const onPeriodChanged = (event: SelectChangeEvent<unknown>) => {
    setPeriod(event.target.value as Period)
  }

  const toXAxesFormat = (period: Period): string => {
    switch (period) {
      case "daily":
        return "HH:mm"
      case "weekly":
        return "ddd"
      case "monthly":
        return "MMM"
      default:
        return "HH:mm"
    }
  }

  const percentageFormatter = (value: number) => `${value}%`

  return (
    <Box {...props}>
      <StyledWalletWorthContainer>
        <StyledWalletWorthMenuContainer>
          <StyledTypographyWalletsWorthTitle alignContent={"center"}>
            Historical Wallets Worth
          </StyledTypographyWalletsWorthTitle>
          {/* <StyledWalletWorthMenuInnerContainer> */}
          <StyledWalletWorthMenu>
            <AppSelect
              sx={{ width: "100%" }}
              label={"Period:"}
              value={period}
              defaultValue={"daily"}
              onChange={onPeriodChanged}>
              <MenuItem value={"daily"}>Daily</MenuItem>
              <MenuItem value={"weekly"}>Weekly</MenuItem>
              <MenuItem value={"monthly"}>Monthly</MenuItem>
            </AppSelect>
            <AppDatePicker
              disableFuture
              label={"From Date:"}
            />
            <AppSelect label={"Compare to Symbol:"}></AppSelect>
          </StyledWalletWorthMenu>
          {/* </StyledWalletWorthMenuInnerContainer> */}
        </StyledWalletWorthMenuContainer>
        <Box sx={{ width: "100%" }}>
          <AppChart
            series={series}
            height={460}
            optionsOverrides={{
              xaxis: {
                categories: categories,
                labels: {
                  format: toXAxesFormat(period),
                },
              },
              yaxis: {
                labels: {
                  formatter: percentageFormatter,
                },
              },
              tooltip: {
                x: {
                  format: "yyyy-MM-dd HH:mm",
                },
                y: {
                  formatter: percentageFormatter,
                },
              },
            }}
          />
        </Box>
      </StyledWalletWorthContainer>
    </Box>
  )
}

const StyledWalletWorthContainer = styled(Box)(({ theme }) => ({
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  gap: theme.spacing(4),
  display: "flex",
  width: "100%",
}))

const StyledWalletWorthMenuContainer = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "25%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    textWrap: "noWrap",
    display: "flex",
    width: "100%",
  },
  alignItems: "center",
  justifyContent: "flex-start",
}))

const StyledWalletWorthMenu = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  marginTop: theme.spacing(7),
  gap: theme.spacing(5),
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing(1),
    justifyContent: "space-around",
  },
}))

const StyledTypographyWalletsWorthTitle = styled(PageTitle)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    flexBasis: "20%",
    textWrap: "wrap",
    textAlign: "center",
  },
}))
