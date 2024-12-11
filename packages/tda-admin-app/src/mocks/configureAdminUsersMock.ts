import MockAdapter from "axios-mock-adapter"
import { initAdminUsers } from "./initAdminUsers"
import { IAdminUser } from "features/users/iAdminUser"
/* eslint-disable no-useless-escape */

const mockState: {
  adminUsers: IAdminUser[],
  permissions: any[],
  customers: any[],
} = {
  adminUsers: initAdminUsers,
  permissions: [],
  customers: [],
}

export function configureAdminUsersMock(mock: MockAdapter) {

  mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/users`).reply(() => {
    return [200, mockState.adminUsers]
  })

  mock.onGet(new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/users\/\\d+`)).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const id = url.pathname.split("/").pop()
    const user = mockState.adminUsers.find(user => user.id === id)
    return user ? [200, user] : [404]
  })

  mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/permissions`).reply(() => {
    return [200, mockState.permissions]
  })

  mock.onGet(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/customers`).reply(() => {
    return [200, mockState.customers]
  })

  const putUserRegExp = new RegExp(`${process.env.NEXT_PUBLIC_API_BASE_URL}\/api\/users\/\\d+`)
  mock.onPatch(putUserRegExp).reply(config => {
    const adminUser = JSON.parse(config.data)
    const url = new URL(config.url!, config.baseURL!)
    const id = url.pathname.split("/").pop()

    const existedUserIndex = mockState.adminUsers.findIndex(user => id === user.id)

    if (existedUserIndex !== -1) mockState.adminUsers.splice(existedUserIndex, 1, adminUser)
    return [200]
  })

  mock.onDelete(putUserRegExp).reply(config => {
    const url = new URL(config.url!, config.baseURL!)
    const id = url.pathname.split("/").pop()
    mockState.adminUsers = mockState.adminUsers.filter(user => user.id !== id)
    return [200]
  })

  return mock
}
