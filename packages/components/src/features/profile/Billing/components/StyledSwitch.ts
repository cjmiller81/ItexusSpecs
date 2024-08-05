import { styled, Switch } from "@mui/material";

export const StyledSwitch = styled(Switch)(({ theme }) => ({
  ".MuiSwitch-root": {
    backgroundColor: theme.palette.primary.main,
  },
  padding: "7px",
  ".MuiSwitch-track": {
    borderRadius: "40px",
    backgroundColor: theme.palette.primary.main,
  },
  ".MuiSwitch-thumb": {
    backgroundColor: "white",
  },
}));
