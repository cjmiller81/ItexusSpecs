import Layout from '@/Layouts/Layout'
import { PageTitle } from '@/components/TextDisplay'
import IncomeTable from '@/containers/IncomeTable'

export default function HomePage() {
  return (
    <Layout>
      <PageTitle>Home Page Title</PageTitle>
      Some other stuff..
      <IncomeTable />
    </Layout>
  )
}
