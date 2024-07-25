import { alpha, styled, SxProps, Theme } from "@mui/system";
import SimpleBar from "simplebar-react";

export const nativeBarSx: SxProps<Theme> = {
  "&::-webkit-scrollbar": {
    width: "6px",
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
    width: "6px",
    height: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme => alpha(theme.palette.grey[theme.palette.mode === "dark" ? 100 : 900], 0.48),
    borderRadius: "6px",
  },
};

export const SimpleBarStyled = styled(SimpleBar)(() => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&:before": {
      background: theme => alpha(theme.palette.grey[theme.palette.mode === "dark" ? 100 : 900], 0.48),
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
}));
