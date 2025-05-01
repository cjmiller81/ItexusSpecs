import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"
import { configureFifoSignalsMock } from "./configureFifoSignalsMock"
import { configureIvlUsersMock } from "./configureIvlUsersMock"
import { configureAxiosTIMocks } from "@/mocks/mockAxiosTradeInstruments"
import { configureFifoUsersMock } from "@/mocks/configureFifoUsersMock"
import { configureDteUsersMock } from "./configureDteUsersMock"
import { configureAdminUsersMock } from "./configureAdminUsersMock"
import { configureMachanical0DteSpxMock } from "./configureDteMechanicalUsersMock"

export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
    const mock = new MockAdapter(axiosInstance)
    configureAdminUsersMock(mock)
    configureFifoSignalsMock(mock)
    configureIvlUsersMock(mock)
    configureAxiosTIMocks(mock)
    configureFifoUsersMock(mock)
    configureDteUsersMock(mock)
    configureMachanical0DteSpxMock(mock)
}
