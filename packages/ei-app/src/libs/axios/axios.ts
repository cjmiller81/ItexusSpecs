import { AxiosError } from "axios"
import { addError, appAxios, getUndefinedErrorMessage } from "components"
import { appStore } from "../redux/Store"

appAxios.interceptors.response.use(
  async response => {
    return response
  },
  async (_error: AxiosError) => {
    const originalRequest = _error.config

    if (originalRequest) {
      if (_error.status === 500) {
        appStore.dispatch(addError(getUndefinedErrorMessage()))
      }

      return Promise.reject(_error)
    }

    return Promise.reject()
  },
)
