# `components`

> TODO: description

## Usage

```
1. Build components library :
    npm run build

1. Add dependency to package.json:
    "components": "*"

2. Add styles to pages/_app.tsx:

import "@ory/elements/assets/normalize.css"
import "@ory/elements/assets/fa-brands.min.css"
import "@ory/elements/assets/fa-solid.min.css"
import "@ory/elements/assets/fontawesome.min.css"
import "@ory/elements/assets/inter-font.css"
import "@ory/elements/assets/jetbrains-mono-font.css"
import "@ory/elements/style.css"

3. Add ORY_SDK_URL environment variable to next.config.js
const nextConfig = {
...
  env: {
    ...
    ORY_SDK_URL: 'https://trading-tools-auth.emergentcybernetics.net',
  },
}


OryGatewayContext:
    Provider trat responsible for login, registration, password recovery and user logout. It uses ui/login, ui/registration, ui/recovery to let the user into the system. Wrap your app with this component to add authorization to your app.

    <OryAuthGateway customTranslations={customTranslations}>
        ...
    </OryAuthGateway>

    customTranslations: translations for ui/login, ui/registration, ui/recovery pages

useOry hook: contains session(all user information) and logOut to initiate logOut flow from any place in your app
    
```
