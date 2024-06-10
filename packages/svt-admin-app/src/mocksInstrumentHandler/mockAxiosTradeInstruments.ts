import { IFifoTradeInstruments } from "@/features/strategies/tradeInstruments/iFifoTradeInstruments"
import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"

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

export function configureAxiosTIMocks(mock: MockAdapter) {
  mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoExecution`).reply((config) => {
    return [200, mockState.fifoTradeInstruments]
  })

  const getSplitedId = (decodedId: string): string[] => {
    const parts = decodedId.split('.');
    const firstPart = parts[0];
    const secondPart = parts[1];
    const thirdPart = parts.slice(2).join('.');
    return [firstPart, secondPart, thirdPart];
  }

  // eslint-disable-next-line
  const pathRegex = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/fifoExecution\/*`)

  mock.onPost(pathRegex).reply(config => {

    const fifoTradeInstruments = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)
    const splitedId = getSplitedId(decodedId)
    const existedSignalIndex = mockState.fifoTradeInstruments.findIndex(
      tradeInstrument =>
        tradeInstrument.masterSymbol === splitedId[0] && tradeInstrument.tradeSymbol === splitedId[1] && tradeInstrument.atrPeriod === parseFloat(splitedId[2])
    )
    if (existedSignalIndex === -1) mockState.fifoTradeInstruments.push(fifoTradeInstruments)
    else mockState.fifoTradeInstruments.splice(existedSignalIndex, 1, fifoTradeInstruments)
    return [200]
  })

  mock.onDelete(pathRegex).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)
    const splitedId = getSplitedId(decodedId)

    mockState.fifoTradeInstruments = mockState.fifoTradeInstruments.filter(
      tradeInstrument =>
        !(tradeInstrument.masterSymbol === splitedId[0] && tradeInstrument.tradeSymbol === splitedId[1] && tradeInstrument.atrPeriod === parseFloat(splitedId[2]))
    )
    return [200]
  })
}
