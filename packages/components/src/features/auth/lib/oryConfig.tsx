import type { OryClientConfiguration } from "@ory/elements-react"

export const createOryConfig = (): OryClientConfiguration => {
  return {
    sdk: {
      url: process.env.NEXT_PUBLIC_ORY_SDK_URL || process.env.ORY_SDK_URL || "",
    },
    project: {
      logo_light_url: process.env.NEXT_PUBLIC_ORY_CARD_IMAGE_URL || "",
    } as any,
    intl: {
      locale: "en",
      customTranslations: {
        en: {
          "login.title": "Sign In",
          "login.description": "_____________",
          "login.subtitle": "_______________",
          "login.forgot-password": "Forgot password?",
          "login.sign-up": "Sign up",
          "registration.title": "Create Account",
          "registration.login": "Already have an account? Sign in",
          "recovery.title": "Recover Account",
          "recovery.login": "Back to login",
          "totp.title": "Two Factor Authentication",
          "totp.use-authenticator-app": "Use Authenticator App",
          "2fa.title": "Two Factor Authentication",
        },
      },
    },
  }
}

