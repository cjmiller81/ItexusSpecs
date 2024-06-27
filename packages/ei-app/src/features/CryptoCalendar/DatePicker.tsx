import React from "react"
import moment from "moment"
import { Stack, Typography, IconButton } from "@mui/material"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"

export const DatePicker = ({ setSelectedDate, selectedDate }) => {

  const handlePreviousDay = () => {
    setSelectedDate((prevDate) => moment(prevDate).subtract(1, "days").toDate())
  }

  const handleNextDay = () => {
    setSelectedDate((prevDate) => moment(prevDate).add(1, "days").toDate())
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <IconButton onClick={handlePreviousDay} size="small">
        <ArrowBackIos fontSize="inherit" />
      </IconButton>
      <Typography
        sx={{ pt: "2px", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        variant="h6"
      >
        {moment(selectedDate).format("MM/DD/YYYY")}
      </Typography>

      <IconButton onClick={handleNextDay} size="small">
        <ArrowForwardIos fontSize="inherit" />
      </IconButton>
    </Stack>
  )
}
