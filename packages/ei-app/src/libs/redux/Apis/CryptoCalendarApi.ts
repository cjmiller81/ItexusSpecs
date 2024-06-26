import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import axios from "axios"
import mockCryptoCalendar from "../../../mocks/data/cryptoCalendar/cryptoCalendar.json"

type Coin = {
  id: string;
  name: string;
  rank: number;
  symbol: string;
  fullname: string;
};

type Category = {
  id: number;
  name: string;
};

export type CalendarEvent = {
  id: number;
  title: {
    en: string;
  };
  coins: Coin[];
  date_event: string;
  can_occur_before: boolean;
  created_date: string;
  displayed_date: string;
  categories: Category[];
  proof: string;
  source: string;
};

type CalendarResponse = {
  status: {
    error_code: number;
    error_message: string;
  };
  _metadata: {
    max: number;
    page: number;
    page_count: number;
    total_count: number;
  };
  body: CalendarEvent[];
};


export const calendarApi = axios.create({
  baseURL: "https://api.coinmarketcal.com/v1/",
  headers: {
    "x-api-key": "q8XkCPZXyH57ZSkngPJj73daFSp2gxna52UJ2ALC",
  },
})


export const useMockGetAllEvents = () => {
  return {
    data: mockCryptoCalendar as unknown as CalendarResponse,
    isLoading: false,
    error: null,
    isSuccess: true,
  }
}

export const useMockGetEventsByDate = (date: string) => {
  const events = mockCryptoCalendar.body.filter(event => event.date_event.startsWith(date))
  return {
    data: {
      ...mockCryptoCalendar,
      body: events,
    } as unknown as CalendarResponse,
    isLoading: false,
    error: null,
    isSuccess: true,
  }
}


export const calendarEventsApi = createApi({
  reducerPath: "calendarEventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coinmarketcal.com/v1/",
    prepareHeaders: (headers) => {
      headers.set("x-api-key", "q8XkCPZXyH57ZSkngPJj73daFSp2gxna52UJ2ALC")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAllCalendarEvents: builder.query<CalendarResponse, void>({
      query: () => ({
        url: "events",
        method: "GET",
      }),
    }),
    getCalendarEventsByDate: builder.query<CalendarResponse, { date: string; page?: number; max?: number }>({
      query: ({ date, page = 1, max = 16 }) => ({
        url: "events",
        method: "GET",
        params: {
          dateRangeStart: date,
          dateRangeEnd: date,
          page,
          max,
        },
      }),
    }),
  }),
})

export const { useGetAllCalendarEventsQuery, useGetCalendarEventsByDateQuery } = calendarEventsApi
