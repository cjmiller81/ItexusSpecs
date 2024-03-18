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
import { toChartSeries, toOptions, toTotalTokensBalances } from "@/utils/tokensTableHelpers"
import { Box, Button, MenuItem, SelectChangeEvent, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets } = useAppSelector(
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
    dispatch(fetchWallets(null))
  }, [dispatch])

  const options = useMemo(() => toOptions(walletsRows), [walletsRows])

  const onPeriodChanged = (event: SelectChangeEvent<unknown>) => {
    setPeriod(event.target.value as Period)
  }

  const onChartRefresh = () => {
    if (symbolOption && fromDate) {
      dispatch(
        fetchHistoricalWalletData({
          compareSymbol: symbolOption.label.toLocaleLowerCase(),
          compareLabel: symbolOption.label,
          endDate: new Date(),
          startDate: fromDate,
          symbols: toTotalTokensBalances(selectedWallets),
        }),
      )
    }
  }

  const onRowsChanged = (rows: WalletRow[]) => {
    dispatch(selectWallets(rows))
    dispatch(fetchTotalWalletsWorthData({}))
  }

  const series = chartData
    ? toChartSeries(chartData?.seriesData, t("HistoricalWalletsWorthSeries"), chartData?.comareToLabel)
    : []

  const percentageFormatter = (value: number) => `${value}%`
  return (
    <Stack>
      <MyWalletsSection
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
              disabled={!fromDate || !symbolOption || !selectedWallets.length}
              sx={{ width: "50%", alignSelf: "center" }}
              variant="contained">
              {t("Sumbit")}
            </Button>
          </StyledWalletWorthMenu>
        </StyledWalletWorthMenuContainer>
        <Box sx={{ width: "100%" }}>
          <AppChart
            series={series}
            height={460}
            optionsOverrides={{
              yaxis: {
                labels: {
                  formatter: percentageFormatter,
                },
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
