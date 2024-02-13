import Layout from '@/Layouts/Layout'
import IncomeTable from '../../containers/IncomeTable'
import { PageTitle } from '@/components/TextDisplay'

export default function IncomePage() {
  return (
    <Layout>
      <PageTitle>Income Page Title</PageTitle>
      <IncomeTable />
    </Layout>
  )
}
