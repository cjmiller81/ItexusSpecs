import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";

export const CustomDateSelector = ({ setSelectedDate, selectedDate }) => {
  const handleNextDay = () => {
    setSelectedDate(prevDate => moment(prevDate).add(1, "days").toDate());
  };

  const handlePrevDay = () => {
    setSelectedDate(prevDate => moment(prevDate).subtract(1, "days").toDate());
  };

  const isNeedShowPrevButton = useMemo(() => {
    const currentDate = moment(new Date()).startOf('day');
    const prevDate = moment(selectedDate).startOf('day');
  
    const differenceInDays = prevDate.diff(currentDate, 'days');
  
    return differenceInDays > 0;
  }, [selectedDate]);

  return (
    <Stack
      direction="row"
      alignItems="center">

      {isNeedShowPrevButton && (
        <IconButton
          onClick={handlePrevDay}
          size="small">
           <ArrowBackIos fontSize="inherit" />
        </IconButton>
      )}
      
      <Typography
        sx={{ pt: "2px", fontSize: "medium", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        variant="h6">
        {moment(selectedDate).format("MM/DD/YYYY")}
      </Typography>

      <IconButton
        onClick={handleNextDay}
        size="small">
        <ArrowForwardIos fontSize="inherit" />
      </IconButton>
    </Stack>
  );
};
