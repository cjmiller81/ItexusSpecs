import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { lighten, useTheme } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import { FC } from "react";
type Props = LoadingButtonProps & {
  cellType: "buy" | "sell";
  yesNo?: boolean;
};
export const CellButton: FC<Props> = ({ sx, cellType, yesNo, ...props }) => {
  const theme = useTheme();
  let bgColor: string = theme.palette.mode === "dark" ? grey[800] : grey[200];

  if (cellType === "sell") {
    bgColor = lighten(theme.palette.mode === "dark" ? red[700] : red[400], 0.4);
  }

  if (cellType === "buy") {
    bgColor = lighten(theme.palette.mode === "dark" ? blue[700] : blue[400], 0.4);
  }
  return (
    <LoadingButton
      variant="text"
      sx={{
        borderRadius: "7px",
        backgroundColor: yesNo ? bgColor : "transparent",
        span: {
          color: theme => theme.palette.common.white,
        },
        ":hover": {
          backgroundColor: "transparent",
          textDecoration: "underline",
          color: theme => theme.palette.common.white,
        },
        color: theme => theme.palette.text.primary,
        fontWeight: 600,
        fontSize: "12px",
        height: "26px",
        minWidth: "10px",
        minHeight: "12px",
        width: "100%",
        ...sx,
      }}
      {...props}
    />
  );
};
