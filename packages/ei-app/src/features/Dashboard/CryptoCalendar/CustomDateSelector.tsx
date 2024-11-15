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
        top: rect.top + window.scrollY - 338,
        left: rect.left + window.scrollX - 65,
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
          sx={{
            cursor: "pointer",
            height: "20px",
            padding: "1px 4px",
            border: "1px solid",
            borderRadius: "4px",
            borderColor: "gray",
            display: "inline-block",
          }}
          onClick={handleOpenPopover}>
          {startDate && endDate && !startDate.isSame(endDate, "day")
            ? `${moment(startDate).format("MM/DD/YYYY")} - ${moment(endDate).format("MM/DD/YYYY")}`
            : startDate
              ? moment(startDate).format("MM/DD/YYYY")
              : t("SelectDateRange")}
        </Typography>

        {anchorPosition && isPopoverOpen && (
          <Box
            ref={calendarRef}
            sx={{
              position: "absolute",
              top: anchorPosition.top,
              left: anchorPosition.left,
              bgcolor: "background.paper",
              border: "1px solid",
              borderRadius: "30px",
              p: 1,
              width: "220px",
              "@media (max-width: 600px)": {
                width: "88.8%",
                left: window.scrollX + 23,
              },
              "@media (min-width: 601px) and (max-width: 960px)": {
                width: "94.5%",
                left: window.scrollX + 23,
              },
              "@media (min-width: 961px)": {
                width: "14.6%",
                left: "83.7%",
              },
              "@media (min-width: 3820px)": {
                width: "16.1%",
                left: "91.5%",
                transform: "translateX(-50%)",
              },
            }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", paddingLeft: "20px", color: "#03A9F4" }}
                onClick={() => handlePresetClick("next7")}>
                {t("Next7days")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", paddingRight: "20px", color: "#03A9F4" }}
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
                maxHeight: "290px",
                width: "98%",
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
