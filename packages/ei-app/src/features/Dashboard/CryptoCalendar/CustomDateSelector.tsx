import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";

export const CustomDateSelector = ({ setSelectedDate, selectedDate }) => {
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState<boolean>(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation("CustomDateSelector");

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

  const handleOpenPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (isPopoverOpen) {
      setAnchorPosition(null);
      setIsPopoverOpen(false);
    } else {
      setAnchorPosition({
        top: rect.top + window.scrollY - 320,
        left: rect.left + window.scrollX - 64,
      });
      setIsPopoverOpen(true);
    }
  };

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
      setAnchorPosition(null);
      setIsPopoverOpen(false);
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
    setAnchorPosition(null);
    setIsPopoverOpen(false);
    setIsSelectingStart(true);
  };

  const disablePastDates = (date: Moment) => date.isBefore(moment(), "day");

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack
        direction="row"
        alignItems="center">
        <Typography
          variant="body2"
          sx={{ cursor: "pointer", height: "20px" }}
          onClick={handleOpenPopover}>
          {startDate && endDate
            ? `${moment(startDate).format("MM/DD/YYYY")} - ${moment(endDate).format("MM/DD/YYYY")}`
            : t("SelectDateRange")}
        </Typography>

        {anchorPosition && isPopoverOpen && (
          <Box
            ref={calendarRef}
            sx={{
              position: "absolute",
              top: anchorPosition.top,
              left: anchorPosition.left,
              width: "245px",
              bgcolor: "background.paper",
              p: 1,
            }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("today")}>
                {t("Today")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("tomorrow")}>
                {t("Tomorrow")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("next7")}>
                {t("Next7days")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => handlePresetClick("next30")}>
                {t("Next 30 days")}
              </Typography>
            </Box>

            <Divider sx={{ marginBottom: "-10px" }} />

            <DateCalendar
              value={isSelectingStart ? startDate : endDate}
              onChange={handleDateChange}
              shouldDisableDate={disablePastDates}
              sx={{
                width: "240px",
                maxHeight: "290px",
                "& .MuiPickersDay-root.Mui-disabled": {
                  textDecoration: "line-through",
                },
              }}
            />
          </Box>
        )}
      </Stack>
    </LocalizationProvider>
  );
};
