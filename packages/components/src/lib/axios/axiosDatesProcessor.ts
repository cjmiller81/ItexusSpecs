import { AxiosInstance } from "axios"
import { ISO8601format, apiDateFormat } from "../../constants"

export function AddDatesProcessing(axiosInstance: AxiosInstance) {
  const isIsoDateString = (value: any): boolean => {
    return value && typeof value === "string" && apiDateFormat.test(value)
  }

  const isISO8601format  = (value: any): boolean => {
    return value && typeof value === "string" && ISO8601format.test(value)
  }

  const handleDates = (body: any) => {
    if (body === null || body === undefined || typeof body !== "object") return body

    for (const key of Object.keys(body)) {
      const value = body[key]
      if (isIsoDateString(value) || isISO8601format(value)) body[key] = new Date(value)
      else if (typeof value === "object") handleDates(value)
    }
  }

  axiosInstance.interceptors.response.use(originalResponse => {
    handleDates(originalResponse.data)
    return originalResponse
  })
}
