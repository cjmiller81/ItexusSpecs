import axios from "axios"
import { AddDatesProcessing } from "./axiosDatesProcessor"

export const appAxios = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  withCredentials: true,
})

AddDatesProcessing(appAxios)