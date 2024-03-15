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
import { fetchHistoricalWolletData } from "@/libs/redux/Slices/WalletWorthChartSlice"
import { createWallet, deleteWallet, fetchWallets } from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { toChartSeries, toOptions, toTotalTokensBalances } from "@/utils/tokensTableHelpers"
import { Box, Button, MenuItem, SelectChangeEvent, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets } = useAppSelector(state => state.walletsReducer.wallets)
  const { chartData } = useAppSelector(state => state.walletsReducer.walletWorthChart)
  const [period, setPeriod] = useState<Period>("daily")
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")
  const walletsRows = wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))
  const [selectedRows, setSelectedRows] = useState<WalletRow[]>([]);

  useEffect(() => {
    dispatch(fetchWallets(null))
  }, [dispatch])

  const options = toOptions(walletsRows)

  const onPeriodChanged = (event: SelectChangeEvent<unknown>) => {
    setPeriod(event.target.value as Period)
  }

  const onChartRefresh = () => {
    if (symbolOption && fromDate) {
      dispatch(
        fetchHistoricalWolletData({
          compareSymbol: symbolOption.label.toLocaleLowerCase(),
          compareLabel: symbolOption.label,
          endDate: new Date(),
          startDate: fromDate,
          symbols: toTotalTokensBalances(selectedRows),
        }),
      )
    }
  }

  const series = chartData ? toChartSeries(chartData?.seriesData, t("HistoricalWalletsWorthSeries"), chartData?.comareToLabel) : []

  const percentageFormatter = (value: number) => `${value}%`
  return (
    <Stack>
      <MyWalletsSection
        loading={statusFetchingWallets === "loading"}
        wallets={walletsRows}
        onSelectedRowsChanged={rows => setSelectedRows(rows)}
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
              disabled={!fromDate || !symbolOption || !selectedRows.length}
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
