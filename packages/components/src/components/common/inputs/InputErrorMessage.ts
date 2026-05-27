import type React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const InputErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  paddingBottom: 4,
  fontSize: "12px",
  textWrap: "nowrap",
}));

InputErrorMessage.defaultProps = { component: "span" } as Partial<React.ComponentProps<typeof InputErrorMessage>>;
