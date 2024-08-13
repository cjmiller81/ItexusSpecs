import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { FC } from "react";

export const StyledButton: FC<LoadingButtonProps> = ({ sx, ...props }) => {
  return (
    <LoadingButton
      variant="text"
      sx={{
        span: {
          color: theme => theme.palette.common.white,
        },
        ":hover": {
          backgroundColor: theme => theme.palette.action.hover,
          textDecoration: "underline",
        },
        color: theme => theme.palette.common.white,
        fontWeight: 600,
        height: "24px",
        ...sx,
      }}
      {...props}
    />
  );
};
