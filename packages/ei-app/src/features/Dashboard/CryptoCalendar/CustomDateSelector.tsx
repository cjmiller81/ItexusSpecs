import { ArrowForwardIos } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";

export const CustomDateSelector = ({ setSelectedDate, selectedDate }) => {
  const handleNextDay = () => {
    setSelectedDate(prevDate => moment(prevDate).add(1, "days").toDate());
  };

  return (
    <Stack
      direction="row"
      alignItems="center">
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
