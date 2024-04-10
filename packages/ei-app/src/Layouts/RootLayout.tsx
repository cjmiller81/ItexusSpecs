import NotificationProvider from "@/hooks/notification-hook"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { PersistGate } from "redux-persist/integration/react"
import AutoSidebarLayout from "./AutoSidebarLayout"
import DevextremeThemeProvider from "./DevextremeThemeProvider"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"
import { appPersistor } from "@/libs/redux/Store"

export default function RootLayout({ children }: any) {
  return (
    <StoreProvider>
      <PersistGate
        loading={null}
        persistor={appPersistor}>
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
      </PersistGate>
    </StoreProvider>
  )
}
