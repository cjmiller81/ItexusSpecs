import React, { useEffect, useState } from "react"
import { Grid, Card, CardContent, Typography, Box } from "@mui/material"
import { styled, useTheme } from "@mui/system"
import { useTranslation } from "react-i18next"
import { DashboardTile } from "@/features/Dashboard/DashboardTile"
import { CustomDateSelector } from "@/features/CryptoCalendar/CustomDateSelector"
import { Theme } from "@mui/material/styles"

interface CustomCardProps {
  theme: Theme
}

interface CalendarEvent {
  id: number
  title: { en: string }
  coins: { id: string; name: string; rank: number; symbol: string; fullname: string }[]
  date_event: string
  categories: { id: number; name: string }[]
  proof: string
  source: string
}

const Container = styled("div")(({ theme }: { theme: Theme }) => ({
  padding: "5px",
  borderRadius: "3px",
  boxShadow: theme.shadows[8],
}))

const CustomCard = styled(Card)<CustomCardProps>(({ theme }) => ({
  height: "90px",
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
  setSelectedDate,
  selectedDate,
}: {
  loading: boolean
  title: string
  icon: React.ReactNode
  calendarData: CalendarEvent[]
  setSelectedDate: (date: Date) => void
  selectedDate: Date
}) => {
  const { t } = useTranslation("CryptoCalendar")
  const theme = useTheme<Theme>()
  const pageSize = 8
  const [displayEvents, setDisplayEvents] = useState<CalendarEvent[]>([])
  const [lastViewIndex, setLastViewIndex] = useState<number>(pageSize)
  const [shouldDisplayReadMore, setShouldDisplayReadMore] = useState<boolean>(false)

  useEffect(() => {
    if (calendarData) {
      setDisplayEvents(calendarData.slice(0, pageSize))
      setLastViewIndex(pageSize)
    }
  }, [pageSize, selectedDate])

  useEffect(() => {
    setShouldDisplayReadMore(calendarData.length > displayEvents.length && displayEvents.length >= pageSize)
  }, [displayEvents])

  const handleReadMore = () => {
    const startIndex = lastViewIndex
    const endIndex = startIndex + pageSize
    const initialEvents = calendarData?.slice(startIndex, endIndex) || []
    setLastViewIndex(endIndex)
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
        datePicker={
          <CustomDateSelector
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        }>
        <Container theme={theme}>
          {displayEvents.length === 0 ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ height: 200 }}>
              <Typography
                variant="body1"
                color="text.secondary">
                {t("NoEventsAvailable")}
              </Typography>
            </Grid>
          ) : (
            <Grid
              container
              spacing={0}>
              {displayEvents.map((event, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={index}>
                  <a
                    href={event.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}>
                    <CustomCard theme={theme}>
                      <Box sx={{ display: "flex" }}>
                        <img
                          src={event.proof}
                          alt="Proof"
                          style={{ width: 35, height: 25, objectFit: "cover", marginRight: 10 }}
                        />
                        <CardContentCustom theme={theme}>
                          <Typography
                            variant="h6"
                            color="text.primary"
                            component="div"
                            gutterBottom
                            sx={{ fontSize: "12px" }}>
                            {event.title.en}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom>
                            {event.coins.map(coin => coin.fullname).join(", ")}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            gutterBottom>
                            {event.categories.map(category => category.name).join(", ")}
                          </Typography>
                        </CardContentCustom>
                      </Box>
                    </CustomCard>
                  </a>
                </Grid>
              ))}
            </Grid>
          )}
          {shouldDisplayReadMore && (
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
                color={(theme: Theme) => theme.palette.primary.main}
                onClick={handleReadMore}>
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
