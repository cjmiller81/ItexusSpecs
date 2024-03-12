"use client"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import AutoSidebarLayout from "./AutoSidebarLayout"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"

export default function RootLayout({ children }: any) {
  return (
    <StoreProvider>
      <AppThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ToastifyLayout>
            <AutoSidebarLayout>
              <Layout>{children}</Layout>
            </AutoSidebarLayout>
          </ToastifyLayout>
        </LocalizationProvider>
      </AppThemeProvider>
    </StoreProvider>
  )
}
