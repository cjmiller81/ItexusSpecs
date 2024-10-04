import MockAdapter from "axios-mock-adapter"
import { IDteUser } from "@/features/strategies/dte/users/iDteUser"
import { initBots, initDteUsers, initOpenPosition } from "./initDteUsers"
import { Bot } from "@/features/strategies/dte/users/details/bot"
import { OpenPosition } from "@/features/strategies/users/details/openPosition"
/* eslint-disable no-useless-escape */

const mockState: {
  dteUsers: IDteUser[],
  bots: Bot[],
  openPositions: OpenPosition[]
} = {
  dteUsers: initDteUsers,
  bots: initBots,
  openPositions: initOpenPosition
}

export function configureDteUsersMock(mock: MockAdapter) {
  mock.onGet(`${process.env.API_BASE_URL}\/api\/zero-dte\/users`).reply(() => {
    return [200, mockState.dteUsers]
  })

  const getOpenPositionsRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/([^/]+)\/open-positions`) 
  mock.onGet(getOpenPositionsRegExp).reply((config) => {
    const userId = getOpenPositionsRegExp.exec(`${config.baseURL}${config.url}`)?.[1]
    return [200, mockState.openPositions.filter(position => position.userId === userId)]
  })

  // eslint-disable-next-line
  const putUserRegExp = new RegExp(`${process.env.API_BASE_URL}\/api\/zero-dte\/users\/*`)
  mock.onPut(putUserRegExp).reply(config => {
    const fifoUser = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const splited = url.pathname.split("/")
    const id = splited[splited.length - 1]

    const existedSignalIndex = mockState.dteUsers.findIndex(user => id === user.id)
    if (existedSignalIndex !== -1) mockState.dteUsers.splice(existedSignalIndex, 1, fifoUser)
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
    mockState.dteUsers = mockState.dteUsers.filter(signal => signal.id !== splitedId[0])

    return [200]
  })

  return mock
}