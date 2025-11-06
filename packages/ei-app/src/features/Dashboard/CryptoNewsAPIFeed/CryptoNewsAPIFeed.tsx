import React, { useEffect, useMemo, useState, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import {
  fetchNewsByTickerAsync,
  fetchNewsByCategoryAsync,
  clearNewsByTicker,
  clearNewsByCategory,
  setCurrentPage,
} from "@/slices/cryptoNewsSlice";

// Items per page constant
// Note: Backend currently only supports items=3
const ITEMS_PER_PAGE = 3;

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
  const dispatch = useAppDispatch();
  
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const isLoadingMore = useRef(false);
  const scrollRef = useRef<any>(null);
  
  const { 
    newsByTicker,
    newsByCategory, 
    loading, 
    error, 
    currentPage,
    totalPages 
  } = useAppSelector((state) => state.cryptoNews);


  const handleSearch = () => {
    if (!query.trim()) {
      setHasSearched(false);
      dispatch(clearNewsByTicker());
      dispatch(setCurrentPage(1));
      dispatch(fetchNewsByCategoryAsync({
        section: "general",
        items: ITEMS_PER_PAGE,
        page: 1,
      }));
      return;
    }

    const tickers = query
      .toUpperCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(",");

    if (tickers) {
      setHasSearched(true);
      dispatch(clearNewsByCategory());
      dispatch(setCurrentPage(1));
      dispatch(fetchNewsByTickerAsync({
        tickers,
        items: ITEMS_PER_PAGE,
        page: 1,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current?.getScrollElement?.();
    if (!scrollElement) return;

    const handleScroll = () => {
      const scrollPosition = scrollElement.scrollTop + scrollElement.clientHeight;
      const scrollHeight = scrollElement.scrollHeight;
      
      // Загружаем следующую страницу, когда пользователь прокрутил до 80% контента
      if (scrollPosition >= scrollHeight * 0.8 && 
          !loading && 
          !isLoadingMore.current && 
          currentPage < totalPages) {
        isLoadingMore.current = true;
        const nextPage = currentPage + 1;
        dispatch(setCurrentPage(nextPage));

        if (hasSearched && query.trim()) {
          const tickers = query
            .toUpperCase()
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .join(",");

          dispatch(fetchNewsByTickerAsync({
            tickers,
            items: ITEMS_PER_PAGE,
            page: nextPage,
          })).finally(() => {
            isLoadingMore.current = false;
          });
        } else {
          dispatch(fetchNewsByCategoryAsync({
            section: "general",
            items: ITEMS_PER_PAGE,
            page: nextPage,
          })).finally(() => {
            isLoadingMore.current = false;
          });
        }
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [loading, currentPage, totalPages, hasSearched, query, dispatch]);

  const articles = useMemo(() => {
    if (hasSearched && newsByTicker) {
      return newsByTicker.data || [];
    }
    return newsByCategory?.data || [];
  }, [hasSearched, newsByTicker, newsByCategory]);

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
        height: '100%',
        p: 2,
        backgroundColor: alpha(
          theme.palette.mode === 'light'
            ? "#fff"
            : theme.palette.grey[900],
          1
        ),
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5, flexShrink: 0 }}>
        <ArticleIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Crypto News Feed
        </Typography>
      </Box>
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onBlur={handleSearch}
          placeholder="Get news for one or multiple crypto symbols… e.g., BTC, ETH, XRP"
          variant="outlined"
          disabled={loading}
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
          Separate symbols with commas. Exact ticker matches only. Press Enter or blur to search.
        </Typography>
      </Box>

      {error && (
        <Box 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      )}

      <SimpleBarStyled
        ref={scrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {loading && articles.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 8
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : articles.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                color: theme.palette.text.secondary 
              }}
            >
              <Typography variant="h6">
                {query.trim() 
                  ? `No articles found for "${query}".`
                  : "No articles available."}
              </Typography>
            </Box>
          ) : (
            articles.map((article, index) => (
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
              <SafeImage src={article.image_url} alt={article.title} />

              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
        
        {loading && articles.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}
        </Box>
      </SimpleBarStyled>
    </Paper>
  );
}

