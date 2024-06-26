import React, { useState } from "react"
import { CircularProgress, Stack, Typography, IconButton } from "@mui/material"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"
import { format, addDays, subDays } from "date-fns"

export const DatePicker = ({ setSelectedDate, selectedDate }) => {

  const handlePreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1))
  }

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1))
  }

  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ marginBottom: 1 }}>
      <IconButton onClick={handlePreviousDay} size="small">
        <ArrowBackIos fontSize="inherit" />
      </IconButton>
      <Typography
        sx={{ pt: "2px", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        variant="h6"
      >
        {format(selectedDate, "MM/dd/yyyy")}
      </Typography>

      <IconButton onClick={handleNextDay} size="small">
        <ArrowForwardIos fontSize="inherit" />
      </IconButton>
    </Stack>
  )
}
