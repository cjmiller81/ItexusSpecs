import { HistoryData } from "@/api/rfq-api/models/HistoryData";
import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed";
import { GenericAbortSignal } from "axios";
import moment from "moment";
import appAxios from "utils/axios";
import { GetHistoryDataRequest } from "./models/GetHistoryDataRequest";
import { RfqRequest } from "./models/RfqRequest";
import { RfqRawResponse } from "./models/RfqRawResponse";
import { PlaceOrderRequest } from "./models/PlaceOrderRequest";
import { CurrencyPair } from "./models/CurrencyPair";
import { RfqResponse } from "./models/RfqResponse";
import CurrencyPairRaw from "./models/CurrencyPairRaw";

const transformHistoryData = (items: HistoryData[]): HistoryDataParsed[] => {
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
  }));
};

export const rfqApi = {
  getRfq: async ({ firstSymbol, secondSymbol, currency, qty, signal }: RfqRequest): Promise<RfqResponse[]> => {
    const { data } = await appAxios.get<RfqRawResponse[]>(
      `/api/customers/rfq?symbol=${firstSymbol}-${secondSymbol}&currency=${currency}&orderQty=${qty}`,
      {
        signal: signal,
      },
    );

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
      InternalText: item.InternalText,
    }));

    return parsedData;
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
    );
  },

  getCurrenciesPairs: async (): Promise<CurrencyPair[]> => {
    const response = await appAxios.get<CurrencyPairRaw[]>(`/api/customers/pairs`);
    return response.data.map<CurrencyPair>(pair => {
      const splitedPair = pair.Symbol.split("-");
      return {
        symbol1: splitedPair[0],
        symbol2: splitedPair[1],
        minSize: pair.MinimumSize ? parseFloat(pair.MinimumSize) : undefined,
        maxSize: pair.MaximumSize ? parseFloat(pair.MaximumSize) : undefined,
      };
    });
  },

  getHistoryData: async ({ accountNumber, fromDate, toDate }: GetHistoryDataRequest): Promise<HistoryDataParsed[]> => {
    const requestURL =
      fromDate && toDate
        ? `/api/customers/order-history?accountNumber=${accountNumber}&startDate=${moment(fromDate).format("YYYY-MM-DD")}&endDate=${moment(toDate).format("YYYY-MM-DD")}`
        : `/api/customers/order-history?accountNumber=${accountNumber}`;

    const response = await appAxios.get<HistoryData[][]>(requestURL);

    const flattenedHistory = response?.data?.flat() || [];

    if (flattenedHistory.length === 0) {
      return [];
    }

    const parsedData = transformHistoryData(flattenedHistory);

    return parsedData.reverse();
  },

  getExecutionHistoryData: async ({
    accountNumber,
    fromDate,
    toDate,
  }: GetHistoryDataRequest): Promise<HistoryDataParsed[]> => {
    const requestURL =
      fromDate && toDate
        ? `/api/customers/execution-history?accountNumber=${accountNumber}&startDate=${moment(fromDate).format("YYYY-MM-DD")}&endDate=${moment(toDate).format("YYYY-MM-DD")}`
        : `/api/customers/execution-history?accountNumber=${accountNumber}`;

    const response = await appAxios.get<{ aCount: number; history: HistoryData[] }>(requestURL);

    const flattenedHistory = response?.data?.history?.flat() || [];

    if (flattenedHistory.length === 0) {
      return [];
    }

    const parsedData = transformHistoryData(flattenedHistory);

    return parsedData.reverse();
  },
};
