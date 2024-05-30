import { configureAxiosMocks } from "@/mocks/mockAxios"
import axios, { AxiosError } from "axios"
import { AddDatesProcessing, addError } from "components"
import i18next from "i18next"
import { appStore } from "../redux/Store"

export const appAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
})

appAxios.interceptors.request.use(
  config => {
    config.headers.Authorization = process.env.ACCESS_TOKEN
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

AddDatesProcessing(appAxios)
appAxios.interceptors.response.use(
  async response => {
    return response
  },
  async (_error: AxiosError) => {
    const originalRequest = _error.config

    if (originalRequest) {
      if (_error.status === 500) {
        appStore.dispatch(addError(i18next.t("somethingWentWrong", { ns: "ErrorMessages" })))
      }

      return Promise.reject(_error)
    }

    return Promise.reject()
  },
)

if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API) configureAxiosMocks(appAxios)

export default appAxios
