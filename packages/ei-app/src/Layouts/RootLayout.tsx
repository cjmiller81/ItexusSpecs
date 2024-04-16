import NotificationProvider from "@/containers/IndexModel/notification-hook"
import i18n from "@/libs/i18n/i18n"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { CustomLanguageFormats, locales } from "@ory/elements"
import { OryAuthGateway } from "components"
import { AppProps } from "next/app"
import { useMemo } from "react"
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
    <OryAuthGateway customTranslations={customTranslations}>
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
    </OryAuthGateway>
  )
}
