import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { AutoSidebarLayout, OryAuthGateway, ToastifyLayout } from "components"
import { AppProps } from "next/app"
import { PersistGate } from "redux-persist/integration/react"
import { appPersistor } from "../libs/redux/Store"
import { AppThemeProvider } from "../providers/AppThemeProvider"
import { StoreProvider } from "../providers/StoreProvider"
import Layout from "./Layout"

export interface IRootProps extends AppProps {
  children: any
}

export default function RootLayout({ children }: IRootProps) {
  return (
    <OryAuthGateway
      changePasswordRoute={
        typeof window !== "undefined" ? `${window.location.origin}/profile/security?requireChangePassword=true` : ""
      }>
      <StoreProvider>
        <PersistGate
          loading={null}
          persistor={appPersistor}>
          <AppThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ToastifyLayout>
                <AutoSidebarLayout>
                  <Layout>{children}</Layout>
                </AutoSidebarLayout>
              </ToastifyLayout>
            </LocalizationProvider>
          </AppThemeProvider>
        </PersistGate>
      </StoreProvider>
    </OryAuthGateway>
  )
}
