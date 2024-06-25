import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { CryptoCalendarHeader } from "@/features/CryptoCalendar/CryptoCalendarHeader";
import { useTranslation } from "react-i18next";

const Container = styled('div')({
  minWidth: '500px',
  padding: '5px',
  borderRadius: '3px',
  boxShadow: '0px 0px 4px 4px rgba(0, 0, 0, 0.3)',
});

const CustomCard = styled(Card)({
  height: '80px',
  color: theme => theme.palette.grey[100],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '7px',
  margin: '3px',
});

const CardContentCustom = styled(CardContent)({
  color: theme => theme.palette.grey[900],
  padding: '5px',
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
      <CryptoCalendarHeader title={title} icon={icon} loading={loading} />
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
          <Box sx={{ marginLeft: '20px', textAlign: 'left', color: '#4caf50', cursor: 'pointer' }} onClick={handleReadMore}>
            <Typography variant="h6">{t("ReadMore")}</Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default CryptoCalendar;
