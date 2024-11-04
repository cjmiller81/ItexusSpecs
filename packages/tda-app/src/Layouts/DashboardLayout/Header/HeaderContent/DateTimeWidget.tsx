import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import moment from "moment";

const DateTimeWidget: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<string>(moment().format("M/D/YYYY HH:mm:ss"));
  const theme = useTheme();
  const { palette } = theme;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(moment().format("M/D/YYYY HH:mm:ss"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Box
        sx={{
          padding: "2px 8px",
          maxHeight: "8px",
          marginLeft: "4px",
          display: "inline-table",
          border: `1px solid ${palette.grey[600]}`,
          borderRadius: 1,
          backgroundColor: `${palette.grey[100]} !important`,
          color: `${palette.grey[600]} !important`,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
        <Typography
          variant="h6"
          sx={{
            letterSpacing: "0.6px",
            fontSize: "0.75rem",
            fontFamily: theme.typography.fontFamily,
            fontVariantNumeric: "tabular-nums",
          }}>
          {currentDateTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default DateTimeWidget;
