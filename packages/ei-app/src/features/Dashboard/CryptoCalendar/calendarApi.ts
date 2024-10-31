  import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
  import { CalendarResponse, CategoriesResponse, Coins } from "./eventsResponseModel";
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

  export const coinsApi = createApi({
    reducerPath: "coinsApi",
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.BACKEND_API_URL,
    }),
    endpoints: (builder) => ({
      // Изменяем `getCoins`, чтобы он принимал `offset` и `limit` в качестве параметров для ленивой загрузки
      getCoins: builder.query<Coins, { offset: number; limit: number }>({
        query: ({ offset, limit }) => ({
          url: "/api/cal/coins",
          method: "GET",
          params: {
            offset,
            limit,
          },
        }),
      }),
    }),
  });
  
  export const { useGetCoinsQuery } = coinsApi;

export const categoriesEventsApi = createApi({
  reducerPath: "categoriesEventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_API_URL,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/api/cal/categories",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesEventsApi;