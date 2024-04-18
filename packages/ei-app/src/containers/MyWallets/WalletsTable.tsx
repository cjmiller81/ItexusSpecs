import { BasicTable } from "@/components/DataDisplay"
import { darken, lighten, styled } from "@mui/material/styles"
export type Period = "daily" | "weekly" | "monthly"

export const StyledWalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  height: 500,
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowX: "hidden",
  },
  "& .MuiDataGrid-main": {
    height: "444px",
  },
  "& .MuiDataGrid-footerContainer": {
    height: "40px",
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    overflow: "hidden",
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
