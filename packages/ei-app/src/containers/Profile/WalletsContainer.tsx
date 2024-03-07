import { MyWalletsSection, WalletRow } from "@/containers/MyWallets/MyWalletsSection"
import { createWallet, deleteWallet, fetchWallets } from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Box, BoxProps } from "@mui/material"
import { useEffect } from "react"

export interface Props extends BoxProps {}

export const WalletsContainer = ({ ...props }: Props) => {
  const { wallets, statusFetchingWallets } = useAppSelector(state => state.walletsReducer.wallets)
  const dispatch = useAppDispatch()

  const walletsRows = wallets.map<WalletRow>(wallet => ({ ...wallet, expanded: false }))

  useEffect(() => {
    dispatch(fetchWallets(null))
  }, [dispatch])

  return (
    <Box {...props}>
      <MyWalletsSection
        loading={statusFetchingWallets === "loading"}
        wallets={walletsRows}
        onAddWallet={wallet => dispatch(createWallet(wallet))}
        onDeleteWallet={wallet => dispatch(deleteWallet(wallet))}
      />
    </Box>
  )
}
