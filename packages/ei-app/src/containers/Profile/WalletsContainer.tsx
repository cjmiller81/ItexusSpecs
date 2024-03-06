import { MyWalletsSection } from "@/containers/MyWallets/MyWalletsSection"
import { Box, BoxProps } from "@mui/material"

export interface Props extends BoxProps {}

export const WalletsContainer = ({ ...props }: Props) => {
  return (
    <Box {...props}>
      <MyWalletsSection
        loading={false}
        wallets={[]}
        onAddWallet={() => {}}
        onDeleteWallet={() => {}}
      />
    </Box>
  )
}
