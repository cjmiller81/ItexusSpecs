import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { FC } from "react";

export const StyledButton: FC<LoadingButtonProps> = props => {
  return (
    <LoadingButton
      variant="text"
      sx={{
        "span":{
          color: theme => theme.palette.common.white
        },
        ":hover": {
          backgroundColor: theme => theme.palette.action.hover,
         
          textDecoration: "underline",
        },
        color: theme => theme.palette.common.white,
        fontSize: "14px",
        fontWeight: 600,
        height: "24px",
      }}
      {...props}
    />
  );
};

