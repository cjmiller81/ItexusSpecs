import axios from "axios"
import { AddDatesProcessing } from "./axiosDatesProcessor"

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

AddDatesProcessing(appAxios)

