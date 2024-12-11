import "react-toastify/dist/ReactToastify.css"
import DashboardLayout from "./DashboardLayout"
interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>
}
