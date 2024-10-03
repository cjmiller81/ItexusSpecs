import { IFifoUser } from "@/features/strategies/users/iFifoUser"
import MockAdapter from "axios-mock-adapter"
import { initBots, initFifoUsers, initOpenPosition, initOrders } from "./initFifoUsers"
import { Order } from "@/features/strategies/users/details/order"
import { Bot } from "@/features/strategies/users/details/bot"
import { OpenPosition } from "@/features/strategies/users/details/openPosition"
/* eslint-disable no-useless-escape */

const mockState: {
  fifoUsers: IFifoUser[],
  bots: Bot[],
  orders: Order[],
  openPositions: OpenPosition[] 
} = {
  fifoUsers: initFifoUsers,
  bots: initBots,
  orders: initOrders,
  openPositions: initOpenPosition
}

export function configureFifoUsersMock(mock: MockAdapter) {
  mock.onGet(`${process.env.API_BASE_URL}\/api\/fifo\/users`).reply(() => {

    return [200, mockState.fifoUsers]
  })

  const getBotRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/bots`)
  mock.onGet(getBotRegExp).reply(() => {
    return [200, mockState.bots]
  })
  const getOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/orders`)
  mock.onGet(getOrdersRegExp).reply(() => {
    return [200, mockState.orders]
  })
  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/([^/]+)\/open-positions`) 
  mock.onGet(getOpenPositionsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.openPositions.filter(position => position.userId === userId)]
  })
  // eslint-disable-next-line
  const putUserRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/fifo\/users\/*`)
  mock.onPut(putUserRegExp).reply(config => {
    const fifoUser = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]

    const existedSignalIndex = mockState.fifoUsers.findIndex(user => id === user.id)

    if (existedSignalIndex !== -1) mockState.fifoUsers.splice(existedSignalIndex, 1, fifoUser)
    return [200]
  })

  mock.onDelete(putUserRegExp).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)

    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.fifoUsers = mockState.fifoUsers.filter(signal => signal.id !== splitedId[0])

    return [200]
  })

  return mock
}
