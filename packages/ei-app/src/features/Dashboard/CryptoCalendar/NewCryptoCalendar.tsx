import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { 
  Box, 
  FormControl, 
  MenuItem, 
  ListItemText, 
  IconButton, 
  useTheme,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Stack,
  alpha,
  Paper
} from "@mui/material";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CalendarEvent, CategoriesResponse, Coin } from "./eventsResponseModel";
import { useGetCategoriesQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ClearIcon, DateCalendar, DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { CoinsLookupVirtualized, OnFetchResponse } from "components";
import { CoinsLookUpOption } from "components/src/components/common/inputs/AppSymbolLookup/CoinsLookup";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import WindowIcon from "@mui/icons-material/Window";
import { Menu, Link } from "@mui/material";

interface Props {
  onFetchPage: (pageNumber: number, searchQuery: string) => Promise<OnFetchResponse>;
  loading: boolean;
  title: string;
  icon: React.ReactNode;
  calendarData: CalendarEvent[];
  setSelectedDate: (dateRange: [Date, Date]) => void;
  selectedDate: [Date, Date];
  sx?: object;
}

const NewCryptoCalendar: React.FC<Props> = ({
  loading,
  title,
  icon,
  calendarData,
  setSelectedDate,
  selectedDate,
  sx,
  onFetchPage,
}) => {
  const { t } = useTranslation(["CryptoCalendar", "Common"]);
  const [selectedCoins, setSelectedCoins] = useState<CoinsLookUpOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [categoriesData, setCategoriesData] = useState<CategoriesResponse | null>(null);
  const [keywordSearch, setKeywordSearch] = useState<string>("");
  const [activeKeyword, setActiveKeyword] = useState<string>("");
  const [initialCalendarData, setInitialCalendarData] = useState<CalendarEvent[]>([]);
  const [initialWeekCount, setInitialWeekCount] = useState<number>(0);
  const currentUtcDayRef = useRef<number>(moment.utc().startOf("day").valueOf());
  const shouldRefreshCountersRef = useRef<boolean>(false);
  const { data: items } = useGetCategoriesQuery();
  const theme = useTheme();

  useEffect(() => {
    if (items) {
      setCategoriesData(items);
    }
  }, [items]);

useEffect(() => {
  if (calendarData.length === 0) return;

  const shouldInitialize = initialCalendarData.length === 0;
  const shouldRefresh = shouldRefreshCountersRef.current === true;

  if (shouldInitialize || shouldRefresh) {
    setInitialCalendarData(calendarData);

    const selectedStartDate = moment.utc(selectedDate[0]).startOf('day');
    const selectedEndDate = moment.utc(selectedDate[1]).endOf('day');
    const weekEvents = calendarData.filter(event => {
      const eventDate = moment.utc(event.date_event).startOf('day');
      return eventDate.isSameOrAfter(selectedStartDate, 'day') && eventDate.isSameOrBefore(selectedEndDate, 'day');
    });
    setInitialWeekCount(weekEvents.length);

    if (shouldRefresh) shouldRefreshCountersRef.current = false;
  }
}, [calendarData, initialCalendarData.length, selectedDate]);

useEffect(() => {
  const checkDayChange = () => {
    const nowDay = moment.utc().startOf('day').valueOf();
    if (nowDay !== currentUtcDayRef.current) {
      currentUtcDayRef.current = nowDay;
      shouldRefreshCountersRef.current = true;

      const start = moment.utc().startOf('day').toDate();
      const end = moment.utc().add(7, 'days').endOf('day').toDate();
      setSelectedDate([start, end]);
    }
  };

  const intervalId = window.setInterval(checkDayChange, 60_000);
  const onVisibility = () => { if (!document.hidden) checkDayChange(); };
  document.addEventListener('visibilitychange', onVisibility);

  checkDayChange();

  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}, [setSelectedDate]);

  const categories = categoriesData?.body || [];
  const [inputSearch, setInputSearch] = useState("");

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase()),
  );

  const eventCounts = useMemo(() => {
    const today = moment.utc().startOf('day');

    const dataForToday = initialCalendarData.length > 0 ? initialCalendarData : calendarData;

    const todayEvents = dataForToday.filter(event => {
      const eventDate = moment.utc(event.date_event).startOf('day');
      return eventDate.isSame(today, 'day');
    });

    return {
      today: todayEvents.length,
      week: initialWeekCount
    };
  }, [initialCalendarData, calendarData, initialWeekCount]);

  const handleCoinSelect = (value: CoinsLookUpOption[]) => {
    setSelectedCoins(value);
  };

  const getRenderValue = (selected: string[]) => {
    if (selected.length === 0) {
      return t("Category");
    }
    if (selected.length === 1) {
      const selectedCategory = categories.find(category => category.id.toString() === selected[0]);
      return selectedCategory ? selectedCategory.name : "";
    } else return `${selected.length} ${t("Selected", { ns: "Common" })}`;
  };

  const handleCategorySelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleKeywordSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setActiveKeyword(keywordSearch);
    }
  };

  const removeKeyword = () => {
    setActiveKeyword("");
    setKeywordSearch("");
  };

  const filteredEvents = calendarData.filter(event => {
    const eventDate = moment.utc(event.date_event).startOf("day");
    const selectedStartDate = moment.utc(selectedDate[0]).startOf("day");
    const selectedEndDate = moment.utc(selectedDate[1]).startOf("day");

    const correctedEndDate = selectedEndDate.isBefore(selectedStartDate) ? selectedStartDate : selectedEndDate;

    const isWithinDateRange = selectedDate && (
      selectedStartDate.isSame(correctedEndDate, "day") 
        ? eventDate.isSame(selectedStartDate, "day")
        : eventDate.isSameOrAfter(selectedStartDate, "day") && eventDate.isSameOrBefore(correctedEndDate, "day")
    );

    const matchesCategory =
      selectedCategories.length === 0 ||
      event.categories.some(category => selectedCategories.includes(category.id.toString()));

    const matchesCoin =
      selectedCoins.length === 0 || event.coins.some(coin => selectedCoins.map(c => c.id).includes(coin.id.toString()));

    const matchesKeyword = 
      !activeKeyword || 
      event.title["en"].toLowerCase().includes(activeKeyword.toLowerCase()) ||
      event.coins.some(coin => coin.name.toLowerCase().includes(activeKeyword.toLowerCase()));

    const result = isWithinDateRange && matchesCategory && matchesCoin && matchesKeyword;

    return result;
  });

  const handleResetCategories = () => {
    setSelectedCategories([]);
    setSearchCategory("");
  };

  return (
      <Paper 
        elevation={2}
        sx={{ 
          backgroundColor: alpha(
            theme.palette.mode === 'light'
              ? "#fff"
              : theme.palette.grey[900],
            1
          ),
          borderRadius: 2,
        }}>
        <Box sx={{ 
          p: 2,
        }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            mb: 1
          }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                {icon}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {title}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Track upcoming events and listings
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={3} alignItems="center">
            <Stack alignItems="center">
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {eventCounts.today}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="11px">
                Today
              </Typography>
            </Stack>
              <Stack alignItems="center">
                <Typography variant="h6" color="text.primary" fontWeight="bold">
                  {eventCounts.week}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize="11px">
                  This Week
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ 
          position: "sticky", 
          top: 0, 
          zIndex: 1, 
          px: 2,
          mb: "10px",
        }}>
          <Box sx={{ borderRadius: "10px", backgroundColor: alpha(theme.palette.background.paper, 0.6), p: 2, border: `1px solid ${theme.palette.divider}`, }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <FormControl sx={{ flex: 0.8 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Keyword"
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                onKeyPress={handleKeywordSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    minHeight: "36px",
                  }
                }}
              />
            </FormControl>

            <FormControl sx={{ flex: 0.8 }}>
              <Select
                startAdornment={
                  <FilterListIcon sx={{ 
                    fontSize: 16, 
                    color: "text.secondary", 
                    mr: 1,
                    ml: 0.5
                  }} />
                }
                endAdornment={
                  selectedCategories.length > 0 ? (
                    <IconButton
                      onClick={handleResetCategories}
                      size="small"
                      sx={{ mr: 1, p: 0 }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
                multiple
                value={selectedCategories}
                onChange={handleCategorySelect}
                displayEmpty
                renderValue={getRenderValue}
                sx={{
                  minHeight: "36px",
                  borderRadius: "8px",
                  ".MuiSelect-select": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    paddingLeft: "8px",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2px"
                  },
                  "& .MuiSelect-icon": {
                    right: "8px",
                  }
                }}>
                {filteredCategories.map(category => (
                  <MenuItem
                    key={category.id}
                    value={category.id.toString()}>
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 0.8 }}>
              <CoinsLookupVirtualized
                pageSize={50}
                onFetchPage={pageNumber => onFetchPage(pageNumber, inputSearch)}
                loading={false}
                disableListWrap
                value={selectedCoins}
                onChange={(_event, value) => {
                  handleCoinSelect(value);
                }}
                autoComplete={true}
                onInputChange={(_event, value) => {
                  setInputSearch(value);
                }}
                filterOptions={x => x}
                inputValue={inputSearch}
                label="Coin"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px !important",
                    minHeight: "36px !important",
                    height: "36px !important",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.23) !important",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.87) !important",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main !important",
                    },
                  },
                  "& .MuiAutocomplete-inputRoot": {
                    paddingTop: "8px !important",
                    paddingBottom: "8px !important",
                    paddingLeft: "8px !important",
                    fontSize: "12px !important",
                    minHeight: "36px !important",
                    height: "36px !important",
                    borderRadius: "8px !important",
                  },
                  "& .MuiAutocomplete-input": {
                    padding: "8px 12px !important",
                    fontSize: "12px !important",
                  },
                  "& .MuiAutocomplete-endAdornment": {
                    right: "8px !important",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "12px !important",
                    "&.Mui-focused": {
                      color: "primary.main !important",
                    },
                  },
                  "& .MuiAutocomplete-tag": {
                    fontSize: "10px !important",
                    height: "20px !important",
                  },
                  "& .MuiFormControl-root": {
                    minHeight: "36px !important",
                    height: "36px !important",
                  }
                }}
              />
            </FormControl>

            <Box sx={{ flex: 1.4, display: "flex", alignItems: "center", gap: 1 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="From"
                  value={moment(selectedDate[0])}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate([newValue.toDate(), selectedDate[1]]);
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          minHeight: "36px",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: 12,
                          padding: "8px 12px",
                        }
                      }
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  -
                </Typography>
                <DatePicker
                  label="To"
                  value={moment(selectedDate[1])}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate([selectedDate[0], newValue.toDate()]);
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          minHeight: "36px",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: 12,
                          padding: "8px 12px",
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Stack>
          
          {activeKeyword && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={activeKeyword}
                onDelete={removeKeyword}
                size="small"
                color="primary"
              />
            </Box>
          )}
          </Box>
        </Box>

        <SimpleBarStyled
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "transparent !important" : "#fff !important",
            height: "424px",
          }}>
          {filteredEvents.length > 0 ? (
            <Box sx={{ p: 2 }}>
              {filteredEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "190px",
                marginLeft: "15px",
                marginRight: "10px",
                fontSize: "22px",
              }}>
              {t("NoMoreСurrentEventsForThisDate", { ns: "CryptoCalendar" })}
            </Box>
          )}
        </SimpleBarStyled>
      </Paper>
  );
};

