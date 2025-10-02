import { AxiosError } from "axios"
import { addError, appAxios } from "components"
import i18next from "i18next"
import { appStore } from "../redux/Store"

appAxios.interceptors.response.use(
  async response => {
    return response
  },
  async (_error: AxiosError) => {
    const originalRequest = _error.config

    if (originalRequest) {
      if (_error.status === 500) {
        appStore.dispatch(addError({ message: i18next.t("somethingWentWrong", { ns: "ErrorMessages" }) }))
      }

      return Promise.reject(_error)
    }

    return Promise.reject()
  },
)

export default appAxios
