import { v4 } from "uuid"
import { TradeInstrumentsRow } from "./tradeInstrumentsRow"

export const getNewFifoTradeInstruments = (): TradeInstrumentsRow => ({
  id: v4(),
  masterSymbol: "/ES",
  masterTickAtrMultiple: 0,
  atrPeriod: 0,
  tradeSymbol: 0,
  targetMultiple: 0,
  stopMultiple: 0,
})
