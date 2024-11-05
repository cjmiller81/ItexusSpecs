import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"


export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
    const mock = new MockAdapter(axiosInstance)
}
