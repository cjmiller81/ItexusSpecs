import { IIvlStrategiesResponse } from "@/features/strategies/ivl/users/IvlUser"
import MockAdapter from "axios-mock-adapter"
import { initAllocations, initBillings, initBot, initCurrentDayFills, initIvlUsers, initOpenPosition, initOrders, initWorkingOrders } from "./initIvlUsers"
import { Billing } from "@/features/strategies/ivl/users/details/billing"
import { CapitalAllocation } from "@/features/strategies/ivl/users/details/capitalAllocation"
import { Order } from "@/features/strategies/ivl/users/details/order"
import { Bot } from "@/features/strategies/ivl/users/details/bot"
import { OpenPosition } from "@/features/strategies/ivl/users/details/openPosition"
import { IWorkingOrder } from "@/features/strategies/ivl/users/details/workingOrderInterface"
import { ICurrentDayFills } from "@/features/strategies/ivl/users/details/currentDayFillsInterface"
/* eslint-disable no-useless-escape */

const mockState: {
  ivlUsers: IIvlStrategiesResponse,
  orders: Order[],
  billings: Billing[],
  allocations: CapitalAllocation[],
  bot: Bot,
  openPositions: OpenPosition[],
  workingOrders: IWorkingOrder[],
  currentDayFills: ICurrentDayFills[]
} = {
  ivlUsers: initIvlUsers,
  orders: initOrders,
  allocations: initAllocations,
  billings: initBillings,
  bot: initBot,
  openPositions: initOpenPosition,
  workingOrders: initWorkingOrders,
  currentDayFills: initCurrentDayFills
}

export function configureIvlUsersMock(mock: MockAdapter) {
  mock.onGet(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/ivl`).reply(() => {
    return [200, mockState.ivlUsers]
  })

  const getBillingRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/billing`)
  mock.onGet(getBillingRegExp).reply((config) => {
    const userId = getBillingRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.billings.filter(billing => billing.userId === userId)]
  })
  const getCapitalAllocationRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/capital-allocations`)
  mock.onGet(getCapitalAllocationRegExp).reply((config) => {
    const userId = getCapitalAllocationRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.allocations.filter(allocation => allocation.userId === userId)]
  })
  const getBotRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/ivl\/([^/]+)`)
  mock.onGet(getBotRegExp).reply(() => {
    return [200, mockState.bot]
  })
  const getOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/orders`)
  mock.onGet(getOrdersRegExp).reply((config) => {
    const userId = getOrdersRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.orders.filter(order => order.userId === userId)]
  })
  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/open-positions`)
  mock.onGet(getOpenPositionsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.openPositions.filter(position => position.userId === userId)]
  })
  const currentDayFillsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/current-day-fills`);
  mock.onGet(currentDayFillsRegExp).reply(() => {
    return [200, mockState.currentDayFills];
  });
  const getWorkingOrdersRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/working-orders`);
  mock.onGet(getWorkingOrdersRegExp).reply(() => {
    return [200, mockState.workingOrders];
  });
  // eslint-disable-next-line
  const putUserRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/admin\/strategies\/ivl\/*`)
  mock.onPut(putUserRegExp).reply(config => {
    const ivlUser = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]

    const existedSignalIndex = mockState.ivlUsers.strategies.findIndex(user => id === user.userId)

    if (existedSignalIndex !== -1) mockState.ivlUsers.strategies.splice(existedSignalIndex, 1, ivlUser)
    return [200]
  })

  mock.onDelete(putUserRegExp).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)

    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.ivlUsers.strategies = mockState.ivlUsers.strategies.filter(signal => signal.userId !== splitedId[0])

    return [200]
  })

  return mock
}
