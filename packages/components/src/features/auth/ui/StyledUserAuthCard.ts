import { darken, lighten, styled } from "@mui/material"
import { UserAuthCard } from "@ory/elements"

export const StyledUserAuthCard = styled(UserAuthCard)(({ theme }) => ({
  backgroundColor: "#2B2B2B",
  borderRadius: "1rem",
  padding: "48px",
  minWidth: "400px",
  borderWidth: "2px",
  borderColor: "white",
  [theme.breakpoints.down(640)]: {
    borderColor: "#2B2B2B",
  },
  "& label": {
    color: "white",
  },
  "& h2": {
    color: "white",
  },
  "& a": {
    color: "#0D73C7",
    "&:hover": {
      color: lighten("#0D73C7", 0.2),
    },
  },
  "& span": {
    color: "#0D73C7",
    "&:hover": {
      backgroundColor: "inherit",
    },
  },
  "& input": {
    ":hover": {
      borderColor: "inherit",
    },
  },
  "& button": {
    backgroundColor: "#0D73C7",
    "&:hover": {
      backgroundColor: darken("#0D73C7", 0.2),
    },
  },
  "div:last-child": {
    color: "white"
  },
}))
