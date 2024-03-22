import { AppChart } from "@/components/Charts/AppChart"
import AppDatePicker from "@/components/common/inputs/AppDatePicker"
import AppSelect from "@/components/common/inputs/AppSelect"
import SymbolLookup, { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import { chartDateFormatString } from "@/constants/Common"
import {
  Period,
  StyledTypographyWalletsWorthTitle,
  StyledWalletWorthContainer,
  StyledWalletWorthMenu,
  StyledWalletWorthMenuContainer,
} from "@/containers/MyWallets/HistoricalWalletsWorth"
import { MyWalletsSection, WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { fetchHistoricalWalletData, selectSeries, setPeriod } from "@/libs/redux/Slices/WalletWorthChartSlice"
import {
  createWallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  selectWallets,
} from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Box, Button, MenuItem, Stack } from "@mui/material"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, firstLoad } = useAppSelector(
    state => state.walletsReducer.wallets,
  )
  const { chartSeries, maxChartValue, minChartValue, period, yAxisTicks } = useAppSelector(
    state => state.walletsReducer.walletWorthChart,
  )
  const { icons, iconsFetchingStatus } = useAppSelector(state => state.walletsReducer.icons)
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
    dispatch(searchIcons({}))
  }, [dispatch])

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

  const lookupOptions = useMemo(
    () =>
      icons.map<LookUpOption>(icon => ({
        label: icon.sym,
        iconUrl: icon.lURI,
      })),
    [icons],
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
              onChange={event => dispatch(setPeriod({ period: event.target.value as Period }))}>
              <MenuItem value={"daily"}>{t("Daily")}</MenuItem>
              <MenuItem value={"weekly"}>{t("Weekly")}</MenuItem>
              <MenuItem value={"monthly"}>{t("Monthly")}</MenuItem>
            </AppSelect>
            <AppDatePicker
              disableFuture
              onChange={date => setFromDate(date)}
              maxDate={moment.utc().add(-1, "d").toDate()}
              label={t("FromDate")}
            />
            <SymbolLookup
              loading={iconsFetchingStatus === "loading"}
              disableListWrap
              value={symbolOption}
              onChange={(event, value) => setSymbolOption(value)}
              autoComplete={true}
              onInputChange={(event, value) => dispatch(searchIcons({ query: value }))}
              filterOptions={x => x}
              inputValue={symbolOption?.label}
              options={lookupOptions}
              label={t("CompareToSymbol")}
            />

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
                    if (seriesIndex !== undefined) dispatch(selectSeries({ seriesIndex: seriesIndex }))
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
                tickAmount: yAxisTicks,

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
