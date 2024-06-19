import { TopTokenData, TopTokensTile } from "@/features/Dashboard/TopTokensTile"
import { WalletWorthTile } from "@/features/Dashboard/WalletWorthTile"
import { fetchCoins } from "@/libs/redux/Slices/AllTokensTableSlice"
import { fetchHistoricalWalletData } from "@/libs/redux/Slices/DashboardSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { Grid, Typography } from "@mui/material"
import { fetchWallets, useOry } from "components"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

export default function HomePage() {
  const { session } = useOry()
  const firstName = session?.identity?.traits.name.first
  const { t } = useTranslation("HomePage")
  const wallets = useAppSelector(state => state.wallets.wallets)
  const firstLoad = useAppSelector(state => state.wallets.firstLoad)
  const statusFetchingWallets = useAppSelector(state => state.wallets.statusFetchingWallets)
  const statusTotalWalletWorthChartData = useAppSelector(state => state.dashboard.statusTotalWalletWorthChartData)
  const totalWalletWorthChartData = useAppSelector(state => state.dashboard.totalWalletWorthChartData)
  const allCoins = useAppSelector(state => state.allTokensTable.allTokens)
  const fetchingTokensStatus = useAppSelector(state => state.allTokensTable.fetchingTokensStatus)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCoins({}))
  }, [])

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
  }, [firstLoad])

  useEffect(() => {
    if (!wallets.length) return

    dispatch(fetchHistoricalWalletData())
  }, [wallets])

  const coinsMemorized = useMemo(() => {
    const newTableData = allCoins.slice(0, 10)
    const calculatedData = newTableData.map<TopTokenData>(data => {
      return {
        tokenId: data.id,
        iconUrl: data.lURI,
        id: data.id,
        marketCap: data.mCap,
        symbol: data.sym,
        price: data.price,
        fulDilVal: data.fulDilVal,
      }
    })

    return calculatedData
  }, [allCoins])

  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold" }}>
        {t("Welcome", { userName: firstName })}
      </Typography>

      <Grid
        mt={2}
        spacing={1}
        container>
        <Grid
          xs={6}
          item>
          <WalletWorthTile
            loading={statusFetchingWallets === "loading" || statusTotalWalletWorthChartData === "loading"}
            title={t("WalletsWorthTile")}
            icon={<AccountBalanceWalletIcon />}
            chartData={totalWalletWorthChartData}></WalletWorthTile>
        </Grid>
        <Grid
          xs={6}
          item>
          <TopTokensTile
            loading={fetchingTokensStatus === "loading"}
            title={t("TopTokensTile")}
            icon={<AccountBalanceWalletIcon />}
            tableAssets={coinsMemorized}></TopTokensTile>
        </Grid>
      </Grid>
    </>
  )
}
