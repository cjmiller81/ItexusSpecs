import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { CircularProgress, Typography, useTheme, Dialog, IconButton, alpha, Chip } from "@mui/material";
import { Box } from "@mui/system";
import { FC, useEffect, useState, useRef } from "react";
import { DashboardTile, DashboardTileProps } from "../DashboardTile";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { fetchNewsByCategoryAsync, setCurrentPage } from "@/slices/cryptoNewsSlice";
import CloseIcon from "@mui/icons-material/Close";
import { CryptoNewsAPIFeed } from "../CryptoNewsAPIFeed";

type Props = Omit<DashboardTileProps, "children"> & {};

const ITEMS_PER_PAGE = 100;

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

export const CryptoNewsTile: FC<Props> = ({
  title,
  icon,
  ...props
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoadingMore = useRef(false);
  const scrollRef = useRef<any>(null);
  
  const { 
    newsByCategory, 
    loading,
    currentPage,
    totalPages 
  } = useAppSelector((state) => state.cryptoNews);

  useEffect(() => {
    dispatch(fetchNewsByCategoryAsync({
      section: "general",
      items: ITEMS_PER_PAGE,
      page: 1,
    }));
  }, [dispatch]);

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
        dispatch(fetchNewsByCategoryAsync({
          section: "general",
          items: ITEMS_PER_PAGE,
          page: nextPage,
        })).finally(() => {
          isLoadingMore.current = false;
        });
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [loading, currentPage, totalPages, dispatch]);

  const articles = newsByCategory?.data || [];

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
    <>
      <DashboardTile
        sx={{ position: "relative" }}
        title={title}
        icon={icon}
        sectionLink={{
          href: "#",
          text: "Expand View",
          onClick: () => setIsModalOpen(true),
          alwaysVisible: true
        }}
        {...props}>
        <Box
          sx={{
            px: 2,
            py: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "transparent !important"
                : "#fff !important",
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <SimpleBarStyled
            ref={scrollRef}
            style={{ maxHeight: "380px" }}
            onWheel={e => e.stopPropagation()}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {loading && articles.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : articles.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: theme.palette.text.secondary }}>
                  No articles available.
                </Typography>
              ) : (
                <>
                  {articles.map((article, index) => (
                    <Box
                      key={`${article.news_url}-${index}`}
                      component="a"
                      href={article.news_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        pb: 2,
                        borderBottom: index < articles.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                        '&:hover .news-title': {
                          color: '#27b896',
                        }
                      }}
                    >
                      <Typography 
                        className="news-title"
                        variant="body1" 
                        sx={{ 
                          color: '#219a83',
                          fontWeight: 600,
                          mb: 1,
                          transition: 'color 0.2s',
                          cursor: 'pointer',
                        }}
                      >
                        {article.title}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                            {article.source_name}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.5 }}>
                            •
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
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
                    </Box>
                  ))}
                  
                  {loading && articles.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </SimpleBarStyled>
        </Box>
      </DashboardTile>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          '& .MuiDialog-paper': {
            height: '85vh',
            maxHeight: '85vh',
            backgroundColor: theme.palette.background.default,
          }
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.text.primary,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, pt: 6 }}>
            <CryptoNewsAPIFeed />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
