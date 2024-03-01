import { DataGrid, DataGridProps } from "@mui/x-data-grid"

export default function BasicTable(props: DataGridProps) {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        checkboxSelection
        {...props}
      />
    </div>
  )
}
