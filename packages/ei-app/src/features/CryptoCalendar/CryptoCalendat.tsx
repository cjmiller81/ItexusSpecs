import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { CryptoCalendarHeader } from "@/features/CryptoCalendar/CryptoCalendarHeader";
import { useTranslation } from "react-i18next";
import { DashboardTile } from "@/features/Dashboard/DashboardTile"
import { AppLink } from "components"

const Container = styled('div')({
  minWidth: 400,
  padding: 5,
  borderRadius: 3,
  boxShadow: '0px 0px 4px 4px rgba(0, 0, 0, 0.3)',
});

const CustomCard = styled(Card)({
  height: 80,
  color: theme => theme.palette.grey[100],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: 7,
  margin: 3,
});

const CardContentCustom = styled(CardContent)({
  color: theme => theme.palette.grey[900],
  padding: 5,
  flexGrow: 1,
});

const CryptoCalendar = ({ loading, title, icon, calendarData }) => {
  const { t } = useTranslation("CryptoCalendar");
  const [eventsDisplayed, setEventsDisplayed] = useState(8);
  const [displayEvents, setDisplayEvents] = useState([]);

  useEffect(() => {
    // Initially set the displayEvents to the first 8 items from calendarData
    setDisplayEvents(calendarData.slice(0, eventsDisplayed));
  }, [calendarData, eventsDisplayed]);

  const handleReadMore = () => {
    // Calculate the next set of events to display
    const startIndex = eventsDisplayed;
    const endIndex = startIndex + 8;
    const nextDisplayEvents = calendarData.slice(startIndex, endIndex);

    // Update states to reflect the new set of displayed events
    setEventsDisplayed(endIndex);
    setDisplayEvents([...nextDisplayEvents]);
  };


  return (
    <>
      {/*<CryptoCalendarHeader title={title} icon={icon} loading={loading} />*/}
      <DashboardTile
        title={title}
        icon={icon}
        loading={loading}>
      <Container>
        {loading ? (
          <CircularProgress sx={{ color: "success.main", marginLeft: "auto", marginRight: 0 }} size="1rem" />
        ) : (
          <Grid container spacing={0}>
            {displayEvents.map((event, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <a href={event.source} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <CustomCard>
                    <CardContentCustom>
                      <Typography variant="h6" component="div" gutterBottom>
                        {event.title.en}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {event.coins.map(coin => coin.fullname).join(', ')}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom>
                        {event.categories.map(category => category.name).join(', ')}
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
              color={theme => theme.palette.primary.main}
              onClick={handleReadMore}
              > {t("ReadMore")}
            </Typography>
          </Box>
        )}
      </Container>
      </DashboardTile>
    </>
  );
};

export default CryptoCalendar;
