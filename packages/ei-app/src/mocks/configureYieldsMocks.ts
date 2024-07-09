import MockAdapter from "axios-mock-adapter"
/* eslint-disable no-useless-escape */
import all from "./data/pools/all.json"
import { PoolData } from "@/features/Income/Models/PoolData"

const mockState: {
  pools: PoolData[]
} = {
  pools: all.data as PoolData[],
}

export function configureYieldsMocks(mock: MockAdapter) {
  mock.onGet(`${process.env.BACKEND_API_URL}/api/defi/pools`).reply(() => {
    return [200, {
        status: "success",
        data: mockState.pools
    }]
  })

  return mock
}
