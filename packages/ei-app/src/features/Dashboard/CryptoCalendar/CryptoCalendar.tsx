import { SimpleBarStyled } from "@/components/SimpleBarStyled";
import { CustomDateSelector } from "@/features/Dashboard/CryptoCalendar/CustomDateSelector";
import { DashboardTile } from "@/features/Dashboard/DashboardTile";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Divider, Grid, IconButton, useTheme } from "@mui/material";
import { AppModal } from "components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarEventTile from "./CalendarEventTile";
import { CalendarEvent } from "./eventsResponseModel";

const CryptoCalendar = ({
  loading,
  title,
  icon,
  calendarData,
  setSelectedDate,
  selectedDate,
  sx,
}: {
  loading: boolean;
  title: string;
  icon: React.ReactNode;
  calendarData: CalendarEvent[];
  setSelectedDate: (date: Date) => void;
  selectedDate: Date;
  sx?: object;
}) => {
  const { t } = useTranslation("CryptoCalendar");
  const theme = useTheme();
  return (
    <>
      <DashboardTile
        title={title}
        icon={icon}
        loading={loading}
        sx={sx}>
        <Box>
          <SimpleBarStyled style={{ height: "282px" }}>
            <Grid
              container
              spacing={0}>
              {calendarData.map((event, index) => (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{ borderRadius: "0px" }}
                    key={index}>
                    <CalendarEventTile
                      event={event}
                    />
                  </Grid>
                  {index !== calendarData.length - 1 && (
                    <Divider
                      sx={{ width: "100%" }}
                      variant="fullWidth"
                    />
                  )}
                </>
              ))}
            </Grid>
          </SimpleBarStyled>
          <Divider
            sx={{ width: "100%" }}
            variant="fullWidth"
          />
          <Box sx={{ display: "flex", justifyContent: "center", margin: "3px 1px" }}>
            <CustomDateSelector
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          </Box>
        </Box>
      </DashboardTile>
    </>
  );
};

export default CryptoCalendar;
