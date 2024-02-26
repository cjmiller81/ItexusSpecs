import { AppChart } from "@/components/Charts/AppChart"
import AppDatePicker from "@/components/common/inputs/AppDatePicker"
import AppSelect from "@/components/common/inputs/AppSelect"
import { Box, BoxProps, MenuItem, SelectChangeEvent, Stack, Typography } from "@mui/material"
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
          <Stack
            sx={{ width: "100%" }}
            direction={{ sm: "row", md: "column" }}>
            <Typography
              alignContent={"center"}
              variant="h5">
              Historical Wallets Worth
            </Typography>
            <StyledWalletWorthMenu>
              <AppSelect
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
          </Stack>
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
  alignItems: "center",
  display: "flex",
  gap: 5,
  width: "100%",
}))

const StyledWalletWorthMenuContainer = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    flexDirection: "row",
    textWrap: "noWrap",
  },
  alignItems: "center",
  display: "flex",
  gap: 5,
  width: "100%",
}))

const StyledWalletWorthMenu = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    flexDirection: "row",
    alignItems: "center",
  },
}))
