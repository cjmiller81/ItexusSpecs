import Button, { ButtonProps } from "@mui/material/Button";
import { FC } from "react";

export type SelectableButtonProps = Omit<ButtonProps, "variant"> & {
  selected?: boolean;
};

export const SelectableButton: FC<SelectableButtonProps> = ({ sx, selected, ...props }) => {
  return (
    <Button
      sx={{
        textTransform: "none",
        paddingLeft: "0px",
        paddingRight: "0px",
        width: "100%",
        fontWeight: "600",
        fontSize: "15px",
        ...(selected
          ? {
              borderColor: theme => theme.palette.primary.main,
              color: theme => theme.palette.primary.main,
              ":hover": {
                borderColor: theme => theme.palette.primary.main,
              },
              boxShadow: "none",
            }
          : {
              borderColor: "transparent",
              boxShadow: "none",
            }),
        ...sx,
      }}
      {...props}
      variant="outlined"
    />
  );
};
