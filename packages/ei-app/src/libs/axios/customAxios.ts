import { apiDateFormat } from "@/constants/Common"
import { getUndefinedErrorMessage } from "@/constants/Errormessages"
import axios, { AxiosError } from "axios"
import { addError } from "../redux/Slices/UiSlice"
import { appStore } from "../redux/Store"

export const appAxios = axios.create({
  baseURL: process.env.API_BASE_URL, // "https://tokensets-api.emergentcybernetics.net",
})

appAxios.interceptors.request.use(
  config => {
    config.headers.Authorization = process.env.ACCESS_TOKEN //`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjFlMjViNTBkLTVhZjQtNGQ1Zi1hMmM4LTMxOTEyZTBlNzU2ZCIsImV4cCI6MTcxMTU1Mzc4NiwiaXNzIjoieW91cl9pc3N1ZXIiLCJhdWQiOiJ5b3VyX2F1ZGllbmNlIn0.rF6v5SwvKTbmJHzyQAenH9WpMtCWTGV5zfDsaEf5uoA`
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && apiDateFormat.test(value)
}

function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object") return body

  for (const key of Object.keys(body)) {
    const value = body[key]
    if (isIsoDateString(value)) body[key] = new Date(value)
    else if (typeof value === "object") handleDates(value)
  }
}

appAxios.interceptors.response.use(originalResponse => {
  handleDates(originalResponse.data)
  return originalResponse
})

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
