import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"
import { configureStockMock } from "./stockMock"


export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
   if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API === "true") {
    const mock = new MockAdapter(axiosInstance)
    configureStockMock(mock)
   }
}
