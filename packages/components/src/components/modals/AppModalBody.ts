import type React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AppModalBody = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderColor: theme.palette.grey[500],
  borderStyle: "solid",
  backgroundColor: theme.palette.background.paper,
  borderWidth: 1,
  padding: theme.spacing(3),
}));

AppModalBody.defaultProps = { component: "div" } as Partial<React.ComponentProps<typeof AppModalBody>>;
