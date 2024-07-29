
import { HistoryData } from "@/api/rfq-api/models/HistoryData"
import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed"
import { GenericAbortSignal } from "axios"
import moment from "moment"
import appAxios from "utils/axios"
import { GetHistoryDataRequest } from "./models/GetHistoryDataRequest"
import { RfqRequest } from "./models/RfqRequest"
import { RfqRawResponse } from "./models/RfqRawResponse"
import { PlaceOrderRequest } from "./models/PlaceOrderRequest"
import { CurrencyPair } from "./models/CurrencyPair"
import { RfqResponse } from "./models/RfqResponse"

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
    await appAxios.post(
      `/api/customers/placeorder`,
      {
        ...payload,
        transactTime: moment(payload.transactTime).utc().format("YYYY-MM-DD HH:mm:ss"),
        filledQty: payload.filledQty.toString(),
      },
      {
        signal: signal,
      },
    )
  },
  getCurrenciesPairs: async (): Promise<CurrencyPair[]> => {
    const response = await appAxios.get<{ Symbol: string }[]>(`/api/customers/pairs`)
    return response.data.map<CurrencyPair>(symbolData => {
      const splitedPair = symbolData.Symbol.split("-")
      return {
        symbol1: splitedPair[0],
        symbol2: splitedPair[1],
      }
    })
  },
  getHistoryData: async ({ accountNumber, fromDate, toDate }: GetHistoryDataRequest): Promise<HistoryDataParsed[]> => {
    const requestUrl =
      fromDate && toDate
        ? `/api/customers/order-history?accountNumber=${accountNumber}&startDate=${moment(fromDate).format("YYYY-MM-DD")}&endDate=${moment(toDate).format("YYYY-MM-DD")}`
        : `/api/customers/order-history?accountNumber=${accountNumber}`

    const response = await appAxios.get<HistoryData[]>(requestUrl)

    if (response?.data?.length === 0) {
      return []
    }

    const parsedData = mapHistoryData(response.data);

    return parsedData.reverse()
  },

  getExecutionHistoryData: async ({ accountNumber, fromDate, toDate }: GetHistoryDataRequest): Promise<HistoryDataParsed[]> => {
    const requestUrl =
      fromDate && toDate
        ? `/api/customers/execution-history?accountNumber=${accountNumber}&startDate=${moment(fromDate).format("YYYY-MM-DD")}&endDate=${moment(toDate).format("YYYY-MM-DD")}`
        : `/api/customers/execution-history?accountNumber=${accountNumber}`

    const response = await appAxios.get<HistoryData[]>(requestUrl)

    if (response?.data?.length === 0) {
      return []
    }

    const parsedData = mapHistoryData(response.data);

    return parsedData.reverse()
  },
}

const mapHistoryData = (items: HistoryData[]): HistoryDataParsed[] => {
  return items.map<HistoryDataParsed>(item => ({
    accountNum: item.accountNumber,
    QuoteID: "",
    RFQID: "",
    filledQty: item.qtyPlaced.toString(),
    id: item.exchangeOrderId,
    symbol: item.marketSymbol,
    transactTime: new Date(item.timeLastUpdated),
    side: item.instruction,
    filledPrice: item.priceSubmitted?.toString(),
    status: item.orderStatus,
  }))
}
