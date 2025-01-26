export type PlaceOrderRequest = {
  transactTime: Date
  symbol: string
  side: string
  filledQty: number | string
  accountNum: string
  status: string
  QuoteID: string
  RFQID: string
}