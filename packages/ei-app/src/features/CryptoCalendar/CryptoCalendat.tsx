import React, { useEffect, useState } from "react"
import { CircularProgress, Grid, Card, CardContent, Typography, Box, Stack } from "@mui/material"
import { styled } from "@mui/system"
import { useTranslation } from "react-i18next"
import { DashboardTile } from "@/features/Dashboard/DashboardTile"
import axios from "axios"
import { DatePicker } from "@/features/CryptoCalendar/DatePicker"
import {
  useGetAllCalendarEventsQuery,
  useGetCalendarEventsByDateQuery,
  useMockGetAllEvents, useMockGetEventsByDate,
} from "@/libs/redux/Apis/CryptoCalendarApi"

const moment = require("moment")

const Container = styled("div")({
  minWidth: 400,
  padding: 5,
  borderRadius: 3,
  boxShadow: (theme) => theme.shadows?.[8],
})

const CustomCard = styled(Card)({
  height: 80,
  color: (theme) => theme.palette.grey[100],
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: 7,
  margin: 3,
})

const CardContentCustom = styled(CardContent)({
  color: (theme) => theme.palette.grey[900],
  padding: 5,
  flexGrow: 1,
})

const CryptoCalendar = ({ loading, title, icon, calendarData }) => {
  const { t } = useTranslation("CryptoCalendar")
  const [eventsDisplayed, setEventsDisplayed] = useState(8)
  const [displayEvents, setDisplayEvents] = useState([])
  const iconTitle = t(title)
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const {
    data: cryptoCalendarDataByDate,
    isLoading: cryptoCalendarIsLoading,
  } = useMockGetEventsByDate(moment(selectedDate).format("YYYY-MM-DD"))

  const { data: allEvents, isLoading: isLoadingAll } = useGetAllCalendarEventsQuery()
  const { data: dateEvents, isLoading: isLoadingDate } = useGetCalendarEventsByDateQuery({ date: "2024-06-26" })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://api.coinmarketcal.com/v1/events", {
          params: { date: "2024-06-27" },
          headers: { "x-api-key": `${process.env.CALENDAR_EVENTS_API_KEY}` },
        })
        setEvents(response.data)
        console.log(response.data, "response.data")
      } catch (error) {
        console.log(error)
      }
    }
    fetchEvents()
  }, [])


  // useEffect(() => {
  //   console.log(selectedDate, "selectedDate")
  //   console.log(cryptoCalendarDataByDate, "cryptoCalendarDataByDate")
  //   setDisplayEvents(cryptoCalendarDataByDate.body)
  // }, [selectedDate])


  useEffect(() => {
    setDisplayEvents(cryptoCalendarDataByDate.body.slice(0, eventsDisplayed))
  }, [calendarData, eventsDisplayed, selectedDate])

  const handleReadMore = () => {
    const startIndex = eventsDisplayed
    const endIndex = startIndex + 8
    const nextDisplayEvents = calendarData.slice(startIndex, endIndex)
    setDisplayEvents(nextDisplayEvents)
  }

  return (
    <>
      <DashboardTile
        title={iconTitle}
        icon={icon}
        loading={loading}
        datePicker={<DatePicker setSelectedDate={setSelectedDate} selectedDate={selectedDate} />}
      >
        <Container>
          {loading ? (
            <CircularProgress
              sx={{ color: "success.main", marginLeft: "auto", marginRight: 0 }}
              size="1rem"
            />
          ) : (
            <Grid container spacing={0}>
              {displayEvents.map((event, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <a
                    href={event.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <CustomCard>
                      <CardContentCustom>
                        <Typography variant="h6" component="div" gutterBottom>
                          {event.title.en}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {event.coins.map((coin) => coin.fullname).join(", ")}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                        >
                          {event.categories.map((category) => category.name).join(", ")}
                        </Typography>
                      </CardContentCustom>
                    </CustomCard>
                  </a>
                </Grid>
              ))}
            </Grid>
          )}
          {eventsDisplayed < calendarData.length && (
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
                target="_blank"
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
