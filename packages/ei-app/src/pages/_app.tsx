import RootLayout from "@/Layouts/RootLayout"
import type { AppProps } from "next/app"
import "../libs/axios/customAxios"
import "../libs/i18n/i18n"
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}
