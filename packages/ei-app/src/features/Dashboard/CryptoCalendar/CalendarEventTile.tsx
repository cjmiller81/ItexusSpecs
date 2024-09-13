import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Link, styled, Tooltip, tooltipClasses, TooltipProps, Typography, useTheme } from "@mui/material";
import { darken, Stack, StackProps } from "@mui/system";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CalendarEvent } from "./eventsResponseModel";
import ImageSlider from "./ImageSlider";
export type Props = StackProps & {
  event: CalendarEvent;
  onProofClick: (link: string) => void;
};

const CalendarEventTile: FC<Props> = ({ event, sx, onProofClick, ...props }) => {
  const { t } = useTranslation("CalendarEventTile");
  const theme = useTheme();

  const baseUrl = process.env.COIN_MARKET_CALENDAR_IMAGE_URL;
  const imagesUrls = event.coins.map(coin => `${baseUrl}${coin.id}_normal.png`);

  return (
    <Stack
      sx={{ p: 2, ...sx }}
      {...props}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1}>
        <ImageSlider
          style={{ width: "28px", minWidth: "28px", height: "28px" }}
          imageUrls={imagesUrls}
        />
        <HtmlTooltip
          arrow
          placement="top-start"
          slotProps={{
            arrow: {
              sx: {
                "&:before": {
                  border: `1px solid ${theme.palette.divider}`,
                },
                color: theme.palette.background.paper,
              },
            },
            tooltip: {
              sx: {
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              },
            },
          }}
          title={
            <>
              {event.coins.map((coin, index) => {
                return (
                  <>
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color: theme.palette.primary.main,
                        fontSize: "12px",
                        textDecoration: "none",
                        ":hover": {
                          textDecoration: "underline",
                        },
                      }}
                      noWrap
                      href={`https://coinmarketcal.com/en/coin/${coin.id}`}
                      component="a">
                      {coin.name}
                    </Typography>
                    {index !== event.coins.length - 1 && (
                      <span style={{ color: theme.palette.text.primary }}>{", "}</span>
                    )}
                  </>
                );
              })}
            </>
          }>
          <Typography
            width="100%"
            sx={{
              cursor: "pointer",
              ":hover": {
                color: darken(theme.palette.primary.main, 0.2),
                textDecoration: "underline",
              },
            }}
            color={
              theme.palette.primary.main
            }>{`${event.coins[0].name}${event.coins.length > 1 && ` and ${event.coins.length - 1} others`}`}</Typography>
        </HtmlTooltip>
        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}>
          <CalendarMonthIcon
            color={"primary"}
            sx={{ width: "20px", height: "20px", cursor: "pointer" }}></CalendarMonthIcon>
          <ScheduleIcon
            color={"primary"}
            sx={{ width: "20px", height: "20px", cursor: "pointer" }}></ScheduleIcon>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}>
        <Stack
          alignItems={"center"}
          width={"100%"}>
          <Link
            sx={{
              textAlign: "center",
              textDecoration: "none",
              cursor: "pointer",
              ":hover": { textDecoration: "underline", textDecorationColor: "inherit" },
            }}>
            <Typography
              color={
                theme.palette.mode === "light" ? darken(theme.palette.primary.main, 0.2) : theme.palette.primary.main
              }
              variant="h7">
              {event.displayed_date}
            </Typography>
            <Typography
              sx={{
                textDecorationColor:
                  theme.palette.mode === "light" ? darken(theme.palette.primary.main, 0.4) : theme.palette.primary.main,
              }}
              color={
                theme.palette.mode === "light" ? darken(theme.palette.primary.main, 0.4) : theme.palette.primary.main
              }
              variant="h6">
              {event.title["en"]}
            </Typography>
          </Link>
        </Stack>
        <Stack
          height={"100px"}
          justifyContent={"space-around"}
          width="200px">
          <ButtonLink
            width={"100%"}
            onClick={() => onProofClick(event.proof)}>
            {t("Proof")}
          </ButtonLink>
          <ButtonLink
            width={"100%"}
            href={event.source}
            target="_blank">
            {t("Source")}
          </ButtonLink>
        </Stack>
      </Stack>
    </Stack>
  );
};

const ButtonLink = styled(Link)(({ theme }) => ({
  borderRadius: "50rem",
  boxShadow: "none",
  border: "1px solid",
  cursor: "pointer",
  textDecoration: "none",
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  padding: ".5rem 1rem",
  fontSize: "11px",
  fontWeight: 400,
  textAlign: "center",
  display: "flex",
  lineHeight: 1.6,
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none",
  ":hover": {
    transition: theme.transitions.create(["background-color", "border-color", "color"], {
      duration: theme.transitions.duration.short,
    }),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
  },
}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    fontSize: "12px",
    lineHeight: 1.5,
  },
}));

export default CalendarEventTile;
