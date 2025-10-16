import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
  alpha,
  Paper,
} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import { SimpleBarStyled } from "@/components/SimpleBarStyled";

const mockData = [
  {
    "news_url": "https://u.today/crypto-market-prediction-bitcoins-btc-catastrophic-move-ethereum-eth-to-nosedive-to-3000-can-xrp?utm_source=snapi",
    "image_url": "https://crypto.snapi.dev/images/v1/w/c/w/s9556-795866.jpg",
    "title": "Crypto Market Prediction: Bitcoin's (BTC) Catastrophic Move, Ethereum (ETH) to Nosedive to $3,000? Can XRP Reach $3 Again in 2025?",
    "text": "The market is getting ready for a proper move toward values that were previously lost; however, the buy-side volume we had is nowhere near the threshold needed to see prices like $3 for XRP, $4,000 for Ethereum and $120,000 for Bitcoin.",
    "source_name": "UToday",
    "date": "Tue, 14 Oct 2025 20:01:00 -0400",
    "topics": ["priceforecast", "pricemovement"],
    "sentiment": "Negative",
    "type": "Article",
    "tickers": ["BTC", "ETH", "XRP"]
  },
  {
    "news_url": "https://www.tokenpost.com/news/people/17115",
    "image_url": "https://crypto.snapi.dev/images/v1/a/t/d/btc74-571641-795860.jpg",
    "title": "Jerome Powell's Dovish Shift Sparks Bitcoin Rally Amid Fed Rate Cut Expectations",
    "text": "Federal Reserve Chair Jerome Powell has signaled a dovish turn in monetary policy, emphasizing rising risks in the U.S. labor market a move that has fueled optimism for another Fed rate cut this month and triggered a rebound in Bitcoin prices. Speaking at the Annual Meeting of the National Association for Business Economics, Powell noted that the outlook for employment and inflation has remained largely unchanged since September.",
    "source_name": "Tokenpost",
    "date": "Tue, 14 Oct 2025 19:59:20 -0400",
    "topics": ["regulations", "pricemovement"],
    "sentiment": "Positive",
    "type": "Article",
    "tickers": ["BTC"]
  },
  {
    "news_url": "https://www.tokenpost.com/news/investing/17111",
    "image_url": "https://crypto.snapi.dev/images/v1/placeholders/crypto/crypto82.jpg",
    "title": "Grayscale's Massive Bitcoin, Ethereum, and Solana Deposits Spark Market Sell-Off Fears",
    "text": "The cryptocurrency market is reeling after Grayscale, one of the largest digital asset management firms, made massive deposits of Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) to Coinbase Prime on October 14. According to on-chain data shared by Lookonchain, Grayscale transferred 1,856 BTC, 29,718 ETH, and 10,516 SOLworth roughly $358 millionprompting widespread speculation of a potential sell-off amid the ongoing market downturn.",
    "source_name": "Tokenpost",
    "date": "Tue, 14 Oct 2025 19:47:33 -0400",
    "topics": [],
    "sentiment": "Negative",
    "type": "Article",
    "tickers": ["BTC", "ETH", "SOL"]
  },
  {
    "news_url": "https://www.theblock.co/post/374673/bitcoin-jesus-roger-ver-deal-doj-pays-50-million-resolve-tax-case",
    "image_url": "https://crypto.snapi.dev/images/v1/8/j/u/btc67-571665-795853.jpg",
    "title": "Roger Ver admits failing to report bitcoin holdings, DOJ drops indictment after $50 million settlement",
    "text": "Roger Ver admitted to willfully failing to report his bitcoin holdings when he renounced U.S. citizenship in 2014, according to the DOJ.",
    "source_name": "The Block",
    "date": "Tue, 14 Oct 2025 19:47:02 -0400",
    "topics": ["pricemovement"],
    "sentiment": "Negative",
    "type": "Article",
    "tickers": ["BTC"]
  },
  {
    "news_url": "https://www.tokenpost.com/news/investing/17109",
    "image_url": "https://crypto.snapi.dev/images/v1/placeholders/crypto/crypto30.jpg",
    "title": "XRP Faces Bearish Outlook as Death Cross Forms Against Bitcoin",
    "text": "XRP has officially confirmed a death cross against Bitcoin, signaling a potentially bearish phase for the cryptocurrency. The 23-day moving average has fallen below the 200-day average, a technical pattern traders often view as a warning sign of further downside.",
    "source_name": "Tokenpost",
    "date": "Tue, 14 Oct 2025 19:43:19 -0400",
    "topics": ["tanalysis"],
    "sentiment": "Negative",
    "type": "Article",
    "tickers": ["BTC", "XRP"]
  },
  {
    "news_url": "https://www.tokenpost.com/news/investing/17108",
    "image_url": "https://crypto.snapi.dev/images/v1/n/u/d/btcv25gvgfre-594582-795848.jpg",
    "title": "Bitcoin and Crypto Markets Rebound as Fed Signals End of Tightening Cycle",
    "text": "Crypto markets experienced sharp declines on Tuesday, but signs of relief from the U.S. Federal Reserve and investor optimism helped digital assets recover from their worst levels. Bitcoin (BTC) dropped to $109,800 after reaching nearly $116,000 overnight but rebounded to around $112,600, marking a 2.8% loss in the past 24 hours.",
    "source_name": "Tokenpost",
    "date": "Tue, 14 Oct 2025 19:40:48 -0400",
    "topics": [],
    "sentiment": "Positive",
    "type": "Article",
    "tickers": ["BTC"]
  }
];

