import { HistoricalWalletsWorth } from "@/containers/MyWallets/HistoricalWalletsWorth"
import { MyWalletsSection, WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { createWallet, deleteWallet, fetchWallets } from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function MyWalletsPage() {
  const { wallets, statusFetchingWallets } = useAppSelector(state => state.walletsReducer.wallets)
  const dispatch = useAppDispatch()

  const { t } = useTranslation("MyWalletsPage")
  const walletsRows = wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))

  useEffect(() => {
    dispatch(fetchWallets(null))
  }, [dispatch])

  return (
    <>
      <MyWalletsSection
        loading={statusFetchingWallets === "loading"}
        wallets={walletsRows}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
      />
      <HistoricalWalletsWorth
        title={t("HistoricalWalletsWorth")}
        sx={{ mt: 6 }}
      />
    </>
  )
}
