import { Box } from "@mui/material"
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid"

export const indexModelingTableColumns: GridColDef[] = [
  {
    field: "symbol",
    headerName: "Symbol",
    sortable: false,
    editable: false,
    filterable: false,
    flex: 1,
    disableColumnMenu: true,
    renderCell: props => {
      return (
        <Box
          component="div"
          sx={{ "& > img": { mr: 2, flexShrink: 0 }, display: "flex", alignItems: "flex-end" }}>
          <img
            loading="lazy"
            width="20"
            src={props.row.iconUrl}
            alt=""
          />
          <Box>{props.row.symbol}</Box>
        </Box>
      )
    },
  },
  {
    field: "price",
    headerName: "Price",
    sortable: false,
    editable: false,
    filterable: false,
    flex: 1,
    disableColumnMenu: true,
    valueGetter: (params: GridValueGetterParams) => {
      if (!params.row.price) return "--"
      return params.row.price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    },
  },
  {
    field: "marcetCap",
    headerName: "Marcet Cap",
    sortable: false,
    editable: false,
    filterable: false,
    flex: 1,
    disableColumnMenu: true,
    valueGetter: (params: GridValueGetterParams) => {
      if (!params.row.price) return "--"
      return params.row.marcetCap.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    },
  },
  {
    field: "weight",
    headerName: "Weight",
    sortable: false,
    editable: false,
    filterable: false,
    flex: 1,
    disableColumnMenu: true,
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.weight.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}%`
    },
  },
  {
    field: "qty",
    headerName: "Qty",
    sortable: false,
    editable: false,
    filterable: false,
    flex: 1,
    disableColumnMenu: true,
  },
]
