import { SxProps, Theme } from "@mui/system"
import { darken, lighten } from "@mui/system"

export const tableSx: SxProps<Theme> = {
  width: "100%",
  height: 530,
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {},
  "& .MuiDataGrid-main": {
    height: "444px",
  },
  "& .MuiDataGrid-footerContainer": {
    height: "60px",
    paddingBottom: "15px",
  },
  "& .MuiDataGrid-virtualScrollerContent": {},
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "& .MuiDataGrid-row--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme => theme.palette.primary.main,
  },
  "& .MuiDataGrid-cell--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme => theme.palette.primary.main,
    backgroundColor: theme =>
      theme.palette.mode === "dark"
        ? darken(theme.palette.primary.main, 0.6)
        : lighten(theme.palette.primary.main, 0.7),
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  },
}

export const autoSizeTableSx: SxProps<Theme> = {
  width: "100%",
  maxHeight: "calc(100vh - 130px)",
  minHeight: "calc(100vh - 130px)",
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-main": {
    height: "calc(100vh - 220px)",
  },
  "& .MuiDataGrid-virtualScroller": {},
  "& .MuiDataGrid-footerContainer": {
    height: "60px",
    paddingBottom: "15px",
  },
  "& .MuiDataGrid-virtualScrollerContent": {},
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "& .MuiDataGrid-row--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme => theme.palette.primary.main,
  },
  "& .MuiDataGrid-cell--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme => theme.palette.primary.main,
    backgroundColor: theme =>
      theme.palette.mode === "dark"
        ? darken(theme.palette.primary.main, 0.6)
        : lighten(theme.palette.primary.main, 0.7),
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  },
}

export const smallTableSx: SxProps<Theme>= {
  ...tableSx,
  minHeight: "200px",
  height: "inherit !important",
  "& .MuiDataGrid-main": {
    minHeight: "200px",
  },
  "& .MuiDataGrid-cell":{
    padding: 0.5,
    minWidth: "auto important",
    fontSize: "10.5px"
  },
  "& .MuiDataGrid-columnHeader":{
    padding: 0.5,
    fontSize: "11px",
    width: "auto !important"
  },
  "& .MuiDataGrid-columnHeaders":{
    height: "20px !important",
  },
  "& .MuiDataGrid-row":{
    minHeight: "10px",
  },
}

export const adaptiveHeightTableSx: SxProps<Theme>= {
  ...tableSx,
  height: "inherit !important",
  maxHeight: "218px",
  minHeight: "83px",
  "& .MuiDataGrid-main": {
    maxHeight: "215px",
    minHeight: "80px",
  },
  "& .MuiDataGrid-cell":{
    padding: 0.5,
    minWidth: "auto important",
    fontSize: "10.5px"
  },
  "& .MuiDataGrid-columnHeader":{
    padding: 0.5,
    fontSize: "11px",
    width: "auto !important"
  },
  "& .MuiDataGrid-columnHeaders":{
    height: "20px !important",
  },
  "& .MuiDataGrid-row":{
    minHeight: "10px",
  },
}