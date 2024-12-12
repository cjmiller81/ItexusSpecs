import { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"
import { configureAdminUsersMock } from "mocks/configureAdminUsersMock"

export const configureAxiosMockHandlers = (axiosInstance: AxiosInstance) => {
    const mock = new MockAdapter(axiosInstance)
    configureAdminUsersMock(mock)
}
