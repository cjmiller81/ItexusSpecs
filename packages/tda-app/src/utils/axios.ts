import axios, { AxiosRequestConfig } from "axios"
import { AddDatesProcessing } from "components"

const axiosServices = axios.create({ baseURL: process.env.NEXT_APP_API_URL || 'http://localhost:3010/' });
const appAxios = axios.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${process.env.BACKEND_API_TOKEN}`,
  },
})

AddDatesProcessing(appAxios)

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
  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.post(url, { ...config });

  return res.data;
};

export default appAxios
