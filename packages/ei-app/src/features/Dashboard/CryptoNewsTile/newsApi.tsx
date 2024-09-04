import appAxios from "@/libs/axios/axios";
import moment from "moment";

type Reaction = {
  count: number;
  is_voted: boolean;
};

type Reactions = {
  shit: Reaction;
  rocket: Reaction;
  heart: Reaction;
  fire: Reaction;
  angry: Reaction;
};

type Image = {
  url: string;
  source: string;
};

type Extra = {
  pinType: string;
  additionalContentType: string;
  showPinOnChart: boolean;
  verticalPosition: number;
  showDayInTimeline: boolean;
  additionalImage: Image;
  coverImage: Image;
  showOnMainPage: boolean;
};

type ASTNode = {
  type: string;
  children: (ASTNode | string)[];
  params?: Record<string, string | boolean | null>;
};

type DescriptionAST = {
  type: string;
  children: (ASTNode | string)[];
};

export type NewsArticle = {
  symbol: string;
  date: string;
  published: boolean;
  headline: string;
  description_preview: string;
  extra: Extra;
  id: number;
  name: string;
  modified: string;
  uri: string;
  symbol_logo_id: string;
  reactions: Reactions;
  description_ast: DescriptionAST;
};

export type MarketType = "crypto" | "forex" | "stock" | "index" | "futures";
type RequestArgs = {
  market?: MarketType;
  limit?: number;
  date: Date;
  for_main_and_market_pages?: boolean;
};

export const newsApi = {
  getNews: async (args: RequestArgs) => {
    const result = await appAxios.get<NewsArticle[]>("/timeline_events", {
      params: {
        market: args.market || "crypto",
        limit: args.limit || 20,
        date_lt: moment(args.date).format("YYYY-MM-DD"),
        for_main_and_market_pages: args.for_main_and_market_pages || true,
      },
    });

    return result.data;
  },
};
