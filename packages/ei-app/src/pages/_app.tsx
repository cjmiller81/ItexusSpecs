import RootLayout from "@/Layouts/RootLayout"
import { Link } from "@mui/material"
import type { AppProps } from "next/app"
import "../libs/axios/customAxios"
import "../libs/i18n/i18n"
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </>
  )
}
