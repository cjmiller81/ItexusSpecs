import { Box, Card, TextField, Typography } from "@mui/material"
import { BoxProps, Stack } from "@mui/system"
import { Status } from "components"
import * as React from "react"
import { BuySellCell, ExpiredLabel } from "./BuySellCell"
import { ProgressFooter } from "./ProgressBar"
import { RfqButton, RfqStage } from "./RfqButton"

type TileProps = BoxProps & {
  symbol1: string | null
  symbol2: string | null
  sellCellValue?: number
  buyCellValue?: number
  stage: RfqStage
  statusFetchingRfq: Status
  amount: number
  progress: number
  secondsLeft: number
  onInitiateRfq: () => void
  onReject: () => void
  onAmountChange: (amount: number) => void
  onSellClick: () => void
  onBuyClick: () => void
}

const Tile: React.FC<TileProps> = ({
  symbol1,
  symbol2,
  sellCellValue,
  buyCellValue,
  amount,
  progress,
  secondsLeft,
  stage: rfqButtonState,
  onReject,
  onAmountChange,
  onSellClick,
  onBuyClick,
  statusFetchingRfq,
  onInitiateRfq,
  ...props
}) => {
  return (
    <Box {...props}>
      <Card sx={{ p: 2 }}>
        <Stack alignItems="center">
          <Typography>{`${symbol1 ?? ""}/${symbol2 ?? ""}`}</Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%">
            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between">
              <Stack alignItems="center">
                <BuySellCell
                  cellType="sell"
                  onCellClick={onSellClick}
                  isExpired={rfqButtonState === "requote"}
                  title="SELL"
                  isRequesting={statusFetchingRfq === "loading"}
                  value={sellCellValue}
                />
              </Stack>
              <Stack alignItems="center">
                <RfqButton
                  disabled={!symbol1 || !symbol2 || !amount}
                  sx={{
                    height: "60px",
                    ":disabled": {
                      bgcolor: theme => theme.palette.grey[400],
                    },
                  }}
                  loading={statusFetchingRfq === "loading" || rfqButtonState === "inProgress"}
                  stage={rfqButtonState}
                  onInitiateRFQ={onInitiateRfq}
                  onCancel={onReject}
                  onRequote={onReject}
                />
                {rfqButtonState === "requote" && <ExpiredLabel />}
              </Stack>
              <Stack alignItems="center">
                <BuySellCell
                  cellType="buy"
                  contentAlignment="end"
                  onCellClick={onBuyClick}
                  isExpired={rfqButtonState === "requote"}
                  title="BUY"
                  isRequesting={statusFetchingRfq === "loading"}
                  value={buyCellValue}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack
            mt={8}
            alignItems="center"
            direction="row"
            gap={theme => theme.spacing(1)}>
            <TextField
              label={symbol1}
              placeholder="1,000,000"
              disabled={rfqButtonState !== "requiring"}
              value={amount}
              type="number"
              onChange={e => onAmountChange(parseFloat(e.target.value))}
            />
          </Stack>
          <ProgressFooter
            sx={{ mt: 5 }}
            secondsLeft={secondsLeft}
            progress={progress}
            handleReject={onReject}
          />
        </Stack>
      </Card>
    </Box>
  )
}

export default Tile
