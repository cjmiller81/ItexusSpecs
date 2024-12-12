import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"
import { configureStockMock } from "./stockMock"


export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
    const mock = new MockAdapter(axiosInstance)
    configureStockMock(mock)
}
