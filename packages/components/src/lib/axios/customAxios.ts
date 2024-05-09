import axios from "axios"
import { apiDateFormat } from "../../constants/common"

export const appAxios = axios.create({
  baseURL: process.env.API_BASE_URL, // "https://tokensets-api.emergentcybernetics.net",
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
