import type { OryClientConfiguration } from "@ory/elements-react"

/**
 * Optional overrides that a host app can pass to customise Ory UI copy.
 * Anything omitted falls back to reasonable defaults.
 */
export interface OryConfigOverrides {
  loginTitle?: string
  loginDescription?: string
  loginSubtitle?: string
  forgotPassword?: string
  signUp?: string
  registrationTitle?: string
  registrationLoginLink?: string
  recoveryTitle?: string
  recoveryLoginLink?: string
  totpTitle?: string
  twoFaTitle?: string
  useAuthenticatorApp?: string
  logoLightUrl?: string
}

export const createOryConfig = (
  overrides: OryConfigOverrides = {},
): OryClientConfiguration => {
  return {
    sdk: {
      url: process.env.NEXT_PUBLIC_ORY_SDK_URL || process.env.ORY_SDK_URL || "",
    },
    project: {
      logo_light_url:
        overrides.logoLightUrl ||
        process.env.NEXT_PUBLIC_ORY_CARD_IMAGE_URL ||
        "",
    } as OryClientConfiguration["project"],
    intl: {
      locale: "en",
      customTranslations: {
        en: {
          "login.title": overrides.loginTitle ?? "Sign In",
          "login.description":
            overrides.loginDescription ?? "Welcome back — please sign in to continue.",
          "login.subtitle":
            overrides.loginSubtitle ?? "Enter your email and password below.",
          "login.forgot-password": overrides.forgotPassword ?? "Forgot password?",
          "login.sign-up": overrides.signUp ?? "Sign up",
          "registration.title": overrides.registrationTitle ?? "Create Account",
          "registration.login":
            overrides.registrationLoginLink ??
            "Already have an account? Sign in",
          "recovery.title": overrides.recoveryTitle ?? "Recover Account",
          "recovery.login": overrides.recoveryLoginLink ?? "Back to login",
          "totp.title": overrides.totpTitle ?? "Two Factor Authentication",
          "totp.use-authenticator-app":
            overrides.useAuthenticatorApp ?? "Use Authenticator App",
          "2fa.title": overrides.twoFaTitle ?? "Two Factor Authentication",
        },
      },
    },
  }
}
