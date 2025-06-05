import { darken, lighten, styled } from "@mui/material/styles"
import { BasicTable } from "../../components/DataDisplay"

export const StyledWalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  minHeight: 300,
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto !important",
  },
  "& .MuiDataGrid-main": {
    height: "auto",
    maxHeight: "300px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "transparent"
        : "#fff",
  },
  "&.MuiDataGrid-withBorderColor": {  
   backgroundColor:
      theme.palette.mode === "dark"
        ? "transparent !important"
        : "#fff !important",
},
  "& .MuiDataGrid-footerContainer": {
    height: "40px",
  },
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "& .MuiDataGrid-row--editing":{
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main
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
}))
