import { HistoricalWalletsWorth } from "@/features/MyWallets/HistoricalWalletsWorth"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import { fetchHistoricalWalletData, selectSeries, setPeriod } from "@/libs/redux/Slices/WalletWorthChartSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack } from "@mui/material"
import {
  LookUpOption, MyWalletsSection,
  Wallet,
  createWallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  selectWallets,
  updateWallet,
} from "components"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, firstLoad } = useAppSelector(
    state => state.wallets,
  )
  const { chartSeries, maxChartValue, minChartValue, period, yAxisTicks, statstatusFetchingHistoricalData } =
    useAppSelector(state => state.walletWorthChart)
  const { iconsFetchingStatus, lookUpOptions } = useAppSelector(state => state.icons)
  const [symbolOption, setSymbolOption] = useState<LookUpOption | null>(null)
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(new Date())
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
    dispatch(clearSearchResult())
    dispatch(searchIcons({}))
  }, [dispatch, firstLoad])

  const onChartRefresh = () => {
    if (fromDate && toDate) {
      dispatch(
        fetchHistoricalWalletData({
          tokenId: symbolOption?.tokenId,
          compareLabel: symbolOption?.label,
          startDate: fromDate,
          endDate: toDate,
        }),
      )
    }
  }

  useEffect(() => {
    dispatch(fetchTotalWalletsWorthData({}))
  }, [dispatch, selectedWallets])

  const onRowsChanged = (rows: Wallet[]) => {
    dispatch(selectWallets(rows))
  }

  const onUpdateWallet = (wallet: Wallet) => {
    dispatch(updateWallet(wallet))
  }

  return (
    <Stack>
      <MyWalletsSection
        onUpdateWallet={onUpdateWallet}
        selectedWalletsIds={selectedWallets.map(wallet => wallet.address)}
        totalWalletsWorthData={totalWalletsWorthData}
        loading={statusFetchingWallets === "loading"}
        wallets={wallets}
        onSelectedRowsChanged={rows => onRowsChanged(rows)}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
      />

      <HistoricalWalletsWorth
        sx={{ mt: 4 }}
        chartDataLoading={statstatusFetchingHistoricalData === "loading"}
        lookupOption={symbolOption}
        chartAxisTicks={yAxisTicks}
        chartSeries={chartSeries}
        fromDate={fromDate}
        toDate={toDate}
        lookupLoading={iconsFetchingStatus === "loading"}
        lookupOptions={lookUpOptions}
        maxChartValue={maxChartValue}
        minChartValue={minChartValue}
        onChartSubmit={onChartRefresh}
        onFromDateChange={date => setFromDate(date)}
        onToDateChange={date => setToDate(date)}
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
