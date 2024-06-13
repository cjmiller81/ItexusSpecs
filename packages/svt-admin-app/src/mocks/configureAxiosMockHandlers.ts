import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"
import { configureFifoSignalsMock } from "./configureFifoSignalsMock"
import { configureIvlUsersMock } from "./configureIvlUsersMock"
import { configureAxiosTIMocks } from "@/mocks/mockAxiosTradeInstruments"
import { configureFifoUsersMock } from "@/mocks/configureFifoUsersMock"

export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
    const mock = new MockAdapter(axiosInstance)
    configureFifoSignalsMock(mock)
    configureIvlUsersMock(mock)
    configureAxiosTIMocks(mock)
    configureFifoUsersMock(mock)
}
