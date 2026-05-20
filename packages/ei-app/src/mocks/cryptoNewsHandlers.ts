import { http, HttpResponse, type RequestHandler } from "msw";
import type { NewsItem, NewsResponse } from "../services/cryptoNewsService";

// Synthetic articles cover the three sentiment branches the UI styles
// differently (Positive / Negative / Neutral) so stories visually exercise
// all rendering paths in CryptoNewsTile and CryptoNewsAPIFeed.
const newsFixture: NewsItem[] = [
  {
    news_url: "https://example.com/news/btc-etf-flows",
    image_url: "",
    title: "Spot Bitcoin ETFs post fifth straight day of net inflows",
    text: "Inflows topped $420M on Tuesday, led by IBIT, as institutional allocators rotated into BTC ahead of next month's FOMC.",
    source_name: "MarketWire",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    topics: ["ETF", "Institutional"],
    sentiment: "Positive",
    type: "article",
    tickers: ["BTC"],
  },
  {
    news_url: "https://example.com/news/eth-l2-bug",
    image_url: "",
    title: "Layer-2 sequencer outage briefly halts Ethereum rollup deposits",
    text: "A ~17-minute sequencer halt left a major Ethereum L2 unable to ingest deposits this morning; bridges were unaffected.",
    source_name: "ChainBeat",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    topics: ["L2", "Outage"],
    sentiment: "Negative",
    type: "article",
    tickers: ["ETH"],
  },
  {
    news_url: "https://example.com/news/sol-mainnet-upgrade",
    image_url: "",
    title: "Solana validators schedule mainnet upgrade for next Tuesday",
    text: "The proposed release ships performance work targeting state-sync latency on slot replay.",
    source_name: "DevPost",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    topics: ["Upgrade"],
    sentiment: "Neutral",
    type: "article",
    tickers: ["SOL"],
  },
  {
    news_url: "https://example.com/news/stablecoin-bill",
    image_url: "",
    title: "U.S. stablecoin bill clears committee with bipartisan support",
    text: "The framework introduces a federal/state dual-track licensing regime and explicit reserve attestations.",
    source_name: "DC Crypto",
    date: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    topics: ["Regulation", "Stablecoins"],
    sentiment: "Positive",
    type: "article",
    tickers: ["USDC", "USDT"],
  },
  {
    news_url: "https://example.com/news/defi-exploit",
    image_url: "",
    title: "Cross-chain bridge halts after $11M anomaly detected",
    text: "Operators paused withdrawals on a major cross-chain bridge while a forensic review of an irregular outflow proceeds.",
    source_name: "Sec Daily",
    date: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    topics: ["Security", "DeFi"],
    sentiment: "Negative",
    type: "article",
    tickers: ["ETH", "ARB"],
  },
];

const buildResponse = (): NewsResponse => ({
  data: newsFixture,
  total_pages: 1,
  total_items: newsFixture.length,
});

export const cryptoNewsHandlers: RequestHandler[] = [
  http.get(`${process.env.BACKEND_API_URL}/api/cryptonews/category`, () => HttpResponse.json(buildResponse())),
  http.get(`${process.env.BACKEND_API_URL}/api/cryptonews/ticker`, () => HttpResponse.json(buildResponse())),
  http.get(`${process.env.BACKEND_API_URL}/api/cryptonews/ticker-advanced`, () => HttpResponse.json(buildResponse())),
  http.get(`${process.env.BACKEND_API_URL}/api/cryptonews/tickers`, () =>
    HttpResponse.json(["BTC", "ETH", "SOL", "USDC", "USDT", "ARB"]),
  ),
];
