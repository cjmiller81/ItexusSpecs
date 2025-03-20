import axios from "axios"
import { AddDatesProcessing } from "./axiosDatesProcessor"

export const appAxios = axios.create({
  baseURL: process.env.BACKEND_API_URL || process.env.API_BASE_URL,
  withCredentials: true,
})

AddDatesProcessing(appAxios)