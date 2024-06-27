import React, { useEffect, useState } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material"
import { styled, useTheme } from "@mui/system"
import { useTranslation } from "react-i18next"
import { DashboardTile } from "@/features/Dashboard/DashboardTile"
import { CustomDateSelector } from "@/features/CryptoCalendar/CustomDateSelector"
import {
  useGetCalendarEventsByDateQuery,
  useMockGetEventsByDate,
} from "@/libs/redux/Apis/CryptoCalendarApi"
import moment from "moment"
import { Theme } from "@mui/material/styles"

interface CalendarEvent {
  title: { en: string };
  coins: { fullname: string }[];
  categories: { name: string }[];
  source: string;
}

const Container = styled("div")(({ theme }: { theme: Theme }) => ({
  minWidth: "400px",
  padding: "5px",
  borderRadius: "3px",
  boxShadow: theme.shadows[8],
}))

const CustomCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: "80px",
  color: theme.palette.grey[100],
  boxShadow: theme.shadows[2],
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "7px",
  margin: "2px",
}))

const CardContentCustom = styled(CardContent)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.grey[900],
  padding: "5px",
  flexGrow: 1,
}))

const CryptoCalendar = ({
                          loading,
                          title,
                          icon,
                          calendarData,
                        }: {
  loading: boolean;
  title: string;
  icon: React.ReactNode;
  calendarData: CalendarEvent[];
}) => {
  const { t } = useTranslation("CryptoCalendar")
  const theme = useTheme<Theme>()
  const eventsDisplayed = 8
  const [displayEvents, setDisplayEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const {
    data: cryptoCalendarDataByDate,
  } = useMockGetEventsByDate(moment(selectedDate).format("YYYY-MM-DD"))

  const { data: dateEvents, isLoading: isLoadingDate } = useGetCalendarEventsByDateQuery({
    date: moment(selectedDate).format("YYYY-MM-DD"),
  })

  useEffect(() => {
    if (cryptoCalendarDataByDate && cryptoCalendarDataByDate.body) {
      setDisplayEvents(cryptoCalendarDataByDate.body.slice(0, eventsDisplayed))
    }
  }, [eventsDisplayed, selectedDate])

  const handleReadMore = () => {
    const startIndex = eventsDisplayed
    const endIndex = startIndex + eventsDisplayed
    const initialEvents = cryptoCalendarDataByDate?.body?.slice(startIndex, endIndex) || []
    if (initialEvents.length > 0) {
      setDisplayEvents(initialEvents)
    }
  }

  return (
    <>
      <DashboardTile
        title={title}
        icon={icon}
        loading={loading}
        datePicker={<CustomDateSelector setSelectedDate={setSelectedDate} selectedDate={selectedDate} />}
      >
        <Container theme={theme}>
          {displayEvents.length === 0 ? (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: 200 }}>
              <Typography variant="body1" color="text.secondary">
                {t("NoEventsAvailable")}
              </Typography>
            </Grid>
          ) : (
            <Grid container spacing={0}>
              {displayEvents.map((event, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <a href={event.source} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <CustomCard theme={theme}>
                      <CardContentCustom theme={theme}>
                        <Typography variant="h6" color="text.primary" component="div"
                                    gutterBottom>
                          {event.title.en}
                        </Typography>
                        <Typography variant="body2" color="text.primary" gutterBottom>
                          {event.coins.map((coin) => coin.fullname).join(", ")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {event.categories.map((category) => category.name).join(", ")}
                        </Typography>
                      </CardContentCustom>
                    </CustomCard>
                  </a>
                </Grid>
              ))}
            </Grid>
          )}
          {cryptoCalendarDataByDate?.body?.length > displayEvents.length && (
            <Box mt={1.5}>
              <Typography
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                pl={1.5}
                variant="h6"
                component="span"
                color={(theme) => theme.palette.primary.main}
                onClick={handleReadMore}
              >
                {t("ReadMore")}
              </Typography>
            </Box>
          )}
        </Container>
      </DashboardTile>
    </>
  )
}

export default CryptoCalendar
