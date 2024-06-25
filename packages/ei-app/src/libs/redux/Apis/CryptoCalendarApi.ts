import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import mockCryptoCalendar from "../../../mocks/data/cryptoCalendar/cryptoCalendar.json"

type Coin = {
  id: string
  name: string
  rank: number
  symbol: string
  fullname: string
}

type Category = {
  id: number
  name: string
}

export type CalendarEvent = {
  id: number
  title: {
    en: string
  }
  coins: Coin[]
  date_event: string
  can_occur_before: boolean
  created_date: string
  displayed_date: string
  categories: Category[]
  proof: string
  source: string
}

type CalendarResponse = {
  status: {
    error_code: number
    error_message: string
  }
  _metadata: {
    max: number
    page: number
    page_count: number
    total_count: number
  }
  body: CalendarEvent[]
}

export const calendarApi = createApi({
  reducerPath: "calendarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.TRADING_VIEW_CALENDAR_API,
  }),
  endpoints: builder => ({
    getAllEvents: builder.query<CalendarResponse, void>({
      query: () => `/calendar`,
    }),
  }),
})

export const useMockGetAllEvents = () => {
  return {
    data: mockCryptoCalendar as unknown as CalendarResponse,
    isLoading: false,
    error: null,
    isSuccess: true,
  }
}

export const { useGetAllEventsQuery } = calendarApi
