import { Box, BoxProps } from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../slices"
import {
  createWallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  selectWallets,
  updateWallet,
} from "../../slices/walletsSlice"
import { MyWalletsSection } from "../myWallets/MyWalletsSection"

interface Props extends BoxProps {}

export const WalletsContainer = ({ ...props }: Props) => {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets } = useAppSelector(
    state => state.wallets,
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTotalWalletsWorthData({}))
  }, [selectedWallets])

  return (
    <Box {...props}>
      <MyWalletsSection
        onUpdateWallet={wallet => dispatch(updateWallet(wallet))}
        selectedWalletsIds={selectedWallets.map(wallet => wallet.address)}
        totalWalletsWorthData={totalWalletsWorthData}
        loading={statusFetchingWallets === "loading"}
        wallets={wallets}
        onSelectedRowsChanged={rows => dispatch(selectWallets(rows))}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
      />
    </Box>
  )
}
