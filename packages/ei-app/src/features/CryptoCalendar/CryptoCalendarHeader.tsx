import React from 'react';
import { CircularProgress, Stack, Typography } from "@mui/material";

export const CryptoCalendarHeader = ({ title, icon, loading }) => {
  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ marginBottom: 1 }}>
      {icon}
      <Typography
        sx={{ pt: "2px", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        variant="h6"
      >
        {title}
      </Typography>
      {loading && (
        <CircularProgress sx={{ color: "success.main", marginLeft: "auto", marginRight: 0 }} size="1rem" />
      )}
    </Stack>
  );
};
