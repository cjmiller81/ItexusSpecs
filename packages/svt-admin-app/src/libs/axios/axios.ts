import { configureAxiosMockHandlers } from "@/mocks/configureAxiosMockHandlers"
import axios, { AxiosError } from "axios"
import { AddDatesProcessing, addError } from "components"
import i18next from "i18next"
import { appStore } from "../redux/Store"

export const appAxios = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
})

AddDatesProcessing(appAxios)
appAxios.interceptors.response.use(
  async response => {
    return response
  },
  async (_error: AxiosError) => {
    const originalRequest = _error.config

    if (originalRequest) {
      if (_error.response?.status === 500) {
        appStore.dispatch(addError(i18next.t("somethingWentWrong", { ns: "ErrorMessages" })))
      } else if (_error.response?.status === 404) {
        return Promise.resolve(_error.response);
      }

      return Promise.reject(_error)
    }

    return Promise.reject()
  },
)

if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API === "true") {
  configureAxiosMockHandlers(appAxios)
}

export default appAxios
