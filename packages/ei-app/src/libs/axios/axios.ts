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
        appStore.dispatch(addError({ message: i18n.t("somethingWentWrong", { ns: "ErrorMessages" }) }))
      }

      return Promise.reject(_error)
    }

    return Promise.reject()
  },
)

const EXCLUDED_URLS = [
  "https://api.coingecko.com",
];

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }: any) => {
    const isExcluded = EXCLUDED_URLS.some(excluded => url.startsWith(excluded));

    const result = await appAxios({
      baseURL: isExcluded ? undefined : process.env.NEXT_PUBLIC_API_BASE_URL,
      url,
      method,
      data,
      params,
      headers,
      withCredentials: !isExcluded,
    });

    return { data: result.data };
  };

if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API === "true") {
  configureAxiosMockHandlers(appAxios)
}
export default appAxios
