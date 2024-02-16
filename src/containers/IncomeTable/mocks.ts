import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 100,
  },
  {
    field: 'day',
    headerName: 'Day',
    editable: true,
    width: 200,
  },
  {
    field: 'person',
    headerName: 'Person',
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    width: 300,
  },
]

export const rows = [
  { id: 1, lastName: 'Snow', firstName: 'John', amount: 14, day: '2023-02-01' },
  {
    id: 2,
    lastName: 'Lannister',
    firstName: 'Cersei',
    amount: 31,
    day: '2023-02-02',
  },
  {
    id: 3,
    lastName: 'Lannister',
    firstName: 'Jaime',
    amount: 31,
    day: '2023-02-03',
  },
  {
    id: 4,
    lastName: 'Stark',
    firstName: 'Arya',
    amount: 11,
    day: '2023-02-04',
  },
  {
    id: 5,
    lastName: 'Targaryen',
    firstName: 'Daenerys',
    amount: 31,
    day: '2023-02-05',
  },
  {
    id: 6,
    lastName: 'Melisandre',
    firstName: null,
    amount: 150,
    day: '2023-02-06',
  },
  {
    id: 7,
    lastName: 'Clifford',
    firstName: 'Ferrara',
    amount: 44,
    day: '2023-02-07',
  },
  {
    id: 8,
    lastName: 'Frances',
    firstName: 'Rossini',
    amount: 36,
    day: '2023-02-08',
  },
  {
    id: 9,
    lastName: 'Roxie',
    firstName: 'Harvey',
    amount: 65,
    day: '2023-02-09',
  },
]
