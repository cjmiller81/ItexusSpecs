import { IFifoTradeInstruments } from "@/features/strategies/tradeInstruments/iFifoTradeInstruments"
import { http, HttpResponse, RequestHandler } from "msw"
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from "msw/lib/core/handlers/RequestHandler"

const mockState: {
  fifoTradeInstruments: IFifoTradeInstruments[]
} = {
  fifoTradeInstruments: [
    {
      "atrPeriod": 1.28,
      "masterSymbol": "/ES",
      "masterTickATRMultiple": 1.23,
      "tradeSymbol": "/ES",
      "targetMultiple": 1.22,
      "stopMultiple": 1.23
    },
    {
      "atrPeriod": 1.23,
      "masterSymbol": "/ES",
      "masterTickATRMultiple": 1.23,
      "tradeSymbol": "SPY",
      "targetMultiple": 1.23,
      "stopMultiple": 1.23
    },
    {
      "atrPeriod": 1.44,
      "masterSymbol": "/ES",
      "masterTickATRMultiple": 1.45,
      "tradeSymbol": "/NQ",
      "targetMultiple": 1.46,
      "stopMultiple": 1.47
    }
  ],
}

export const fifoTradeInstrumentsHandlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = [
  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoExecution`, () => {
    return HttpResponse.json(mockState.fifoTradeInstruments)
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoExecution/:id`, async ({ request }) => {
    const fifoTradeInstruments = (await request.json()) as IFifoTradeInstruments

    const existedTradeInstrumentsIndex = mockState.fifoTradeInstruments.findIndex(
      tradeInstrument =>
        tradeInstrument.masterSymbol === fifoTradeInstruments.masterSymbol && tradeInstrument.targetMultiple === fifoTradeInstruments.targetMultiple,
    )
    if (existedTradeInstrumentsIndex === -1) mockState.fifoTradeInstruments.push(fifoTradeInstruments)
    else mockState.fifoTradeInstruments.splice(existedTradeInstrumentsIndex, 1, fifoTradeInstruments)
  }),

  http.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoExecution/:id`, ({ params }) => {
    const { id } = params
    const decodedId = decodeURIComponent(id as string)
    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.fifoTradeInstruments = mockState.fifoTradeInstruments.filter(
      tradeInstrument => tradeInstrument.masterSymbol !== splitedId[0] || tradeInstrument.masterTickATRMultiple !== Number(splitedId[1]),
    )
  }),
]
