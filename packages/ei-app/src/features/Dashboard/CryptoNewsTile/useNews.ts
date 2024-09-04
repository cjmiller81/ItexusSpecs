import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MarketType, newsApi, NewsArticle } from "./newsApi";

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const invalidateBuffer = useRef(false);
  const lastLoadedDate = useRef<Date | null>(null);
  const [market, setMarket] = useState<MarketType>("crypto");

  useEffect(() => {
    handleLoadMore(market);
  }, []);

  const handleLoadMore = (marketToLoad: MarketType) => {
    let dateToLoad: Date = moment().utc().toDate();
    if (lastLoadedDate.current !== null && news.length) {
      dateToLoad = moment(news[news.length - 1].date)
        .add(-1, "d")
        .toDate();
    }

    if (
      lastLoadedDate.current !== null &&
      moment(lastLoadedDate.current).format("YYYY-MM-DD") === moment(dateToLoad).format("YYYY-MM-DD")
    ) {
      return;
    }

    lastLoadedDate.current = dateToLoad;
    setIsLoading(true);
    newsApi
      .getNews({
        date: dateToLoad,
        for_main_and_market_pages: true,
        limit: 10,
        market: marketToLoad,
      })
      .then(newNews => {
        setNews(invalidateBuffer.current ? newNews : [...news, ...newNews]);
        invalidateBuffer.current = false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onMarketChanged = (market: MarketType) => {
    setMarket(market);
    invalidateBuffer.current = true;
    lastLoadedDate.current = null;
    handleLoadMore(market);
  };

  const loadMore = () => {
    handleLoadMore(market);
  };
  return {
    news: news,
    market: market,
    loadMore: loadMore,
    isLoading: isLoading,
    setMarket: onMarketChanged,
  };
};
