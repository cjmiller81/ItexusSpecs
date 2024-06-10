import { rfqApi } from "@/api/rfqApi"
import { openSnackbar } from "@/api/snackbar"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { clearRfq, fetchHistoryData, fetchRfq } from "@/slices/rfqSlice"
import { SnackbarProps } from "@/types/snackbar"
import { Stack, Typography } from "@mui/material"
import { SnackbarOrigin } from "@mui/material/Snackbar"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { v4 } from "uuid"
import CurrencyDropdown from "../../../components/RfqTile/CurrencyDropdown"
import Tile from "../../../components/RfqTile/Tile"
import { currencyBuying, currencySelling } from "../../../components/RfqTile/currencies"
import RFQTable from "../../../components/RfqTile/rfqTable"

export const accountNumber = "EC_TEST";

export default function SpotRFQPage() {
  const [symbol1, setSymbol1] = useState<string | null>("USDT")
  const [symbol2, setSymbol2] = useState<string | null>("USD")
  const [toDate, setToDate] = React.useState<Date | null>(moment().add(1, "d").toDate())
  const [fromDate, setFromDate] = React.useState<Date | null>(moment().add(-1, "M").toDate())
  const { rfqModel, statusFetchingRfq, historyData } = useAppSelector(state => state.rfq)
  const dispatch = useAppDispatch()
  const placeAbortableController = useRef<AbortController>(new AbortController())
  const rfqAbortableController = useRef<AbortController>(new AbortController())
  const [amount, setAmount] = useState(1000.0)

  const notificationAlignment: SnackbarOrigin = {
    vertical: "top",
    horizontal: "center",
  }

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }

    getHistoryData()
  }, [])

  const addQuote = async (tradeSide: "Buy" | "Sell") => {
    if (!rfqModel || !symbol1 || !symbol2) return

    if (placeAbortableController.current) {
      placeAbortableController.current.abort("Request canceled")
    }

    placeAbortableController.current = new AbortController()

    await rfqApi.placeOrder(
      {
        transactTime: new Date(),
        symbol: rfqModel.Symbol,
        side: tradeSide,
        filledQty: amount,
        accountNum: accountNumber,
        status: "Open",
        QuoteID: rfqModel.QuoteID,
        RFQID: rfqModel.RFQID,
      },
      placeAbortableController.current.signal,
    )
    getHistoryData()
    let totalAmount = rfqModel.BidPx * amount
    let totalAmountFormatted = totalAmount.toLocaleString("en-US")
    let formattedAmount = amount.toLocaleString("en-US")

    const snackBarMessage =
      tradeSide === "Buy"
        ? `You have Bought ${formattedAmount} ${symbol1} and Sold ${totalAmountFormatted} ${symbol2} (Notional Value) at a Rate of ${rfqModel.BidPx}`
        : `You have Sold ${formattedAmount} ${symbol1} and Bought ${totalAmountFormatted} ${symbol2} (Notional Value) at a Rate of ${rfqModel.BidPx}`

    openSnackbar({
      open: true,
      message: snackBarMessage,
      variant: "alert",
      autoHideDuration: 5000,
      anchorOrigin: notificationAlignment,
      alert: {
        variant: "outlined",
        color: "primary",
      },
    } as SnackbarProps)

    showNotification(tradeSide, symbol1, symbol2, amount.toString(), rfqModel.BidPx.toString(), v4())
  }

  const handleInitiateRFQ = async () => {
    if (amount <= 0 || !(symbol1 && symbol2)) return
    dispatch(
      fetchRfq({
        currency: symbol1,
        firstSymbol: symbol1,
        qty: amount,
        secondSymbol: symbol2,
        signal: rfqAbortableController.current.signal,
      }),
    )
  }

  const showNotification = (
    side: "Buy" | "Sell",
    symbol1: string,
    symbol2: string,
    qty: string,
    priceString: string,
    id: string,
  ) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    const options: NotificationOptions = {
      body: `${side} ${symbol1} ${qty} vs ${symbol2} @ ${priceString}`,
      icon: "https://tda-gui-v2.vercel.app/static/images/dark.png?auto=compress&cs=tinysrgb&dpr=1&w=500",
      dir: "ltr",
    }

    new Notification(`Trade Accepted: ID ${id}`, options)
  }

  const getHistoryData = async () => {
    if(fromDate && toDate)
    handleHistoryRequest(fromDate, toDate)
  }

  const handleHistoryRequest = (fromDate: Date, toDate: Date) => {
    dispatch(fetchHistoryData({ accountNumber: accountNumber, fromDate, toDate }))
  }

  return (
    <Stack alignItems="center">
      <Typography
        variant="h5"
        noWrap
        align="center">
        Request for Quote Portal
      </Typography>
      <Typography
        variant="body2"
        align="center">
        Click Initiate RFQ to instantly receive a quote
      </Typography>

      <Stack sx={{ width: "50%", minWidth: "500px", mt: 3 }}>
        <CurrencyDropdown
          mt={1}
          symbol1={symbol1}
          symbol2={symbol2}
          options1={currencySelling}
          options2={currencyBuying}
          handleSymbolOne={symbol => setSymbol1(symbol)}
          handleSymbolTwo={symbol => setSymbol2(symbol)}
        />

        <Tile
          mt={2}
          onClear={() => dispatch(clearRfq())}
          symbol1={symbol1}
          symbol2={symbol2}
          amount={amount}
          onAmountChange={value => setAmount(value)}
          onInitiateRfq={handleInitiateRFQ}
          rfqModel={rfqModel}
          statusFetchingRfq={statusFetchingRfq}
          handleBuy={() => addQuote("Buy")}
          handleSell={() => addQuote("Sell")}
        />
      </Stack>
      <RFQTable
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        mt={5}
        rows={historyData}
        handleHistoryRequest={handleHistoryRequest}
      />
    </Stack>
  )
}
