import { OryAuthGateway, useCentralizedTourMigration } from "components"
import NotificationProvider from "@/hooks/notification-hook"
import { appPersistor } from "@/libs/redux/Store"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { AppProps } from "next/app"
import React from "react"
import { PersistGate } from "redux-persist/integration/react"
import AutoSidebarLayout from "./AutoSidebarLayout"
import DevextremeThemeProvider from "./DevextremeThemeProvider"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"

export interface IRootProps extends AppProps {
  children: any
}

const MigrationGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { migrationCompleted } = useCentralizedTourMigration();

  if (!migrationCompleted) {
    return null;
  }

  return <>{children}</>;
};

export default function RootLayout({ children }: IRootProps) {
  return (
    <OryAuthGateway 
    changePasswordRoute={`${window.location.origin}/`}>
      <StoreProvider>
        <PersistGate
          loading={null}
          persistor={appPersistor}>
          <MigrationGate>
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
          </MigrationGate>
        </PersistGate>
      </StoreProvider>
    </OryAuthGateway>
  )
}
