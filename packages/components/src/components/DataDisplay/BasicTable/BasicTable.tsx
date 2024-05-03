import { styled } from "@mui/material"
import { DataGrid, DataGridProps } from "@mui/x-data-grid"

export function BasicTable(props: DataGridProps) {
  return (
    <div style={{ width: "100%" }}>
      <StyledDataGrid
        checkboxSelection
        {...props}
      />
    </div>
  )
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  ".MuiDataGrid-cellContent": {
    fontSize: "14px",
  },
  
  ".MuiDataGrid-columnHeaderTitle": {
    fontWeight: 500,
    fontSize: "14px",
  },
  " .MuiDataGrid-cell.MuiDataGrid-cell--editing": {
    padding: "0 10px",
  },
}))
