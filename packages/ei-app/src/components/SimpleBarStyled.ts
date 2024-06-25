import { alpha, styled } from '@mui/material/styles';
import SimpleBar from 'simplebar-react';
export const SimpleBarStyled = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&:before": {
      background: alpha(theme.palette.grey[theme.palette.mode === "dark" ? 100 : 900], 0.48),
    },
    "&.simplebar-visible:before": {
      opacity: 1,
    },
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 10,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: 6,
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}))
