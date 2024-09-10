import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import mockNews from "../../../mocks/data/news/news.json"
type RelatedSymbol = {
  symbol: string
  "currency-logoid": string
  "base-currency-logoid": string
}

export type Article = {
  id: string
  title: string
  provider: string
  sourceLogoId: string
  published: number
  source: string
  urgency: number
  link: string
  relatedSymbols: RelatedSymbol[]
  storyPath: string
}

type ArticleResponse = {
  items: Article[]
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.TRADIND_VIEW_NEWS_API,
  }),
  endpoints: builder => ({
    getAllNews: builder.query<ArticleResponse, void>({
      query: () => `/news`,
    }),
  }),
})

export const { useGetAllNewsQuery } = newsApi
