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
  Chip,
  Box,
} from "@mui/material";
import React from "react";
import { darken, lighten, Stack, StackProps } from "@mui/system";
import moment from "moment";
import { FC, MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarEvent } from "./eventsResponseModel";
import ImageSlider from "./ImageSlider";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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

  const handleEventTitleClick = () => {
    window.open(event.source, "_blank");
  };

  const getEventType = () => {
    const categoryName = event.categories[0]?.name?.toLowerCase() || "";
    const categoryDisplayName = event.categories[0]?.name || "Other";
    
    if (categoryName.includes("conference") || categoryName.includes("meetup") || categoryName.includes("ama")) {
      return { primary: "Event", secondary: categoryDisplayName };
    }
    if (categoryName.includes("exchange") || categoryName.includes("listing")) {
      return { primary: "Listing", secondary: categoryDisplayName };
    }
    if (categoryName.includes("tokenomics") || categoryName.includes("unlock") || 
        categoryName.includes("airdrop") || categoryName.includes("snapshot") || 
        categoryName.includes("staking") || categoryName.includes("farming") || 
        categoryName.includes("fork") || categoryName.includes("swap")) {
      return { primary: "Token", secondary: categoryDisplayName };
    }
    if (categoryName.includes("release") || categoryName.includes("roadmap") || 
        categoryName.includes("whitepaper") || categoryName.includes("team update")) {
      return { primary: "Update", secondary: categoryDisplayName };
    }
    if (categoryName.includes("partnership") || categoryName.includes("integration")) {
      return { primary: "Partnership", secondary: categoryDisplayName };
    }
    if (categoryName.includes("branding")) {
      return { primary: "Branding", secondary: categoryDisplayName };
    }
    
    return { primary: "Other", secondary: categoryDisplayName };
  };

  const eventType = getEventType();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ p: 1.2, ...sx }}
      {...props}>
      {/* Левая колонка: иконка и дата */}
      <Stack alignItems="center" sx={{ flexShrink: 0, minWidth: '50px' }}>
        <ImageSlider
          style={{ width: "28px", minWidth: "28px", height: "28px" }}
          imageUrls={imagesUrls}
        />
        <Stack direction="row" alignItems="center" spacing={0.3} sx={{ height: '18px', mt: 'auto' }}>
          <CalendarTodayIcon sx={{ fontSize: "11px", color: theme.palette.text.secondary }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
            {moment(event.date_event).format("MMM DD")}
          </Typography>
        </Stack>
      </Stack>

      {/* Центральная часть: название токенов, описание и pill badges */}
      <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
        {/* Название токенов */}
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
                  <React.Fragment key={coin.id}>
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
                      target="_blank"
                      href={`https://coinmarketcal.com/en/coin/${coin.id}`}
                      component="a">
                      {coin.name}
                    </Typography>
                    {index !== event.coins.length - 1 && (
                      <span style={{ color: theme.palette.text.primary }}>{", "}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </>
          }>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              ":hover": {
                color: darken(theme.palette.primary.main, 0.2),
                textDecoration: "underline",
              },
            }}
            onClick={handleEventTitleClick}
            color={theme.palette.primary.main}
            noWrap
          >
            {event.coins[0].name}
            {event.coins.length > 1 ? ` and ${event.coins.length - 1} others` : ""}
          </Typography>
        </HtmlTooltip>
        
        <Typography
          sx={{
            fontSize: "0.72rem",
            color: theme.palette.text.secondary,
          }}
          noWrap
        >
          {event.title["en"]}
        </Typography>

        <Stack direction="row" spacing={0.5}>
          <Chip
            label={eventType.primary}
            size="small"
            sx={{
              height: '18px',
              fontSize: '0.65rem',
              backgroundColor: '#2D6B5E',
              color: '#66B2A2',
              '& .MuiChip-label': {
                px: 0.8,
              }
            }}
          />
          <Chip
            label={eventType.secondary}
            size="small"
            sx={{
              height: '18px',
              fontSize: '0.65rem',
              backgroundColor: '#4A4A4A',
              color: 'white',
              '& .MuiChip-label': {
                px: 0.8,
              }
            }}
          />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={0.3} alignItems="flex-start" sx={{ flexShrink: 0 }}>
        <IconButton size="small" onClick={handleOpenCalendarMenuClick} sx={{ p: 0.2 }}>
          <CalendarMonthIcon
            color="primary"
            sx={{ width: "15px", height: "15px" }}
          />
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
            target="_blank"
            href={googleUrlString}
            onClick={handleCloseCalendarMenu}>
            <CalendarItemContent
              title="Google"
              icon={<GoogleIcon />}
            />
          </MenuItem>
          <MenuItem
            component={Link}
            target="_blank"
            href={outlookUrlString}
            onClick={handleCloseCalendarMenu}>
            <CalendarItemContent
              title="Outlook"
              icon={<WindowIcon />}
            />
          </MenuItem>
          <MenuItem
            component={Link}
            target="_blank"
            href={appleUrl}
            onClick={handleCloseCalendarMenu}>
            <CalendarItemContent
              title="Apple"
              icon={<AppleIcon />}
            />
          </MenuItem>
        </Menu>
        <IconButton size="small" sx={{ p: 0.2 }}>
          <ScheduleIcon
            color="primary"
            sx={{ width: "15px", height: "15px" }}
          />
        </IconButton>
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
