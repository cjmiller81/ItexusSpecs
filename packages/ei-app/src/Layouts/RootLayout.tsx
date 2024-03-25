import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import AutoSidebarLayout from "./AutoSidebarLayout"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"
import DevextremeThemeProvider from "./DevextremeThemeProvider"

export default function RootLayout({ children }: any) {
  return (
    <StoreProvider>
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
    </StoreProvider>
  )
}
