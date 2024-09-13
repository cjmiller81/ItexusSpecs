import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CalendarResponse } from "./eventsResponseModel";
import moment from "moment";

export const calendarEventsApi = createApi({
  reducerPath: "calendarEventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_API_URL,
  }),
  endpoints: builder => ({
    getCalendarEvents: builder.query<CalendarResponse, { page: number; max: number; fromDate: Date; toDate: Date }>({
      query: ({ page, max, fromDate, toDate }) => ({
        url: "/api/cal/events",
        method: "GET",
        params: {
          fromDate: moment(fromDate).format("YYYY-MM-DD"),
          toDate: moment(toDate).format("YYYY-MM-DD"),
          page,
          max,
        },
      }),
    }),
  }),
});

export const { useGetCalendarEventsQuery } = calendarEventsApi;
