import { MyWalletsSection } from "@/containers/MyWallets/MyWalletsSection"
import { fetchWallets } from "@/libs/redux/Slices/WalletsSlice"
import { useAppDispatch } from "@/libs/redux/Store"
import { Box, BoxProps } from "@mui/material"
import { useEffect } from "react"

export interface Props extends BoxProps {}

export const WalletsContainer = ({ ...props }: Props) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchWallets(null))
  }, [dispatch])

  return (
    <Box {...props}>
      <MyWalletsSection
        onUpdateWallet={() => {}}
        selectedWalletsIds={[]}
        loading={false}
        wallets={[]}
        onAddWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    </Box>
  )
}
