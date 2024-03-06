import { ITimeSeriesEvent } from "@dxfeed/api"
import { createSignal } from "@react-rxjs/utils";
import { Position } from "./useACF";
import { buildPositionSymbol } from "../utils";

export interface ICandleEvent extends ITimeSeriesEvent {
  eventTime: number;
  eventFlags: number;
  index: number;
  time: number;
  sequence: number;
  count: number;
  open: string;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  bidVolume: number;
  askVolume: number;
  impVolatility: number;
  openInterest: number;
}

export interface IQuoteEvent extends ITimeSeriesEvent {
  eventTime: number;
  sequence: number;
  timeNanoPart: number;
  bidTime: number;
  bidExchangeCode:string;
  bidPrice: number;
  bidSize: number;
  askTime: number;
  askExchangeCode: string;
  askPrice: number;
  askSize: number;
}

export interface ISummaryEvent extends ITimeSeriesEvent {
  eventTime: number;
  dayId: number;
  dayOpenPrice: number;
  dayHighPrice: number;
  dayLowPrice: number;
  dayClosePrice: number;
  dayClosePriceType: string;
  prevDayId: number;
  prevDayClosePrice: number;
  prevDayClosePriceType: string;
  prevDayVolume: number;
  openInterest: number;
}

export interface ITradeEvent extends ITimeSeriesEvent {
  eventTime: number;
  time: number;
  timeNanoPart: number;
  sequence: number;
  exchangeCode: string;
  price: number;
  change: number;
  changePercent: number;
  size: number;
  dayId: number;
  dayVolume: number;
  dayTurnover: number;
  tickDirection: string;
  extendedTradingHours: string;
}

export interface ISymbolSub {
  parentId: string;
  symbol: string;
}

export const [symbolSubChanged$, setSymbolSub] = createSignal<ISymbolSub>();
export const [symbolUnsubChanged$, setSymbolUnsub] = createSignal<ISymbolSub>();
export const [messagesChange$, setMessages] = createSignal<IQuoteEvent>();

export function formatPositionSymbols(position: Position): string[] {
  let formattedArray:string[] = [];

  if (position.is_valid_symbol && (position.trade_type !== "shares" ? position.is_valid_option : true)) {
    let greekFormatted = buildPositionSymbol(position);

    formattedArray.push(greekFormatted);

    if (position.trade_type !== "shares" && formattedArray.indexOf(buildPositionSymbol(position, true)) === -1) {
      formattedArray.push(buildPositionSymbol(position, true));
    }
  }

  return formattedArray;
}
