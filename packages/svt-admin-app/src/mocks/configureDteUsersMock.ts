import MockAdapter from "axios-mock-adapter"
import { IDteStrategiesResponse, StrategyBot, StrategyBotList } from "@/features/strategies/dte/users/types"
import { initBotStrategiesList, initCurrentDayFills, initDteUsers, initOpenPosition, initWorkingOrders } from "./initDteUsers"
import { OpenPosition } from "@/features/strategies/users/details/openPosition"
import { IWorkingOrder } from "@/features/strategies/dte/users/details/workingOrderInterface"
import { ICurrentDayFills } from "@/features/strategies/dte/users/details/currentDayFillsInterface"
/* eslint-disable no-useless-escape */

const mockState: {
  dteUsers: IDteStrategiesResponse,
  bots: StrategyBotList,
  openPositions: OpenPosition[],
  workingOrders: IWorkingOrder[],
  currentDayFills: ICurrentDayFills[]
} = {
  dteUsers: initDteUsers,
  bots: initBotStrategiesList,
  openPositions: initOpenPosition,
  workingOrders: initWorkingOrders,
  currentDayFills: initCurrentDayFills
}

export function configureDteUsersMock(mock: MockAdapter) {
  mock.onGet(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy$`)).reply(() => {
    return [200, mockState.dteUsers]
  })

  mock.onGet(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy\/([^/]+)$`)).reply(() => {
    return [200, mockState.bots]
  })

  mock.onPost(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy\/([^/]+)\/([^/]+)\/([^/]+)$\/stop$`)).reply(config => {
    
    alert("stop")
    const bot: StrategyBot = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]

    return [200]
  })

  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/positions\/([^/]+)`)
  mock.onGet(getOpenPositionsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    const symbol = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[3]
    return [200, mockState.openPositions.filter(position => position.userId === userId && position.currencySymbol === symbol)]
  })

  const currentDayFillsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/orders\/([^/]+)`);
  mock.onGet(currentDayFillsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    const accountNumber = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[2]
    const orderId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[3]
    return [200, mockState.currentDayFills.filter(current => current.userId === userId && current.accountNumber === accountNumber && current.orderId === orderId)];
  });

  const getWorkingOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/orders\/([^/]+)`);
  mock.onGet(getWorkingOrdersRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    const accountNumber = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[2]
    const orderId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[3]
    return [200, mockState.workingOrders.filter(order => order.userId === userId && order.accountNumber === accountNumber && order.orderId === orderId)];
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