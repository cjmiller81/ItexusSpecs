import MockAdapter from "axios-mock-adapter"
import { ICurrentDayFills, IDteStrategiesResponse, IWorkingOrder, OpenPosition, StrategyBot, StrategyBotList } from "@/features/strategies/dte/users/types"
import { initBotStrategiesList, initCurrentDayFills, initDteUsers, initOpenPosition, initWorkingOrders } from "./initDteUsers"
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

  mock.onPost(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy\/([^/]+)\/([^/]+)\/([^/]+)\/start$`)).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const bot = mockState.bots.zeroDteFlyStrategyList.find(x => x.userId === splited[5] && x.exchangeAccountNumber == splited[6] && x.masterSymbol == splited[7]);
    if (bot) {
      bot.active = true;
    }
    return [200, bot]
  })

  mock.onPost(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy\/([^/]+)\/([^/]+)\/([^/]+)\/stop$`)).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const bot = mockState.bots.zeroDteFlyStrategyList.find(x => x.userId === splited[5] && x.exchangeAccountNumber == splited[6] && x.masterSymbol == splited[7]);
    if (bot) {
      bot.active = false;
    }
    return [200, bot]
  })

  mock.onPost(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy\/([^/]+)\/([^/]+)\/([^/]+)\/reset$`)).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const bot = mockState.bots.zeroDteFlyStrategyList.find(x => x.userId === splited[5] && x.exchangeAccountNumber == splited[6] && x.masterSymbol == splited[7]);
    if (bot) {
      bot.active = false;
    }
    return [200, bot]
  })

  mock.onPost(new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/zeroDteFlyStrategy\/([^/]+)\/([^/]+)\/([^/]+)\/forceStopExitOrder$`)).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const bot = mockState.bots.zeroDteFlyStrategyList.find(x => x.userId === splited[5] && x.exchangeAccountNumber == splited[6] && x.masterSymbol == splited[7]);
    if (bot) {
      bot.active = false;
    }
    return [200, bot]
  })

  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/positions\/([^/]+)`)
  mock.onGet(getOpenPositionsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    const symbol = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[3]
    return [200, mockState.openPositions.filter(position => position.userId === userId && position.currencySymbol === symbol)]
  })

  const currentDayFillsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/users\/([^/]+)\/accounts\/([^/]+)\/orders\/([^/]+)`);
  mock.onGet(currentDayFillsRegExp).reply((config) => {
    const url = new URL(config.url!, config.baseURL!)
    const urlValues = url.pathname.split("/");
    const userId = urlValues[4]
    const accountNumber = urlValues[6]
    const orderId = urlValues[8]

    return [200, mockState.currentDayFills
      .filter(current => current.userId === userId
        && current.accountNumber === accountNumber
        && current.orderId === orderId)];
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