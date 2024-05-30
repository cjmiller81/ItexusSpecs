import "../libs/i18n/i18n"
import RootLayout from "@/Layouts/RootLayout"
import "@ory/elements/assets/fa-brands.min.css"
import "@ory/elements/assets/fa-solid.min.css"
import "@ory/elements/assets/fontawesome.min.css"
import "@ory/elements/assets/inter-font.css"
import "@ory/elements/assets/jetbrains-mono-font.css"
import "@ory/elements/assets/normalize.css"
import "@ory/elements/style.css"
import "devextreme/dist/css/dx.common.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import "../libs/axios/axios"
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
          const { worker } = await import("../mocks/browserApiServices")
          // TODO fix. Worker does not woerk for https
         // await worker.start()
          setMocksStarted(true)
        }
      } else {
        setMocksStarted(true)
      }
    }

    initMocks()
  }, [])

  return (
    <>
      {mocksStarted && (
        <RootLayout {...pageProps}>
          <Component {...pageProps} />
        </RootLayout>
      )}
    </>
  )
}
