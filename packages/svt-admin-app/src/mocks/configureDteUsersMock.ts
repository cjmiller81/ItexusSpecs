import MockAdapter from "axios-mock-adapter"
import { IDteStrategiesResponse } from "@/features/strategies/dte/users/types"
import { initBots, initCurrentDayFills, initDteUsers, initOpenPosition, initWorkingOrders } from "./initDteUsers"
import { Bot } from "@/features/strategies/dte/users/details/bot"
import { OpenPosition } from "@/features/strategies/users/details/openPosition"
import { IWorkingOrder } from "@/features/strategies/dte/users/details/workingOrderInterface"
import { ICurrentDayFills } from "@/features/strategies/dte/users/details/currentDayFillsInterface"
/* eslint-disable no-useless-escape */

const mockState: {
  dteUsers: IDteStrategiesResponse,
  bots: Bot[],
  openPositions: OpenPosition[],
  workingOrders: IWorkingOrder[],
  currentDayFills: ICurrentDayFills[]
} = {
  dteUsers: initDteUsers,
  bots: initBots,
  openPositions: initOpenPosition,
  workingOrders: initWorkingOrders,
  currentDayFills: initCurrentDayFills
}

export function configureDteUsersMock(mock: MockAdapter) {
  mock.onGet(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy`).reply(() => {
    return [200, mockState.dteUsers]
  })

  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/([^/]+)\/open-positions`) 
  mock.onGet(getOpenPositionsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.openPositions.filter(position => position.userId === userId)]
  })

  const currentDayFillsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/([^/]+)\/current-day-fills`);
  mock.onGet(currentDayFillsRegExp).reply(() => {
    return [200, mockState.currentDayFills];
  });

  const getWorkingOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/([^/]+)\/working-orders`);
  mock.onGet(getWorkingOrdersRegExp).reply(() => {
    return [200, mockState.workingOrders];
  });

  // eslint-disable-next-line
  const putUserRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/*`)
  mock.onPut(putUserRegExp).reply(config => {
    const fifoUser = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]

    const existedSignalIndex = mockState.dteUsers.strategies.findIndex(user => id === user.userId)
    if (existedSignalIndex !== -1) mockState.dteUsers.strategies.splice(existedSignalIndex, 1, fifoUser)
    return [200]
  })

  const getBotRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/([^/]+)\/bots`)
  mock.onGet(getBotRegExp).reply(() => {
    return [200, mockState.bots]
  })

  mock.onDelete(putUserRegExp).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)

    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.dteUsers.strategies = mockState.dteUsers.strategies.filter(signal => signal.userId !== splitedId[0])

    return [200]
  })

  return mock
}