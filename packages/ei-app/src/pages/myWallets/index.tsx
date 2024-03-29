import { LookUpOption } from "@/components/common/inputs/AppSymbolLookup/SymbolsLookup"
import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { MyWalletsSection, WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { fetchHistoricalWalletData, selectSeries, setPeriod } from "@/libs/redux/Slices/WalletWorthChartSlice"
import {
  createWallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  selectWallets,
} from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, firstLoad } = useAppSelector(
    state => state.walletsReducer.wallets,
  )
  const { chartSeries, maxChartValue, minChartValue, period, yAxisTicks } = useAppSelector(
    state => state.walletsReducer.walletWorthChart,
  )
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.walletsReducer.icons)
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
    dispatch(clearSearchResult())
    dispatch(searchIcons({}))
  }, [dispatch])

  const onChartRefresh = () => {
    if (fromDate) {
      dispatch(
        fetchHistoricalWalletData({
          compareSymbol: symbolOption?.symbol,
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

      <HistoricalWalletsWorth
        sx={{ mt: 4 }}
        lookupOption={symbolOption}
        chartAxisTicks={yAxisTicks}
        chartSeries={chartSeries}
        fromDate={fromDate}
        lookupLoading={iconsFetchingStatus === "loading"}
        lookupOptions={lookUpOptions}
        maxChartValue={maxChartValue}
        minChartValue={minChartValue}
        onChartSubmit={onChartRefresh}
        onFromDateChange={date => setFromDate(date)}
        onLookUpSearchChange={searchValue => dispatch(searchIcons({ query: searchValue }))}
        onOptionChange={option => setSymbolOption(option)}
        onPeriodChange={period => dispatch(setPeriod({ period: period }))}
        period={period}
        onToggleSeries={seriesIndex => dispatch(selectSeries({ seriesIndex: seriesIndex }))}
        submitButtonDisabled={!fromDate || !selectedWallets.length}
        title={t("HistoricalWalletsWorth")}
      />
    </Stack>
  )
}
