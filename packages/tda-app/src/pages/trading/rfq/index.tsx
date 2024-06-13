import CurrencyDropdown from "@/features/trading/rfq/CurrencyDropdown"
import { TileSection } from "@/features/trading/rfq/TileSection"
import RFQTable from "@/features/trading/rfq/rfqTable"
import { fetchPairs } from "@/features/trading/rfq/slices/currenciesSlice"
import { fetchHistoryData } from "@/features/trading/rfq/slices/rfqSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Stack, Typography } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"

export const accountNumber = "EC_TEST"

export default function SpotRFQPage() {
  const [symbol1, setSymbol1] = useState<string | null>(null)
  const [symbol2, setSymbol2] = useState<string | null>(null)
  const [toDate, setToDate] = useState<Date | null>(moment().add(1, "d").toDate())
  const [fromDate, setFromDate] = useState<Date | null>(moment().add(-1, "M").toDate())
  const { historyData } = useAppSelector(state => state.rfq)
  const { pairs, statusFetchingPairs } = useAppSelector(state => state.currencies)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }

    getHistoryData()
    dispatch(fetchPairs({}))
  }, [])

  const getHistoryData = async () => {
    if (fromDate && toDate) handleHistoryRequest(fromDate, toDate)
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
          pairs={pairs}
          onSymbol1Change={symbol => setSymbol1(symbol)}
          onSymbol2Change={symbol => setSymbol2(symbol)}
        />

        <TileSection
          symbol1={symbol1}
          symbol2={symbol2}
          accountNumber={accountNumber}
          onUpdateHistory={getHistoryData}
          mt={2}
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
