import { AppChart } from "@/components/Charts/AppChart"
import AppDatePicker from "@/components/common/inputs/AppDatePicker"
import AppSelect from "@/components/common/inputs/AppSelect"
import SymbolLookup, { LookUpOption } from "@/components/common/inputs/SymbolsLookup"
import { chartDateFormatString } from "@/constants/Common"
import {
  Period,
  StyledTypographyWalletsWorthTitle,
  StyledWalletWorthContainer,
  StyledWalletWorthMenu,
  StyledWalletWorthMenuContainer,
} from "@/containers/MyWallets/HistoricalWalletsWorth"
import { MyWalletsSection, WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { fetchHistoricalWalletData } from "@/libs/redux/Slices/WalletWorthChartSlice"
import {
  createWallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  selectWallets,
} from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { toChartSeries, toOptions } from "@/utils/tokensTableHelpers"
import { Box, Button, MenuItem, SelectChangeEvent, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, firstLoad } = useAppSelector(
    state => state.walletsReducer.wallets,
  )
  const { chartData } = useAppSelector(state => state.walletsReducer.walletWorthChart)

  const [period, setPeriod] = useState<Period>("daily")
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")
  const walletsRows = wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))
  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
  }, [dispatch])

  const options = useMemo(() => toOptions(walletsRows), [walletsRows])

  const onPeriodChanged = (event: SelectChangeEvent<unknown>) => {
    setPeriod(event.target.value as Period)
  }

  const onChartRefresh = () => {
    if (fromDate) {
      dispatch(
        fetchHistoricalWalletData({
          compareSymbol: symbolOption?.label.toLocaleLowerCase(),
          compareLabel: symbolOption?.label,
          startDate: fromDate,
        }),
      )
    }
  }

  useEffect(() => {
    dispatch(fetchTotalWalletsWorthData({}))
  }, [selectedWallets])

  const onRowsChanged = (rows: WalletRow[]) => {
    dispatch(selectWallets(rows))
  }

  const seriesData = useMemo(
    () =>
      chartData ? toChartSeries(chartData, period, t("HistoricalWalletsWorthSeries"), chartData?.comareToLabel) : null,
    [chartData, period],
  )

  const percentageFormatter = (value?: number) => {
    return `${(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}%`
  }

  return (
    <Stack>
      <MyWalletsSection
        selectedWalletsIds={selectedWallets.map(wallet => wallet.address)}
        totalWalletsWorthData={totalWalletsWorthData}
        loading={statusFetchingWallets === "loading"}
        wallets={wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))}
        onSelectedRowsChanged={rows => onRowsChanged(rows)}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
      />

      <StyledWalletWorthContainer sx={{ mt: 8 }}>
        <StyledWalletWorthMenuContainer>
          <StyledTypographyWalletsWorthTitle alignContent={"center"}>
            {t("HistoricalWalletsWorth")}
          </StyledTypographyWalletsWorthTitle>
          <StyledWalletWorthMenu>
            <AppSelect
              sx={{ width: "100%" }}
              label={t("Period")}
              value={period}
              variant="outlined"
              defaultValue={"daily"}
              onChange={onPeriodChanged}>
              <MenuItem value={"daily"}>{t("Daily")}</MenuItem>
              <MenuItem value={"weekly"}>{t("Weekly")}</MenuItem>
              <MenuItem value={"monthly"}>{t("Monthly")}</MenuItem>
            </AppSelect>
            <AppDatePicker
              disableFuture
              onChange={date => setFromDate(date)}
              label={t("FromDate")}
            />
            <SymbolLookup
              onChange={option => setSymbolOption(option)}
              value={symbolOption}
              options={options}
              label={t("CompareToSymbol")}></SymbolLookup>

            <Button
              onClick={onChartRefresh}
              disabled={!fromDate || !selectedWallets.length}
              sx={{ width: "50%", alignSelf: "center" }}
              variant="contained">
              {t("Sumbit")}
            </Button>
          </StyledWalletWorthMenu>
        </StyledWalletWorthMenuContainer>
        <Box sx={{ width: "100%" }}>
          <AppChart
            series={seriesData?.series ?? []}
            height={460}
            optionsOverrides={{
              legend: {
                show: true,
                showForSingleSeries: true,
              },
              grid: {
                strokeDashArray: 4,
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
              annotations: {
                yaxis: [
                  {
                    y: 0,
                    strokeDashArray: 4,
                    borderWidth: 2,
                    borderColor: "#F1F1F1",
                  },
                ],
              },
              yaxis: {
                min: seriesData?.min ? Math.ceil(seriesData?.min * 2) / 2 : 0,
                max: seriesData?.max ? Math.ceil(seriesData?.max * 2) / 2 : 10,
                forceNiceScale: true,
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
    </Stack>
  )
}
