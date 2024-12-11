import axios, { AxiosRequestConfig } from "axios"
import { AddDatesProcessing } from "components"

const appAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true
})

AddDatesProcessing(appAxios)

appAxios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

appAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 && !window.location.href.includes("/ui/login")) {
      window.location.pathname = "/ui/login"
    }
    return Promise.reject((error.response && error.response.data) || "Wrong Services")
  },
)

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await appAxios.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await appAxios.post(url, { ...config });

  return res.data;
};

export default appAxios
