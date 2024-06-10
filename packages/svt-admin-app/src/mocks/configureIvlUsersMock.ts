import { IvlUser } from "@/features/strategies/ivl/users/IvlUser"
import MockAdapter from "axios-mock-adapter"
import { initAllocations, initBillings, initIvlUsers, initOrders } from "./initIvlUsers"
import { Billing } from "@/features/strategies/ivl/users/details/billing"
import { CapitalAllocation } from "@/features/strategies/ivl/users/details/capitalAllocation"
import { Order } from "@/features/strategies/ivl/users/details/order"
/* eslint-disable no-useless-escape */

const mockState: {
  ivlUsers: IvlUser[],
  orders: Order[],
  billings: Billing[],
  allocations: CapitalAllocation[]
} = {
  ivlUsers: initIvlUsers,
  orders: initOrders,
  allocations: initAllocations,
  billings: initBillings
}

export function configureIvlUsersMock(mock: MockAdapter) {
  mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/ivl\/users`).reply(() => {
    
    return [200, mockState.ivlUsers]
  })
  
  const getBillingRegExp = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/billing`) 
  mock.onGet(getBillingRegExp).reply((config) => {
    const userId = getBillingRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.billings.filter(billing => billing.userId === userId)]
  })
  const getCapitalAllocationRegExp = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/capital-allocations`) 
  mock.onGet(getCapitalAllocationRegExp).reply((config) => {
    const userId = getCapitalAllocationRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.allocations.filter(allocation => allocation.userId === userId)]
  })
  const getOrdersRegExp = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/ivl\/users\/([^/]+)\/orders`) 
  mock.onGet(getOrdersRegExp).reply((config) => {
    const userId = getOrdersRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.orders.filter(order => order.userId === userId)]
  })
  // eslint-disable-next-line
  const putUserRegExp = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/ivl\/users\/*`)
  mock.onPut(putUserRegExp).reply(config => {
    const ivlUser = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]

    const existedSignalIndex = mockState.ivlUsers.findIndex(user => id === user.id)

    if (existedSignalIndex !== -1) mockState.ivlUsers.splice(existedSignalIndex, 1, ivlUser)
    return [200]
  })

  mock.onDelete(putUserRegExp).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]
    const decodedId = decodeURIComponent(id)

    const splitedId: [string, string] = decodedId.split(".") as [string, string]
    mockState.ivlUsers = mockState.ivlUsers.filter(signal => signal.id !== splitedId[0])

    return [200]
  })

  return mock
}
