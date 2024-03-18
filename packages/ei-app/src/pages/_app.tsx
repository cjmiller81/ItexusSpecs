import RootLayout from "@/Layouts/RootLayout"
import { Link } from "@mui/material"
import type { AppProps } from "next/app"
import "../libs/axios/customAxios"
import "../libs/i18n/i18n"
import { useEffect, useState } from "react"

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
          await worker.start()
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
      { mocksStarted
        ? <>
            <Link
                href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
                rel="stylesheet"
              />
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </>
        : <></>
      }
    </>
  )
}
