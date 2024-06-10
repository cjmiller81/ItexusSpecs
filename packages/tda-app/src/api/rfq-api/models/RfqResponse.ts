export interface RfqResponse {
  OfferPx: number
  OrderQty: number
  QuoteID: string
  QuoteReqID: string
  QuoteStatus: "Open" | "Rejected"
  RFQID: string
  Symbol: string
  Timestamp: Date
  User: string
  ValidUntilTime: Date
  BidPx: number
}
