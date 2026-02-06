import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Stack, Button, Divider } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";

export const CustomDateSelector = ({ setSelectedDate, selectedDate }) => {
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState<boolean>(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [showPresetButtons, setShowPresetButtons] = useState(false);
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

  const handleOpenPopover = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, isStartDate: boolean) => {
    if (isPopoverOpen) {
      setIsPopoverOpen(false);
      setShowPresetButtons(false);
    } else {
      setIsSelectingStart(isStartDate);
      setIsPopoverOpen(true);
      if (isStartDate) {
        setShowPresetButtons(true);
      }
    }
  };

  const handlePresetClick = (preset: string) => {
    const currentDate = moment().startOf("day");

    let newStartDate, newEndDate;

    switch (preset) {
      case "next7":
        newStartDate = currentDate;
        newEndDate = currentDate.clone().add(7, "days").endOf("day");
        break;
      case "next30":
        newStartDate = currentDate;
        newEndDate = currentDate.clone().add(30, "days").endOf("day");
        break;
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    setSelectedDate([newStartDate.toDate(), newEndDate.toDate()]);

    setIsPopoverOpen(false);
  };

  const handleDateChange = (date: Moment) => {
    if (isSelectingStart) {
      setStartDate(date);
      setSelectedDate([date.toDate(), endDate ? endDate.toDate() : date.toDate()]);
    } else {
      setEndDate(date);
      setSelectedDate([startDate ? startDate.toDate() : date.toDate(), date.endOf("day").toDate()]);
    }
    setIsPopoverOpen(false);
  };

  const disablePastDates = (date: Moment) => date.isBefore(moment(), "day");

  const disableToDates = (date: Moment) => {
    if (startDate && date.isBefore(startDate, "day")) {
      return true;
    }
    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack
        direction="column-reverse"
        alignItems="center">
        <Box
          display={"flex"}
          alignItems="center"
          gap={2.5}
          sx={{
            "@media (min-width: 1200px) and (max-width: 1800px)": {
              display: "block",
              pt: "5px",
            },
          }}>
          <Box display="flex">
            <Typography
              variant="body2"
              sx={{ fontSize: "14px" }}>
              {t("From")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                height: "20px",
                padding: "1px 4px",
                marginLeft: "8px",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: "gray",
                display: "inline-block",
              }}
              onClick={e => handleOpenPopover(e, true)}>
              {startDate ? moment(startDate).format("MM/DD/YYYY") : t("SelectDateRange")}
            </Typography>
          </Box>

          <Box
            display="flex"
            sx={{
              "@media (min-width: 1200px) and (max-width: 1800px)": {
                pt: "10px",
              },
            }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px" }}>
              {t("To")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                height: "20px",
                padding: "1px 4px",
                marginLeft: "8px",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: "gray",
                display: "inline-block",
              }}
              onClick={e => handleOpenPopover(e, false)}>
              {endDate ? moment(endDate).format("MM/DD/YYYY") : t("SelectDateRange")}
            </Typography>
          </Box>
        </Box>

        {isPopoverOpen && isSelectingStart && (
          <Box
            ref={calendarRef}
            sx={{
              bgcolor: "background.paper",
              position: "absolute",
              bottom: "25px",
              border: "1px solid",
              borderRadius: "30px",
              p: 1,
              width: "100%",
            }}>
            {showPresetButtons && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    paddingLeft: "20px",
                    color: "#219a83",
                  }}
                  onClick={() => handlePresetClick("next7")}>
                  {t("Next7days")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    paddingRight: "20px",
                    color: "#219a83",
                  }}
                  onClick={() => handlePresetClick("next30")}>
                  {t("Next30days")}
                </Typography>
              </Box>
            )}

            <DateCalendar
              value={startDate}
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

        {isPopoverOpen && !isSelectingStart && (
          <Box
            ref={calendarRef}
            sx={{
              bgcolor: "background.paper",
              position: "absolute",
              bottom: "25px",
              border: "1px solid",
              borderRadius: "30px",
              p: 1,
              width: "100%",
            }}>
            <DateCalendar
              value={endDate}
              onChange={handleDateChange}
              shouldDisableDate={date => disablePastDates(date) || disableToDates(date)}
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
