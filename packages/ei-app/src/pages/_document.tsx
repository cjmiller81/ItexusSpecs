import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="dx-theme" data-theme="material.blue.light" href="/dx.material.blue.light.css" data-active="true"/>
      <link rel="dx-theme" data-theme="material.blue.dark" href="/dx.material.blue.dark.css" data-active="false"/>
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
