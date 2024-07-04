import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"
import { configureYieldsMocks } from "./configureYieldsMocks"

export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
    const mock = new MockAdapter(axiosInstance)
    configureYieldsMocks(mock)
}
