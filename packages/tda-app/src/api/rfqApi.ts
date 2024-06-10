import { HistoryData } from "@/components/RfqTile/HistoryData"
import { HistoryDataParsed } from "@/components/RfqTile/HistoryDataParsed"
import { RfqRawResponse, RfqResponse } from "@/components/RfqTile/rfqResponse"
import { GenericAbortSignal } from "axios"
import moment from "moment"
import appAxios from "utils/axios"

export type RfqRequest = {
  firstSymbol: string
  secondSymbol: string
  currency: string
  qty: number
  signal: GenericAbortSignal
}

export type GetHistoryDataRequest = {
  accountNumber: string
  fromDate?: Date
  toDate?: Date
}

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

export const rfqApi = {
  getRfq: async ({ firstSymbol, secondSymbol, currency, qty, signal }: RfqRequest): Promise<RfqResponse[]> => {
    const { data } = await appAxios.get<RfqRawResponse[]>(
      `/api/customers/rfq?symbol=${firstSymbol}-${secondSymbol}&currency=${currency}&orderQty=${qty}`,
      {
        signal: signal,
      },
    )

    const parsedData = data.map<RfqResponse>(item => ({
      OfferPx: parseFloat(item.OfferPx),
      OrderQty: parseFloat(item.OrderQty),
      QuoteID: item.QuoteID,
      QuoteReqID: item.QuoteReqID,
      QuoteStatus: item.QuoteStatus,
      RFQID: item.RFQID,
      Symbol: item.Symbol,
      Timestamp: new Date(item.Timestamp),
      User: item.User,
      ValidUntilTime: new Date(item.ValidUntilTime),
      BidPx: parseFloat(item.BidPx),
    }))

    return parsedData
  },
  placeOrder: async (payload: PlaceOrderRequest, signal: GenericAbortSignal): Promise<void> => {
    await appAxios.post(`${process.env.BACKEND_API_URL}/api/customers/placeorder`, {
      ...payload,
      transactTime: moment(payload.transactTime).utc().format('YYYY-MM-DD HH:mm:ss'),
      filledQty: payload.filledQty.toString()
    }, {
      signal: signal,
    })
  },
  getHistoryData: async ({ accountNumber, fromDate, toDate }: GetHistoryDataRequest): Promise<HistoryDataParsed[]> => {
    const requestUrl =
      fromDate && toDate
        ? `${process.env.BACKEND_API_URL}/api/customers/order-history?accountNumber=${accountNumber}&startDate=${moment(fromDate).format("YYYY-MM-DD")}&endDate=${moment(toDate).format("YYYY-MM-DD")}`
        : `${process.env.BACKEND_API_URL}/api/customers/order-history?accountNumber=${accountNumber}`

    const response = await appAxios.get<HistoryData[]>(requestUrl)

    if (response?.data?.length === 0) {
      return []
    }

    const parsedData = response.data.map<HistoryDataParsed>(item => ({
      accountNum: item.accountNumber,
      QuoteID: "",
      RFQID: "",
      filledQty: item.qtyPlaced.toString(),
      id: item.exchangeOrderId,
      symbol: item.marketSymbol,
      transactTime: new Date(item.timeLastUpdated),
      side: item.instruction,
      filledPrice: item.priceSubmitted.toString(),
      status: item.orderStatus,
    }))

    return parsedData.reverse()
  },
}
