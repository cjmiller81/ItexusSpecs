import { darken, lighten, styled } from "@mui/material/styles"
import { BasicTable } from "../../components/DataDisplay"

export const DexWalletsTable = styled(BasicTable)(({ theme }) => ({
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
        ? "#1f2937"
        : "transparent",
  }, 
    "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: "#1f2937 !important", 
    },
  "&.MuiDataGrid-root.MuiDataGrid-withBorderColor": {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: theme.palette.mode === "light" ? "rgb(181 177 177)" : "rgba(81, 81, 81, 1)",
  },
  "&.MuiDataGrid-withBorderColor": {  
   backgroundColor:
      theme.palette.mode === "dark"
        ? "transparent !important"
        : "transparent !important",
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