// Inline SVG fallback placeholder
const FALLBACK_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='320'>` +
  `<rect width='100%' height='100%' fill='#111318'/>` +
  `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#3b3f51' font-family='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto' font-size='20'>No Image</text>` +
  `</svg>`
);
const FALLBACK_DATA_URL = `data:image/svg+xml;utf8,${FALLBACK_SVG}`;

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Prevents onError infinite loops by switching to a data URL exactly once
interface SafeImageProps {
  src: string;
  alt: string;
}

function SafeImage({ src, alt }: SafeImageProps) {
  const isPlaceholder = !src || src.includes("/placeholders/crypto/");
  const [safeSrc, setSafeSrc] = useState(isPlaceholder ? FALLBACK_DATA_URL : src);
  
  return (
    <CardMedia
      component="img"
      image={safeSrc}
      alt={alt}
      loading="lazy"
      onError={() => setSafeSrc(FALLBACK_DATA_URL)}
      sx={{
        width: { xs: 180, sm: 240 },
        height: { xs: 120, sm: 150 },
        objectFit: 'cover',
        flexShrink: 0,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }}
    />
  );
}

export function CryptoNewsAPIFeed() {
  const theme = useTheme();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.toUpperCase().trim();
    if (!q) return mockData;
    const parts = q.split(",").map((p) => p.trim()).filter(Boolean);
    return mockData.filter((article) => 
      parts.some((p) => (article.tickers || []).some((t) => t.toUpperCase() === p))
    );
  }, [query]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return theme.palette.success.main;
      case "Negative":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Paper 
      elevation={2}
      sx={{ 
        width: '100%',
        p: 3,
        backgroundColor: alpha(
          theme.palette.mode === 'light'
            ? "#fff"
            : theme.palette.grey[900],
          1
        ),
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
        <ArticleIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Crypto News Feed
        </Typography>
      </Box>
      {/* Search Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Get news for one or multiple crypto symbols… e.g., BTC, ETH, XRP"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
              }
            }
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            display: 'block',
            color: theme.palette.text.secondary 
          }}
        >
          Separate symbols with commas. Exact ticker matches only.
        </Typography>
      </Box>

      {/* News Items */}
      <SimpleBarStyled
        sx={{
          height: "400px",
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredItems.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                color: theme.palette.text.secondary 
              }}
            >
              <Typography variant="h6">
                No articles found for &quot;{query}&quot;.
              </Typography>
            </Box>
          ) : (
            filteredItems.map((article, index) => (
            <Card
              key={`${article.news_url}-${index}`}
              component="a"
              href={article.news_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                textDecoration: 'none',
                transition: 'all 0.3s',
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              {/* Image */}
              <SafeImage src={article.image_url} alt={article.title} />

              {/* Content */}
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#219a83',
                    fontWeight: 600,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    '&:hover': {
                      color: '#27b896',
                    }
                  }}
                >
                  {article.title}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {article.text}
                </Typography>

                {/* Tickers */}
                {article.tickers?.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {article.tickers.map((ticker, idx) => (
                      <Chip
                        key={idx}
                        label={ticker}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          border: '1px solid',
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Footer: Source, Date, Sentiment */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                    pt: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {article.source_name}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.5 }}>
                      •
                    </Typography>
                    <Typography variant="caption">
                      {formatDate(article.date)}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      color: getSentimentColor(article.sentiment)
                    }}
                  >
                    {article.sentiment}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
        </Box>
      </SimpleBarStyled>

      {/* Results Counter */}
      {query && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Showing {filteredItems.length} of {mockData.length} articles
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

