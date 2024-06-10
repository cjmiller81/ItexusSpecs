import { GenericAbortSignal } from "axios"

export type RfqRequest = {
  firstSymbol: string
  secondSymbol: string
  currency: string
  qty: number
  signal: GenericAbortSignal
}
