import { AppProps } from "next/app"
import NotificationProvider from "@/containers/IndexModel/notification-hook"
import { AppThemeProvider } from "@/providers/AppThemeProvider"
import { StoreProvider } from "@/providers/StoreProvider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { Session } from '@ory/client'
import {
  //ThemeProvider as OryThemeProvider,
  IntlProvider,
  CustomTranslations,
  locales,
  CustomLanguageFormats,
} from '@ory/elements'

import AutoSidebarLayout from "./AutoSidebarLayout"
import DevextremeThemeProvider from "./DevextremeThemeProvider"
import Layout from "./Layout"
import ToastifyLayout from "./ToastifyLayout"

export interface IRootProps extends AppProps {
  session: Session | undefined,
  children: any
}

export default function RootLayout({ session, children }: IRootProps) {
  const customTranslations: CustomLanguageFormats = {
    en: {
      ...locales.en,
      'login.title': 'Login',
      'identities.messages.1070004': 'Email',
    },
  }

  return (
    <StoreProvider>
      <NotificationProvider>
        <DevextremeThemeProvider>
          <AppThemeProvider>
            {/*<OryThemeProvider themeOverrides={{}}>*/}
            <IntlProvider<CustomTranslations> customTranslations={customTranslations} locale="en" defaultLocale="en">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {session ?
                  (
                    <ToastifyLayout>
                      <AutoSidebarLayout>
                        <Layout>{children}</Layout>
                      </AutoSidebarLayout>
                    </ToastifyLayout>
                  )
                  : (
                    <>
                      {children}
                    </>
                  )
                }
              </LocalizationProvider>
            </IntlProvider>
            {/*</OryThemeProvider>*/}
          </AppThemeProvider>
        </DevextremeThemeProvider>
      </NotificationProvider>
    </StoreProvider>
  )
}
