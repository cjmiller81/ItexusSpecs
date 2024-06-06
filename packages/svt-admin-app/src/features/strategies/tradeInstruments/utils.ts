import { v4 } from "uuid"
import { TradeInstrumentsRow } from "./tradeInstrumentsRow"

export const getNewFifoTradeInstruments = (): TradeInstrumentsRow => ({
  id: v4(),
  masterSymbol: "/ES",
  masterTickATRMultiple: 0,
  atrPeriod: 0,
  tradeSymbol: "/ES",
  targetMultiple: 0,
  stopMultiple: 0,
})
