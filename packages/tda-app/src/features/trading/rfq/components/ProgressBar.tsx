import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { BoxProps, Stack } from "@mui/system";
import { FC } from "react";
type ProgressFooterProps = {
  progress: number;
  secondsLeft: number;
  handleReject: () => void;
};

export const ProgressFooter: FC<ProgressFooterProps & BoxProps> = ({
  secondsLeft,
  progress,
  handleReject,
  sx,
  ...props
}) => { 
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        ...sx,
      }}
      {...props}>
      <Stack
        direction="row"
        alignItems="center">
        <Box sx={{ width: "100px", pb: "3px", pr: "4px" }}>
          <Typography
            sx={{ float: "right", width: "fit-content" }}
            component="div">
            {`${secondsLeft.toFixed()} seconds`}
          </Typography>
        </Box>
        <Stack alignItems="center">
          <LinearProgress
            sx={{ width: 140, marginTop: 0, borderRadius: 50 }}
            variant="determinate"
            value={progress}
          />
        </Stack>

        <Box
          sx={{ pb: "2px", pl: 2, width: "100px" }}
          width="100%">
          <Button onClick={handleReject}>Reject</Button>
        </Box>
      </Stack>
    </Box>
  );
};
