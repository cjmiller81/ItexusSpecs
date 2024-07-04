import { configureAxiosMockHandlers } from "@/mocks/configureAxiosMockHandlers"
import { AxiosError } from "axios"
import { addError, appAxios } from "components"
import i18n from "i18next"
import { appStore } from "../redux/Store"

appAxios.interceptors.response.use(
  async response => {
    return response
  },
  async (_error: AxiosError) => {
    const originalRequest = _error.config

    if (originalRequest) {
      if (_error.status === 500) {
        appStore.dispatch(addError(i18n.t("somethingWentWrong", { ns: "ErrorMessages" })))
      }

      return Promise.reject(_error)
    }

    return Promise.reject()
  },
)

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }: any) => {
    const result = await appAxios({
      url: url,
      method,
      data,
      params,
      headers,
    })
    return { data: result.data }
  }

if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API === "true") {
  configureAxiosMockHandlers(appAxios)
}
export default appAxios
