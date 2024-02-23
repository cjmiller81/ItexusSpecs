import type { AppProps } from 'next/app'
import RootLayout from '@/Layouts/RootLayout'
import '../utils/i18n'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}
