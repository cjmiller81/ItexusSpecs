import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CircularProgress, Divider, ListItemText, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { AppLink } from "components";
import moment from "moment";
import { FC, useRef } from "react";
import { DashboardTile, DashboardTileProps } from "../DashboardTile";
import { NewsHeader } from "../NewsHeader";
import { MarketType, NewsArticle } from "./newsApi";

type Props = Omit<DashboardTileProps, "children"> & {
  onLoadMoreNews: () => void;
  news: NewsArticle[];
  isLoading: boolean;
  onNewsSourceChange: (newsSource: MarketType) => void;
  newsSource: MarketType;
};

enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export const CryptoNewsTile: FC<Props> = ({
  news,
  isLoading,
  onLoadMoreNews,
  title,
  icon,
  onNewsSourceChange,
  newsSource,
  ...props
}) => {
  const loader = useRef(null);

  const timeAgo = (date: string): number => {
    const dateAgo = moment(date).unix();
    return dateAgo;
  };
  const theme = useTheme();
  const sources: MarketType[] = ["crypto", "forex", "stock", "index", "futures"];
  const backgroundColor = theme.palette.mode === ThemeMode.DARK ? "transparent" : "#aaaaaa";

  return (
    <DashboardTile
      sx={{ position: "relative" }}
      title={title}
      icon={icon}
      id="ei-news-filter"
      {...props}>
      <>
        <Select
          
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? "transparent !important"
                : "#fff !important",
            borderRadius: "0px",
            ":hover": {
              borderColor: theme => theme.palette.primary.main,
            },
            "& .MuiSelect-select": {
              padding: "0px 16px",
            },
          }}
          fullWidth
          size="small"
          value={newsSource}
          onChange={e => onNewsSourceChange(e.target.value! as MarketType)}
          renderValue={_value => {
            return <ListItemText primary={newsSource} />;
          }}>
          {sources.map(source => (
            <MenuItem
              selected={false}
              key={source}
              value={source}>
              <ListItemText primary={source} />
            </MenuItem>
          ))}
        </Select>
        <Box
          sx={{
            px: 1,
            py: 1.5,
            borderColor: theme => theme.palette.divider,
            borderWidth: "1px",
            borderStyle: "solid",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "transparent !important"
                : "#fff !important",
          }}>
          <SimpleBarStyled
            style={{ maxHeight: "359px" }}
            onWheel={e => e.stopPropagation()}>
            {news.map((article, index) => (
              <Box
                key={article.id}
                sx={{
                  mt: index === 0 ? 0 : 1,
                }}>
                <Stack
                  direction="row"
                  alignItems={"center"}>
                  <img
                    height="50px"
                    src={article?.extra?.coverImage?.url}></img>
                  <Stack
                    gap={0.6}
                    px={1.5}>
                    <NewsHeader
                      sx={{ height: "16px" }}
                      key={article.id}
                      ago={timeAgo(article.date)}
                      source={""}
                      tokensIconsUrls={[`${process.env.TRADIND_VIEW_NEWS_IMAGES_API}${article?.symbol_logo_id}.svg`]}
                    />
                    {article.uri ? (
                      <AppLink
                        target="_blank"
                        href={article.uri}>
                        <Typography
                          variant="body2"
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}>
                          {article.headline}
                        </Typography>
                      </AppLink>
                    ) : (
                      <Typography sx={{ fontSize: 12 }}>{article.headline}</Typography>
                    )}
                  </Stack>
                </Stack>
                <Divider sx={{ borderWidth: "1px", mt: 1 }} />
              </Box>
            ))}
            <Stack
              pt={2}
              alignItems="center"
              ref={loader}>
              <Box sx={{ height: "24px" }}>
                {isLoading ? (
                  <CircularProgress
                    color="primary"
                    size={16}
                  />
                ) : (
                  <ExpandMoreIcon
                    onClick={onLoadMoreNews}
                    sx={{ cursor: "pointer" }}></ExpandMoreIcon>
                )}
              </Box>
            </Stack>
          </SimpleBarStyled>
        </Box>
      </>
    </DashboardTile>
  );
};
