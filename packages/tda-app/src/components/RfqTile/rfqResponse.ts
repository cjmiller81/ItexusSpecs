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

export interface RfqRawResponse {
  OfferPx: string
  OrderQty: string
  QuoteID: string
  QuoteReqID: string
  QuoteStatus: "Open" | "Rejected"
  RFQID: string
  Symbol: string
  Timestamp: string
  User: string
  ValidUntilTime: string
  BidPx: string
}
