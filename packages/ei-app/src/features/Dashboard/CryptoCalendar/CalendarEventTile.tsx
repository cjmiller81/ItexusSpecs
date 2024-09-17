import AppleIcon from "@mui/icons-material/Apple";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GoogleIcon from "@mui/icons-material/Google";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WindowIcon from "@mui/icons-material/Window";
import {
  IconButton,
  Link,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useTheme,
} from "@mui/material";
import { darken, lighten, Stack, StackProps } from "@mui/system";
import moment from "moment";
import { FC, MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarEvent } from "./eventsResponseModel";
import ImageSlider from "./ImageSlider";

export type Props = StackProps & {
  event: CalendarEvent;
};

const CalendarEventTile: FC<Props> = ({ event, sx, ...props }) => {
  const { t } = useTranslation("CalendarEventTile");
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);

  const handleOpenCalendarMenuClick: MouseEventHandler<HTMLButtonElement> = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCalendarMenu = () => {
    setAnchorEl(null);
  };

  const baseUrl = process.env.COIN_MARKET_CALENDAR_IMAGE_URL;
  const imagesUrls = event.coins.map(coin => `${baseUrl}${coin.id}_normal.png`);

  const googleUrl = new URL("https://calendar.google.com/calendar/render");
  const googleDateFormatted = moment(event.date_event).format("YYYYMMDD");
  googleUrl.searchParams.set("action", "TEMPLATE");
  googleUrl.searchParams.set("text", event.title["en"]);
  googleUrl.searchParams.set("dates", `${googleDateFormatted}/${googleDateFormatted}`);
  googleUrl.searchParams.set("details", event.title["en"]);
  const googleUrlString = googleUrl.toString();

  const outlookUrl = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
  outlookUrl.searchParams.append("path", "/calendar/action/compose");
  outlookUrl.searchParams.append("subject", event.title["en"]);
  outlookUrl.searchParams.append("startdt", moment(event.date_event).format());
  outlookUrl.searchParams.append("enddt", moment(event.date_event).format());
  outlookUrl.searchParams.append("body", event.title["en"]);
  const outlookUrlString = outlookUrl.toString();

  const appleIcsContent = `
    BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    SUMMARY:${event.title["en"]}
    DTSTART:${googleDateFormatted}
    DTEND:${googleDateFormatted}
    DESCRIPTION:${event.title["en"]}
    END:VEVENT
    END:VCALENDAR
    `;
  const blob = new Blob([appleIcsContent], { type: "text/calendar" });
  const appleUrl = URL.createObjectURL(blob);

  return (
    <Stack
      sx={{ p: 1.5, pt: 0.5, ...sx }}
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
              fontWeight: 500,
              letterSpacing: 0.5,
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
          <IconButton onClick={handleOpenCalendarMenuClick}>
            <CalendarMonthIcon
              color={"primary"}
              sx={{ width: "20px", height: "20px", cursor: "pointer" }}></CalendarMonthIcon>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseCalendarMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem
              component={Link}
              target={"_blank"}
              href={googleUrlString}
              onClick={handleCloseCalendarMenu}>
              <CalendarItemContent
                title={"Google"}
                icon={<GoogleIcon />}
              />
            </MenuItem>
            <MenuItem
              component={Link}
              target={"_blank"}
              href={outlookUrlString}
              onClick={handleCloseCalendarMenu}>
              <CalendarItemContent
                title={"Outlook"}
                icon={<WindowIcon />}
              />
            </MenuItem>
            <MenuItem
              component={Link}
              target={"_blank"}
              href={appleUrl}
              onClick={handleCloseCalendarMenu}>
              <CalendarItemContent
                title={"Apple"}
                icon={<AppleIcon />}
              />
            </MenuItem>
          </Menu>
          <ScheduleIcon
            color={"primary"}
            sx={{ width: "20px", height: "20px", cursor: "pointer" }}></ScheduleIcon>
        </Stack>
      </Stack>

      <Stack
        spacing={1}
        alignItems={"center"}>
        <Stack
          alignItems={"center"}
          width={"100%"}>
          <Typography
            color="#71A5D7"
            variant="h7">
            {event.displayed_date}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              textDecorationColor:
                theme.palette.mode === "light" ? darken(theme.palette.primary.main, 0.4) : theme.palette.primary.main,
            }}
            color={
              theme.palette.mode === "light"
                ? darken(theme.palette.primary.main, 0.6)
                : lighten(theme.palette.primary.main, 0.8)
            }
            variant="h6">
            {event.title["en"]}
          </Typography>
        </Stack>
        <Stack
          justifyContent={"space-around"}
          width="100px">
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

const CalendarItemContent: FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={1}>
      {icon}
      <Typography variant="subtitle1">{title}</Typography>
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
  padding: ".3rem 1rem",
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
