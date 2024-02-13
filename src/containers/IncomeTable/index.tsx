import { BasicTable } from '@/components/DataDisplay'
import { rows, columns } from './mocks'

export default function IncomeTable() {
  return <BasicTable rows={rows} columns={columns} />
}
