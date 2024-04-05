import NotificationProvider from "@/containers/IndexModel/notification-hook"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import AutoSidebarLayout from "./AutoSidebarLayout"
import DevextremeThemeProvider from "./DevextremeThemeProvider"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"

export default function RootLayout({ children }: any) {
  return (
    <StoreProvider>
      <NotificationProvider>
        <DevextremeThemeProvider>
          <AppThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ToastifyLayout>
                <AutoSidebarLayout>
                  <Layout>{children}</Layout>
                </AutoSidebarLayout>
              </ToastifyLayout>
            </LocalizationProvider>
          </AppThemeProvider>
        </DevextremeThemeProvider>
      </NotificationProvider>
    </StoreProvider>
  )
}
