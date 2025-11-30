import { darken, lighten, styled } from "@mui/material/styles"
import { BasicTable } from "../../components/DataDisplay"
import { width } from "@mui/system"

export const DexWalletsTable = styled(BasicTable, {
  shouldForwardProp: (prop) => prop !== '$hasExpandedRows' && prop !== '$minHeight',
})<{ $hasExpandedRows?: boolean; $minHeight?: string }>(({ theme, $hasExpandedRows, $minHeight }) => ({
  width: "100%",
  maxHeight: $hasExpandedRows ? ($minHeight || "80vh") : 150,
  height: "auto",
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto !important",
  },
  "& .MuiDataGrid-main": {
    height: "auto",
    minHeight: $hasExpandedRows ? ($minHeight || "80vh") : 150,
    width:"100%",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#1f2937"
        : "#f7f5f2",
  }, 
    "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: theme.palette.mode === "dark"
        ? "#1f2937"
        : "#f0ece5", 
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
