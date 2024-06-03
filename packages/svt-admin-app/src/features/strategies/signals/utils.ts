import { v4 } from "uuid"
import { FifoSignalRow } from "./fifoSignalRow"

export const getNewFifoSignal = (): FifoSignalRow => ({
  id: v4(),
  atrMin: 0,
  atrMax: 0,
  formula1Start: 0,
  formula2Start: 0,
  formula1Slope: 0,
  formula2Slope: 0,
  masterSymbol: "/ES",
  stopMultiple: 0,
  targetMultiple: 0,
  tickAtrMEffect: 0,
  tickAtrMultiple: 0,
  tickBase: 0,
  tickResetPercent: 0,
})
