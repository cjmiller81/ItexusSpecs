import { Typography } from "@mui/material"
import { Stack } from "@mui/system"
import CautionIcon from "public/assets/images/rfq/caution.svg"
export const TradeConfirmation = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.3}>
      <CautionIcon
        width={24}
        height={24}
      />
      <Typography>TRADE CONFIRMATION</Typography>
      <CautionIcon
        width={24}
        height={24}
      />
    </Stack>
  )
}
