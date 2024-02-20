import { BasicTable } from '@/components/DataDisplay'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Collapse, IconButton, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { tokensColumns } from '../TokensTable/mocks'

export const walletsColumns: GridColDef[] = [
  {
    field: 'walletAddress',
    headerName: 'Wallet Address',
    resizable: true,
    sortable: false,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    minWidth: 900,
    maxWidth: 100,
    renderCell: (props) => {
      return (
        <Box sx={{ flexDirection: 'column' }}>
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            {props.row.address}
          </Typography>
          <Collapse in={props.row.expanded}>
            <BasicTable
              checkboxSelection={false}
              sx={{ mt: 2 }}
              columns={tokensColumns}
              rows={props.row.assets}
            />
          </Collapse>
        </Box>
      )
    },
  },
  {
    field: 'trash',
    headerName: '',
    resizable: true,
    flex: 1,
    sortable: false,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    minWidth: 100,
    maxWidth: 100,
    renderCell: () => {
      return (
        <IconButton>
          <DeleteIcon />
        </IconButton>
      )
    },
  },
  {
    field: 'expand',
    headerName: '',
    resizable: true,
    sortable: false,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
    renderCell: (props) => {
      return (
        <IconButton
          onClick={() => {
            props.row.expanded = !props.row.expanded
          }}
        >
          {props.row.expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      )
    },
  },
]
