import { darken, lighten, styled } from "@mui/material/styles";
import { BasicTable } from "components";
export type Period = "daily" | "weekly" | "monthly";

export const StyledWalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  height: 500,
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowX: "hidden",
  },
  "& .MuiDataGrid-footerContainer": {
  backgroundColor: "#fff",
  borderTop: "none",
  height: "40px",
},
  "& .MuiDataGrid-main": {
    height: "444px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "transparent"
        : "transparent",
  },

"&.MuiDataGrid-withBorderColor": {  
   backgroundColor:
      theme.palette.mode === "dark"
        ? "transparent !important"
        : "transparent !important",
},

  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "&.MuiDataGrid-root.MuiDataGrid-withBorderColor": {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: theme.palette.mode === "light" ? "rgb(181 177 177)" : "rgba(81, 81, 81, 1)",
  },
  "& .MuiDataGrid-row--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
  },
  "& .MuiDataGrid-cell--editing[data-field=walletName]": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "dark"
        ? darken(theme.palette.primary.main, 0.6)
        : lighten(theme.palette.primary.main, 0.7),
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  },
}));
