import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Stack, Button, Divider } from "@mui/material";
import { CalendarIcon, DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
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
      setStartDate(null);
      setEndDate(null);
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

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack direction="column-reverse" alignItems="center">
        <Box display={"flex"} alignItems="center" gap={2.5}>
          <Box display="flex">
          <Typography variant="h7" sx={{marginTop:"7px"}}>{t("StartDate")}</Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                height: "35px",
                marginLeft: "20px",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: (theme) => theme.palette.mode === "light" ? "#BDBDBD" : "#616161",
                width:"137px",
                textAlign:"center",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}
              onClick={(e) => handleOpenPopover(e, true)}  
            >
              {startDate ? moment(startDate).format("MM/DD/YYYY") : t("mm/dd/yyyy")}
              <CalendarIcon sx={{ marginLeft: "10px" }} />
            </Typography>
          </Box>

          <Box display="flex">
          <Typography variant="h7" sx={{marginTop:"7px", marginRight:"5px"}}>{t("EndDate")}</Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                height: "35px",
                marginLeft: "8px",
                border: "1px solid",
                borderRadius: "4px",
                borderColor: (theme) => theme.palette.mode === "light" ? "#BDBDBD" : "#616161",
                width:"137px",
                textAlign:"center",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}
              onClick={(e) => handleOpenPopover(e, false)} 
            >
              {endDate ? moment(endDate).format("MM/DD/YYYY") : t("mm/dd/yyyy")}
              <CalendarIcon sx={{ marginLeft: "10px" }} />
            </Typography>
          </Box>
        </Box>

        {isPopoverOpen && isSelectingStart && (
  <Box
    ref={calendarRef}
    sx={{
      bgcolor: "background.paper",
      position: "absolute",
      border: "1px solid",
      borderRadius: "30px",
      top: "100%", // Позиционируем календарь вниз от родительского элемента
      left: "0",
      p: 1,
      width: "100%",
      zIndex: 9999,
    }}
  >
    {showPresetButtons && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "-5px",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            paddingLeft: "20px",
            color: "#03A9F4",
          }}
          onClick={() => handlePresetClick("next7")}
        >
          {t("Today")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            paddingRight: "20px",
            color: "#03A9F4",
          }}
          onClick={() => handlePresetClick("next30")}
        >
          {t("Clear")}
        </Typography>
      </Box>
    )}

    <DateCalendar
      value={startDate}
      onChange={handleDateChange}
      sx={{
        maxHeight: "275px",
        width: "98%",
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
      border: "1px solid",
      borderRadius: "30px",
      top: "100%", // Позиционируем календарь вниз от родительского элемента
      left: "70",
      p: 1,
      margingLeft:"1000px",
      width: "100%",
      zIndex: 9999,
          }}
        >
          <DateCalendar
            value={endDate}
            onChange={handleDateChange}
            sx={{
                maxHeight: "275px",
                width: "98%",
            }}
          />
        </Box>
      )}
      </Stack>
    </LocalizationProvider>
  );
};
