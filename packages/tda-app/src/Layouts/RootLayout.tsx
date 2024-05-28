import ThemeCustomization from "@/themes"
import { CustomLanguageFormats, locales } from "@ory/elements"
import { OryAuthGateway } from "components"
import Snackbar from "components/@extended/Snackbar"
import Locales from "components/Locales"
import RTLLayout from "components/RTLLayout"
import ScrollTop from "components/ScrollTop"
import Notistack from "components/third-party/Notistack"
import { SessionProvider } from "next-auth/react"
import { AppProps } from "next/app"
import { useMemo } from "react"
import { PersistGate } from "redux-persist/integration/react"
import i18n from "../libs/i18n/i18n"
import { appPersistor } from "../libs/redux/Store"
import { StoreProvider } from "../providers/StoreProvider"
import Layout from "./Layout"

import { ConfigProvider } from "contexts/ConfigContext"
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
    <OryAuthGateway
      changePasswordRoute={
        typeof window !== "undefined" ? `${window.location.origin}/profile/security?requireChangePassword=true` : ""
      }
      customTranslations={customTranslations}>
      <StoreProvider>
        <PersistGate
          loading={null}
          persistor={appPersistor}>
          <ConfigProvider>
            <ThemeCustomization>
              <RTLLayout>
                <Locales>
                  <ScrollTop>
                    <SessionProvider refetchInterval={0}>
                      <Notistack>
                        <Snackbar />
                        <Layout>{children}</Layout>
                      </Notistack>
                    </SessionProvider>
                  </ScrollTop>
                </Locales>
              </RTLLayout>
            </ThemeCustomization>
          </ConfigProvider>
        </PersistGate>
      </StoreProvider>
    </OryAuthGateway>
  )
}
