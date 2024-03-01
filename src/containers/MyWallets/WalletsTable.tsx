import { BasicTable } from "@/components/DataDisplay"
import { styled } from "@mui/material/styles"
export type Period = "daily" | "weekly" | "monthly"

export const StyledWalletsTable = styled(BasicTable)(() => ({
  width: "100%",
  height: 500,
  mt: 2,
  display: "grid",
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
  ".MuiDataGrid-cell--withRenderer": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  },
}))
