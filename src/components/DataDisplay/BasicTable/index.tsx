import { DataGrid, DataGridProps } from '@mui/x-data-grid'

export default function BasicTable(props: DataGridProps) {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        {...props}
      />
    </div>
  )
}
