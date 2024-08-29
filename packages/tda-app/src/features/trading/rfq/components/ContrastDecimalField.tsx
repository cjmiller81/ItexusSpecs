import { TextField } from "@mui/material";
import { darken, lighten, styled, Theme } from "@mui/system";
import { DecimalInput } from "components";

const contrastStyles = (theme: Theme) => ({
  "& .MuiInputLabel-root": {
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: theme.palette.mode === "dark" ? "#2a2929 !important" : "#fff",
    padding: "0 5px",
    textAlign: "center",
    fontSize: "10px !important",
  },
  "& .MuiInputLabel-shrink": {
    left: "53%",
    transform: "translateX(-50%)",
    padding: "0 5px",
    textAlign: "center",
    top: "-14px !important",
  },

  "& legend": {
    display: "none",
  },

  "& .MuiInputBase-input": {
    textAlign: "center",
  },

  "& .MuiFormLabel-root.Mui-disabled": {
    color: theme => (theme.palette.mode === "dark" ? lighten("#000", 0.6) : darken("#fff", 0.4)),
  },
  "& .Mui-disabled": {
    input: {
      "-webkit-text-fill-color": theme => (theme.palette.mode === "dark" ? lighten("#000", 0.6) : darken("#fff", 0.4)),
    },
  },

  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "none !important",
  },
});

const StyledContrastDecimalField = styled(DecimalInput)(({ theme }: { theme: Theme }) => contrastStyles(theme));
const StyledContrastTextField = styled(TextField)(({ theme }: { theme: Theme }) => contrastStyles(theme));

export { StyledContrastDecimalField as ContrastDecimalField, StyledContrastTextField as ContrastTextField };
