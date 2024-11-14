import { Button, Stack, Popover, Box, Divider, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import React, { useState, useEffect } from "react";

export const CustomDateSelector = ({ setSelectedDate, selectedDate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState<boolean>(true);

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      setStartDate(moment(selectedDate[0]));
      setEndDate(moment(selectedDate[1]));
    } else {
      const currentDate = moment().startOf("day");
      setStartDate(currentDate);
      setEndDate(currentDate);
    }
  }, [selectedDate]);

  const handleDateChange = (date: Moment) => {
    if (isSelectingStart) {
      setStartDate(date);
      setEndDate(null);
      setIsSelectingStart(false);
    } else {
      setEndDate(date);

      if (startDate && date.isBefore(startDate)) {
        setStartDate(date);
        setEndDate(startDate);
      } else {
        setSelectedDate([startDate?.toDate(), date.endOf("day").toDate()]);
      }

      setAnchorEl(null);
      setIsSelectingStart(true);
    }
  };

  const handlePresetClick = (preset: string) => {
    let newStartDate, newEndDate;
    const currentDate = moment().startOf("day");
    switch (preset) {
      case "today":
        newStartDate = moment().startOf("day");
        newEndDate = currentDate.endOf("day");
        break;
      case "tomorrow":
        newStartDate = moment().startOf("day").add(1, "days").startOf("day");
        newEndDate = currentDate.add(1, "days").endOf("day");
        break;
      case "next7":
        newStartDate = moment().startOf("day");
        newEndDate = currentDate.add(7, "days").endOf("day");
        break;
      case "next30":
        newStartDate = moment().startOf("day");
        newEndDate = currentDate.add(30, "days").endOf("day");
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectedDate([newStartDate.toDate(), newEndDate.endOf("day").toDate()]);
    setAnchorEl(null);
    setIsSelectingStart(true);
  };

  const disablePastDates = (date: Moment) => {
    return date.isBefore(moment(), "day");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack
        direction="row"
        alignItems="center">
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", height: "20px" }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}>
          {startDate && endDate
            ? `${moment(startDate).format("MM/DD/YYYY")} - ${moment(endDate).format("MM/DD/YYYY")}`
            : "Select Date Range"}
        </Typography>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                marginLeft: "5px",
                marginRight: "5px",
                maxWidth: "250px",
              }}>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("today")}>
                Today
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("tomorrow")}>
                Tomorrow
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("next7")}>
                Next 7 days
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("next30")}>
                Next 30 days
              </Typography>
            </Box>

            <Divider sx={{ marginBottom: "-10px" }} />

            <DateCalendar
              value={isSelectingStart ? startDate : endDate}
              onChange={handleDateChange}
              shouldDisableDate={disablePastDates}
              sx={{
                width: "250px",
                maxHeight: "320px",
                "& .MuiPickersDay-root.Mui-disabled": {
                  textDecoration: "line-through",
                },
              }}
            />
          </Box>
        </Popover>
      </Stack>
    </LocalizationProvider>
  );
};
