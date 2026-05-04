import "../libs/i18n/i18n"
import RootLayout from "@/Layouts/RootLayout"
import { LifiChainProvider } from "../common/lifiChainContext";
import "@ory/elements-react/theme/styles.css"
import "devextreme/dist/css/dx.common.css"
import 'simplebar-react/dist/simplebar.min.css';
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import "../libs/axios/axios"
import { SessionWatcher } from "../../../components/src/components/common/SessionWatcher"
import { GoogleAnalytics } from '@next/third-parties/google'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mocksStarted, setMocksStarted] = useState(false)

  useEffect(() => {
    /**
     * Wait for the MSW.js `mockServiceWorker.js` script to finish starting
     * before rendering the App.
     * @see: https://github.com/vercel/next.js/blob/0c1a531e1d6a1831cb261bc2fbd0f17816e68bef/examples/with-msw/mocks/index.ts#L1-L13
     */
    async function initMocks() {
      if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API === "true") {
        if (typeof window === "undefined") {
          // TODO: Add server side render mocks?
          //const { server } = await import("./server")
          //server.listen()
          setMocksStarted(true)
        } else {
          setMocksStarted(true)
        }
      } else {
        setMocksStarted(true)
      }
    }

    initMocks()
  }, [])

  const extendedPageProps = { 
    ...pageProps,
    env: { termsUrl: process.env.NEXT_PUBLIC_APP_TERMS_URL ?? "",
          appTermsUrl: process.env.APP_TERMS_URL ?? ""
    }
  }

  return (
      <>
        {mocksStarted && (
          <LifiChainProvider>
            <RootLayout {...extendedPageProps}>
              <SessionWatcher />
              <Component {...extendedPageProps} />
            </RootLayout>
          </LifiChainProvider>
        )}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </>
  )
}