const EventCard: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const open = Boolean(anchorEl);
  const baseUrl = process.env.COIN_MARKET_CALENDAR_IMAGE_URL;
  const imagesUrls = event.coins.map(coin => `${baseUrl}${coin.id}_normal.png`);

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

  const getDisplayedDate = (): string => {
    if (event.displayed_date) {
      const text = event.displayed_date.trim();
      const re = /From\s+(\d{1,2})\s+([A-Za-z]+)\s+to\s+(\d{1,2})\s+([A-Za-z]+)(?:\s+\d{4})?/i;
      const match = re.exec(text);
      if (match) {
        const d1 = match[1];
        const m1 = match[2];
        const d2 = match[3];
        const m2 = match[4];
        const m1s = m1.slice(0, 3);
        const m2s = m2.slice(0, 3);
        if (m1.toLowerCase() === m2.toLowerCase()) {
          return `${m1s} ${d1}-${d2}`;
        }
        return `${m1s} ${d1} - ${m2s} ${d2}`;
      }

      const singleDateRe = /(\d{1,2})\s+([A-Za-z]+)(?:\s+\d{4})?/i;
      const singleMatch = singleDateRe.exec(text);
      if (singleMatch) {
        const day = singleMatch[1];
        const month = singleMatch[2].slice(0, 3);
        return `${month} ${day}`;
      }
      return text
        .replace(/From\s+/i, "")
        .replace(/\s+to\s+/i, " - ")
        .replace(/\s+\d{4}$/, "");
    }
    return moment.utc(event.date_event).format("MMM DD");
  };

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

  const handleOpenCalendarMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCalendarMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ 
      p: 1.5, 
      mb: 1, 
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "8px",
      backgroundColor: alpha(theme.palette.background.paper, 0.6)
    }}>
      <Stack direction="row" alignItems="center" spacing={3} sx={{ minHeight: "40px" }}>
        <Box sx={{ 
          width: 28, 
          height: 28, 
          borderRadius: "50%", 
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden"
        }}>
          <img 
            src={imagesUrls[0]} 
            alt={event.coins[0]?.name}
            style={{ width: 20, height: 20, borderRadius: "50%" }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </Box>

        <Box sx={{ width: "50%", minWidth: 0, mr: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ fontSize: 13 }}>
            {event.coins[0]?.name}
            {event.coins.length > 1 ? ` and ${event.coins.length - 1} others` : ""}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
            {event.title["en"]}
          </Typography>
        </Box>

        <Box sx={{ width: "20%", flexShrink: 0, mr: 1, display: "flex", alignItems: "center" }}>
          <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>
            {getDisplayedDate()}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ width: 120, flexShrink: 0, mr: 1, justifyContent: "flex-end" }}>
          <Chip 
            label={eventType.primary} 
            size="small" 
            sx={{ 
              fontSize: 9, 
              height: 25,
              backgroundColor: 'rgba(25, 210, 155, 0.2)',
              color: '#219a83',
              "& .MuiChip-label": {
                px: 2,
                color: '#219a83'
              }
            }}
          />
          <Chip 
            label={eventType.secondary} 
            size="small" 
            sx={{ 
              fontSize: 9, 
              height: 25,
              backgroundColor: theme.palette.grey[800],
              color: '#219a83',
              "& .MuiChip-label": {
                px: 2,
                color: '#fff'
              }
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ width: 60, flexShrink: 0, justifyContent: "flex-start" }}>
          <IconButton size="small" sx={{ p: 0 }} onClick={handleOpenCalendarMenuClick}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
          </IconButton>
          <IconButton size="small" sx={{ p: 0 }}>
            <ScheduleIcon sx={{ fontSize: 14, color: "primary.main" }} />
          </IconButton>
        </Stack>
      </Stack>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseCalendarMenu}
        MenuListProps={{
          "aria-labelledby": "calendar-button",
        }}>
        <MenuItem
          component={Link}
          target={"_blank"}
          href={googleUrlString}
          onClick={handleCloseCalendarMenu}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <GoogleIcon />
            <Typography variant="subtitle1">Google</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          component={Link}
          target={"_blank"}
          href={outlookUrlString}
          onClick={handleCloseCalendarMenu}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WindowIcon />
            <Typography variant="subtitle1">Outlook</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          component={Link}
          target={"_blank"}
          href={appleUrl}
          onClick={handleCloseCalendarMenu}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AppleIcon />
            <Typography variant="subtitle1">Apple</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NewCryptoCalendar;
