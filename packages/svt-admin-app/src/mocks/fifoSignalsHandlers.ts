import { FifoSignal } from "@/features/strategies/signals/fifoSignal"
import { http, HttpResponse, RequestHandler } from "msw"
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from "msw/lib/core/handlers/RequestHandler"

const mockState: {
  fifoSignals: FifoSignal[]
} = {
  fifoSignals: [],
}

export const fifoSignalsHandlers: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>[] = [
  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoSignal`, () => {
    return HttpResponse.json(mockState.fifoSignals)
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoSignal/:id`, async ({ request }) => {
    const fifoSignal = (await request.json()) as FifoSignal

    const existedSignalIndex = mockState.fifoSignals.findIndex(
      signal =>
        signal.masterSymbol === fifoSignal.masterSymbol && signal.tickAtrMultiple === fifoSignal.tickAtrMultiple,
    )
    if (existedSignalIndex === -1) mockState.fifoSignals.push(fifoSignal)
    else mockState.fifoSignals.splice(existedSignalIndex, 1, fifoSignal)
  }),

  http.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoSignal/:id`, ({ params }) => {
    const { id } = params
    const decodedId = decodeURIComponent(id as string)
    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.fifoSignals = mockState.fifoSignals.filter(
      signal => signal.masterSymbol !== splitedId[0] || signal.tickAtrMultiple !== Number(splitedId[1]),
    )
  }),
]
