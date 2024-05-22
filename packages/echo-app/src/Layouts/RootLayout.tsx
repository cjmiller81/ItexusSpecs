import { OryAuthGateway } from "components"
import NotificationProvider from "@/hooks/notification-hook"
import i18n from "@/libs/i18n/i18n"
import { appPersistor } from "@/libs/redux/Store"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { CustomLanguageFormats, locales } from "@ory/elements"
import { AppProps } from "next/app"
import { useMemo } from "react"
import { PersistGate } from "redux-persist/integration/react"
import AutoSidebarLayout from "./AutoSidebarLayout"
import DevextremeThemeProvider from "./DevextremeThemeProvider"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"

export interface IRootProps extends AppProps {
  children: any
}

export default function RootLayout({ children }: IRootProps) {
  const customTranslations: CustomLanguageFormats = useMemo(() => {
    const translations = i18n.getResourceBundle("en", "ory")
    return {
      en: {
        ...locales.en,
        ...translations,
      },
    } as CustomLanguageFormats
  }, [])

  return (
    <OryAuthGateway changePasswordRoute={`${window.location.origin}/profile/security?requireChangePassword=true`} customTranslations={customTranslations}>
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
    </OryAuthGateway>
  )
}
