import { MyWalletsSection } from "@/containers/MyWallets/MyWalletsSection"
import { clearSearchResult, searchIcons } from "@/libs/redux/Slices/IconsSlice"
import {
  createWallet,
  deleteWallet,
  fetchTotalWalletsWorthData,
  fetchWallets,
  selectWallets,
  updateWallet,
} from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Box, BoxProps } from "@mui/material"
import { useEffect } from "react"

export interface Props extends BoxProps {}

export const WalletsContainer = ({ ...props }: Props) => {
  const { wallets, statusFetchingWallets, totalWalletsWorthData, selectedWallets, firstLoad } = useAppSelector(
    state => state.walletsReducer.wallets,
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (firstLoad) dispatch(fetchWallets(null))
    dispatch(clearSearchResult())
    dispatch(searchIcons({}))
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
