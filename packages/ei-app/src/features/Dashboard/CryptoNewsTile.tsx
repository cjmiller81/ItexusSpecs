import { SimpleBarStyled } from "@/components/SimpleBarStyled"
import { Article } from "@/libs/redux/Apis/NewsApi"
import { Divider, Typography } from "@mui/material"
import { Box, Stack } from "@mui/system"
import { AppLink } from "components"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { DashboardTile, DashboardTileProps } from "./DashboardTile"
import { NewsHeader } from "./NewsHeader"

type Props = Omit<DashboardTileProps, "children"> & {
  news: Article[]
}

export const CryptoNewsTile: FC<Props> = ({ title, icon, news, ...props }) => {
  const { t } = useTranslation("CryptoNewsTile")
  return (
    <DashboardTile
      title={title}
      icon={icon}
      {...props}>
      <Box
        sx={{
          px: 1,
          py: 1.5,
          borderColor: theme => theme.palette.divider,
          borderWidth: "1px",
          borderStyle: "solid",
        }}>
        <SimpleBarStyled style={{ maxHeight: "322px" }}>
          {news.map((article, index) => (
            <Box
              key={article.id}
              sx={{
                mt: index === 0 ? 0 : 1,
              }}>
              <Stack
                gap={0.6}
                px={1.5}>
                <NewsHeader
                  sx={{ height: "16px" }}
                  key={article.id}
                  ago={article.published}
                  source={article.source}
                  tokensIconsUrls={(article.relatedSymbols || []).map(symbol => {
                    const symbolLogo = symbol["base-currency-logoid"]
                    return symbolLogo ? `${process.env.NEWS_ICONS_URL}/${symbolLogo}.svg` : undefined
                  })}
                />
                {article.link ? (
                  <AppLink
                    target="_blank"
                    href={article.link}>
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}>
                      {article.title}
                    </Typography>
                  </AppLink>
                ) : (
                  <Typography>{article.title}</Typography>
                )}
              </Stack>
              <Divider sx={{ borderWidth: "1px", mt: 1 }} />
            </Box>
          ))}
        </SimpleBarStyled>
        <Box mt={1}>
          <Typography
            sx={{
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            pl={1.5}
            variant="body1"
            target="_blank"
            color={theme => theme.palette.primary.main}
            href="https://www.google.com/"
            component={AppLink}>
            {t("ReadMore")}
          </Typography>
        </Box>
      </Box>
    </DashboardTile>
  )
}
