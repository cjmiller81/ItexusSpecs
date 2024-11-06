import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="dx-theme" data-theme="material.blue.light" href="/dx.material.blue.light.css" data-active="true"/>
        <link rel="dx-theme" data-theme="material.blue.dark" href="/dx.material.blue.dark.css" data-active="false"/>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <meta charSet="utf-8" />
        <meta
          name="robots"
          content="follow, index"
        />
        <meta
          httpEquiv="x-ua-compatible"
          content="ie=edge"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}