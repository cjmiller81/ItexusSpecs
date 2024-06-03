import { FifoSignal } from "@/features/strategies/signals/fifoSignal"
import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"

const mockState: {
  fifoSignals: FifoSignal[]
} = {
  fifoSignals: [],
}

export function configureAxiosMocks(axios: AxiosInstance) {
  const mock = new MockAdapter(axios)
  mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fifoSignal`).reply(() => {
    return [200, mockState.fifoSignals]
  })

  // eslint-disable-next-line
  const pathRegex = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/fifoSignal\/*`)
  mock.onPost(pathRegex).reply(config => {
    const fifoSignal = JSON.parse(config.data)

    const existedSignalIndex = mockState.fifoSignals.findIndex(
      signal =>
        signal.masterSymbol === fifoSignal.masterSymbol && signal.tickAtrMultiple === fifoSignal.tickAtrMultiple,
    )
    if (existedSignalIndex === -1) mockState.fifoSignals.push(fifoSignal)
    else mockState.fifoSignals.splice(existedSignalIndex, 1, fifoSignal)
    return [200]
  })

  mock.onDelete(pathRegex).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)

    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.fifoSignals = mockState.fifoSignals.filter(
      signal => signal.masterSymbol !== splitedId[0] || signal.tickAtrMultiple !== Number(splitedId[1]),
    )

    return [200]
  })

  return mock
}
