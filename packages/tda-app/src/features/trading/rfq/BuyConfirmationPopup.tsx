import MainCard, { MainCardProps } from "@/components/MainCard"
import { Stack, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import { FC } from "react"
import { TradeConfirmation } from "./TradeConfirmation"

type Props = Omit<MainCardProps, "children">  & {
  symbol1: string
  symbol2: string
  amount: number
  buyValue: number
  onAccept: () => void
  onDiscard: () => void
  side: "Buy" | "Sell"
}

export const BuyConfirmationPopup: FC<Props> = ({
  symbol1,
  symbol2,
  amount,
  buyValue,
  onAccept,
  onDiscard,
  side,
  sx,
  ...props
}) => {
  const invertedSide = side === "Buy" ? "Sell" : "Buy"
  return (
    <MainCard {...props} sx={{borderRadius: 2, ...sx}}>
      <Stack alignItems="center">
        <TradeConfirmation />
        <Typography mt={1} variant="body2" textAlign="center">
          {side} {amount.toLocaleString("en-US")} {symbol1} and ${invertedSide} {(buyValue * amount).toLocaleString("en-US")}{" "}
          {symbol2} (Notional Value) @ {buyValue.toFixed(6)}
        </Typography>
        <Stack mt={4}
          alignSelf="end"
          direction="row"
          gap={0.5}>
          <Button sx={{height: theme => theme.spacing(3.5)}} variant="text" onClick={onDiscard}>No</Button>
          <Button sx={{height: theme => theme.spacing(3.5)}} color="primary" variant="contained" onClick={onAccept}>Yes</Button>
        </Stack>
      </Stack>
    </MainCard>
  )
}
