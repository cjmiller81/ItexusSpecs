
import { useCallback, useEffect, useState } from "react"
import { AxiosError } from 'axios'
import type { AppProps } from "next/app"
import { usePathname, useRouter } from 'next/navigation'
import { Session } from '@ory/client'

import RootLayout from "@/Layouts/RootLayout"
import { HandleError } from "@/pkg/hooks"
import { ory } from "@/pkg/sdk"

import "../libs/axios/customAxios"
import "../libs/i18n/i18n"

// @see: https://github.com/ory/elements/#before-v001-beta1
// optional global css reset
import '@ory/elements/assets/normalize.css'

// Ory Elements
// optional fontawesome icons
import '@ory/elements/assets/fa-brands.min.css'
import '@ory/elements/assets/fa-solid.min.css'
import '@ory/elements/assets/fontawesome.min.css'

// optional fonts
import '@ory/elements/assets/inter-font.css'
import '@ory/elements/assets/jetbrains-mono-font.css'

// required styles for Ory Elements
import '@ory/elements/style.css'
import "devextreme/dist/css/dx.common.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session>()
  const [mocksStarted, setMocksStarted] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const handleError = useCallback((error: AxiosError) => {
    const handle = HandleError(undefined, undefined, '/ui/login')
    return handle(error)
  }, [])

  useEffect(() => {
    // If the router is not ready yet, or we already have a session, do nothing.
    if (pathname == '/ui/logout' || pathname == '/ui/login' || pathname == '/ui/recovery' || pathname == '/ui/registration') {
      setSession(undefined)
      return
    }
    ory
      .toSession()
      .then(({ data }) => {
        // we set the session data which contains the user Identifier and other traits.
        setSession(data)
      })
      .catch(handleError)
      .catch((error) => {
        // Handle all other errors like error.message "network error" if Kratos can not be connected etc.
        if (error.message) {
          return router.push(`/ui/error?error=${encodeURIComponent(error.message)}`)
        }

        // Just stringify error and print all data
        return router.push(`/ui/error?error=${encodeURIComponent(JSON.stringify(error))}`)
      })
  }, [handleError, pathname, router])

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
        ? <RootLayout session={session} {...pageProps}>
            <Component session={session} {...pageProps} />
          </RootLayout>
        : <></>
      }
    </>
  )
}
