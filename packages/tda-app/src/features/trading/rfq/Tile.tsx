import { openSnackbar } from "@/api/snackbar"
import { usePrevious } from "@/hooks/usePrevious"
import { SnackbarProps } from "@/types/snackbar"
import { Box, Card, TextField, Typography } from "@mui/material"
import { BoxProps, Stack } from "@mui/system"
import { Status } from "components"
import * as React from "react"
import { useEffect, useState } from "react"
import useCountDown from "react-countdown-hook"
import { BuyConfirmationPopup } from "./BuyConfirmationPopup"
import { BuySellCell, ExpiredLabel } from "./BuySellCell"
import { ProgressFooter } from "./ProgressBar"
import { RfqButton, RfqButtonState } from "./RfqButton"
import { RfqResponse } from "@/api/rfq-api/models/RfqResponse"

interface TileProps {
  symbol1: string | null
  symbol2: string | null
  onInitiateRfq: () => void
  rfqModel: RfqResponse | null
  statusFetchingRfq: Status
  amount: number
  onAmountChange: (amount: number) => void
  onClear: () => void
  handleSell: () => void
  handleBuy: () => void
}
const Tile: React.FC<TileProps & BoxProps> = ({
  symbol1,
  symbol2,
  amount,
  handleSell,
  handleBuy,
  onClear,
  onAmountChange,
  rfqModel,
  statusFetchingRfq,
  onInitiateRfq,
  ...props
}) => {
  const [timeLeft, { start, reset }] = useCountDown(10000, 100)
  const secondsLeft = timeLeft / 1000
  const prevSecondsLeft = usePrevious(secondsLeft)
  const [showBuyConfirmationPopup, setShowBuyConfirmationPopup] = useState<boolean>(false)
  const [showSellConfirmationPopup, setShowSellConfirmationPopup] = useState<boolean>(false)

  const currentStage: RfqButtonState = !rfqModel
    ? "requiring"
    : secondsLeft <= 1 && prevSecondsLeft && prevSecondsLeft > 0
      ? "requote"
      : "cancelable"

  const handleReject = () => {
    setShowSellConfirmationPopup(false)
    setShowBuyConfirmationPopup(false)
    reset()
    onClear()
  }

  const handleSellAddRow = () => {
    handleSell()
    handleReject()
  }

  const handleBuyAddRow = () => {
    handleBuy()
    handleReject()
  }

  useEffect(() => {
    if (statusFetchingRfq === "failed") {
      handleReject()
    }
  }, [statusFetchingRfq])

  useEffect(() => {
    if (rfqModel && timeLeft === 0 && prevSecondsLeft && prevSecondsLeft > 0) {
      handleReject()
    }
  }, [timeLeft, rfqModel])

  useEffect(() => {
    if (statusFetchingRfq === "idle" && rfqModel) {
      setShowSellConfirmationPopup(false)
      setShowBuyConfirmationPopup(false)
      start()
    }
  }, [statusFetchingRfq, rfqModel])

  useEffect(() => {
    if (!rfqModel) return

    if (rfqModel.QuoteStatus === "Rejected") {
      openSnackbar({
        open: true,
        message: "!! ORDER REQUEST HAS BEEN REJECTED !!",
        variant: "alert",
        alert: {
          variant: "outlined",
          color: "warning",
        },
      } as SnackbarProps)
    }
  }, [rfqModel])

  const handleInitiateRFQ = () => {
    onInitiateRfq()
    setShowSellConfirmationPopup(false)
    setShowBuyConfirmationPopup(false)
  }

  const handleCancelRequest = async () => {
    reset()
    onClear()
  }

  const handleBuyPopupYes = () => {
    handleBuyAddRow()
    handleBuyPopupNo()
    handleReject()
  }

  const handleBuyPopupNo = () => {
    setShowBuyConfirmationPopup(false)
  }

  const handleSellPopupYes = () => {
    handleSellAddRow()
    handleSellPopupNo()
    handleReject()
  }

  const handleSellPopupNo = () => {
    setShowSellConfirmationPopup(false)
  }

  return (
    <Box {...props}>
      {rfqModel && showBuyConfirmationPopup && symbol1 && symbol2 && (
        <BuyConfirmationPopup
          sx={{ width: "400px", position: "absolute", right: 0 }}
          amount={amount}
          buyValue={rfqModel.OfferPx}
          symbol1={symbol1}
          symbol2={symbol2}
          onAccept={handleBuyPopupYes}
          onDiscard={handleBuyPopupNo}
        />
      )}

      {rfqModel && showSellConfirmationPopup && symbol1 && symbol2 && (
        <BuyConfirmationPopup
          sx={{ width: "400px", position: "absolute", left: 0 }}
          amount={amount}
          buyValue={rfqModel.OfferPx}
          symbol1={symbol1}
          symbol2={symbol2}
          onAccept={handleSellPopupYes}
          onDiscard={handleSellPopupNo}
        />
      )}

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
                  onCellClick={() => {
                    setShowSellConfirmationPopup(true)
                    setShowBuyConfirmationPopup(false)
                  }}
                  isExpired={currentStage === "requote"}
                  title="SELL"
                  isRequesting={statusFetchingRfq === "loading"}
                  value={rfqModel?.BidPx}
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
                  loading={statusFetchingRfq === "loading"}
                  stage={currentStage}
                  onInitiateRFQ={handleInitiateRFQ}
                  onCancel={handleCancelRequest}
                  onRequote={handleReject}
                />
                {currentStage === "requote" && <ExpiredLabel />}
              </Stack>
              <Stack alignItems="center">
                <BuySellCell
                  cellType="buy"
                  contentAlignment="end"
                  onCellClick={() => {
                    setShowBuyConfirmationPopup(true)
                    setShowSellConfirmationPopup(false)
                  }}
                  isExpired={currentStage === "requote"}
                  title="BUY"
                  isRequesting={statusFetchingRfq === "loading"}
                  value={rfqModel?.OfferPx}
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
              disabled={currentStage !== "requiring"}
              value={amount}
              type="number"
              onChange={e => onAmountChange(parseFloat(e.target.value))}
            />
          </Stack>
          <ProgressFooter
            sx={{ mt: 5 }}
            secondsLeft={secondsLeft}
            totalSeconds={10}
            handleReject={handleReject}
          />
        </Stack>
      </Card>
    </Box>
  )
}

export default Tile
