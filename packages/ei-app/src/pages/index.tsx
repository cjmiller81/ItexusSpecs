import { WalletWorthTile } from "@/features/Dashboard/WalletWorthTile"
import { fetchHistoricalWalletData } from "@/libs/redux/Slices/DashboardSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { Grid, Typography } from "@mui/material"
import { fetchWallets, useOry } from "components"
import { useEffect } from "react"
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

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
  }, [firstLoad])

  useEffect(() => {
    if (!wallets.length) return

    dispatch(fetchHistoricalWalletData())
  }, [wallets])

  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold" }}>
          {t("Welcome", { userName: firstName })}
      </Typography>

      <Grid
        mt={2}
        container>
        <Grid
          xs={5}
          item>
          <WalletWorthTile
            loading={statusFetchingWallets === "loading" || statusTotalWalletWorthChartData === "loading"}
            title={t("WalletsWorthTile")}
            icon={<AccountBalanceWalletIcon />}
            chartData={totalWalletWorthChartData}></WalletWorthTile>
        </Grid>
        <Grid
          xs={3}
          item></Grid>
        <Grid
          xs={4}
          item></Grid>
      </Grid>
    </>
  )
}
