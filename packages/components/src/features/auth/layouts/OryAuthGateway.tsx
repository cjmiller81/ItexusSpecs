import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material"
import {
  Session,
  SettingsFlow,
  UiNodeInputAttributes,
  UpdateSettingsFlowBody,
} from "@ory/client"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { ory } from "../lib/sdk"
import ErrorUi from "../ui/error"
import Login from "../ui/login"
import Recovery from "../ui/recovery"
import Registration from "../ui/registration"
import Settings from "../ui/settings"
import Verification from "../ui/verification"
import { HandleError } from "../utils/hooks"
import { authLogger } from "../../../utils/authLogger"

type OryContextType = {
  session: Session | undefined
  settingsFlow?: SettingsFlow
  logOut: () => Promise<void>
  renewSession: () => Promise<void>
  refreshSession: () => Promise<void>
  onUpdateProfile: (firstName: string, lastName: string) => Promise<void>
  createSettingsFlow: () => Promise<SettingsFlow>
  /**
   * @deprecated Typo preserved for backward compatibility with apps that
   * haven't yet migrated. Use `createSettingsFlow` instead.
   */
  createSettingsFow: () => Promise<SettingsFlow>
  onChangePassword: (password: string) => Promise<void>
  onUpdateAvatar: (avatarUrl: string) => Promise<void>
  onTotpSubmit: (code: string) => Promise<void>
  onTotpUnlink: () => Promise<void>
}

const ErrorPath = "/ui/error"
const LoginPath = "/ui/login"
const RecoveryPath = "/ui/recovery"
const RegistrationPath = "/ui/registration"
const LogoutPath = "/ui/logout"
const SettingsPath = "/ui/settings"
const VerificationPath = "/ui/verification"
const SelfServicesLogin = "/self-service/login/browser"

const allAuthPaths = [
  SelfServicesLogin,
  ErrorPath,
  SettingsPath,
  LoginPath,
  RecoveryPath,
  RegistrationPath,
  LogoutPath,
  VerificationPath,
]

const OryGatewayContext = createContext<OryContextType | undefined>(undefined)

const env = {
  termsUrl: process.env.NEXT_PUBLIC_APP_TERMS_URL ?? "",
  appTermsUrl: process.env.APP_TERMS_URL ?? "",
}

const findCsrfToken = (flow: SettingsFlow): string | undefined => {
  const csrfAttributes = flow.ui.nodes
    .map(node => node.attributes)
    .find(
      attributes =>
        attributes &&
        typeof attributes === "object" &&
        "name" in attributes &&
        attributes.name === "csrf_token",
    ) as UiNodeInputAttributes | undefined
  return csrfAttributes?.value
}

export function OryAuthGateway({
  children,
  changePasswordRoute,
}: {
  children: ReactNode
  changePasswordRoute: string
}) {
  const [session, setSession] = useState<Session | undefined>()
  const [currentSettingsFlow, setCurrentSettingsFlow] = useState<
    SettingsFlow | undefined
  >()

  const router = useRouter()
  // Strip query/hash so we can compare against `allAuthPaths`. Using
  // `router.asPath` avoids touching `window` during SSR.
  const pathname = router.asPath.split(/[?#]/)[0]

  const handleError = useCallback((error: AxiosError) => {
    const handle = HandleError(undefined, undefined, LoginPath)
    handle(error)
  }, [])

  const csrfToken = useMemo(
    () => (currentSettingsFlow ? findCsrfToken(currentSettingsFlow) : undefined),
    [currentSettingsFlow],
  )

  const createSettingsFlow = useCallback(async (): Promise<SettingsFlow> => {
    try {
      const { data } = await ory.createBrowserSettingsFlow()
      setCurrentSettingsFlow(data)
      return data
    } catch (error) {
      authLogger.error("createBrowserSettingsFlow failed", error)
      throw error
    }
  }, [])

  const onChangePassword = useCallback(
    async (password: string) => {
      if (!currentSettingsFlow) throw new Error("Settings flow is not created.")
      try {
        await ory.updateSettingsFlow({
          flow: currentSettingsFlow.id,
          updateSettingsFlowBody: {
            password,
            method: "password",
            csrf_token: csrfToken,
          },
        })
      } catch (error) {
        authLogger.error("updateSettingsFlow(password) failed", error)
        throw error
      }
    },
    [currentSettingsFlow, csrfToken],
  )

  const onUpdateAvatar = useCallback(
    async (avatarUrl: string) => {
      try {
        const flow = await createSettingsFlow()
        const traits = session?.identity?.traits ?? {}
        const payload: UpdateSettingsFlowBody = {
          "traits.email": traits.email,
          "traits.avatarUrl": avatarUrl,
          "traits.name.first": traits.name?.first,
          "traits.name.last": traits.name?.last,
          "traits.newsletter": traits.newsletter,
          csrf_token: findCsrfToken(flow),
          method: "profile",
        } as unknown as UpdateSettingsFlowBody

        await ory.updateSettingsFlow({
          flow: flow.id,
          updateSettingsFlowBody: payload,
        })

        const { data } = await ory.toSession()
        setSession(data)
      } catch (error) {
        authLogger.error("onUpdateAvatar failed", error)
        throw error
      }
    },
    [createSettingsFlow, session],
  )

  const onUpdateProfile = useCallback(
    async (firstName: string, lastName: string) => {
      try {
        const flow = await createSettingsFlow()
        const traits = session?.identity?.traits ?? {}
        const payload: UpdateSettingsFlowBody = {
          "traits.email": traits.email,
          "traits.avatarUrl": traits.avatarUrl,
          "traits.name.first": firstName,
          "traits.name.last": lastName,
          "traits.newsletter": traits.newsletter,
          csrf_token: findCsrfToken(flow),
          method: "profile",
        } as unknown as UpdateSettingsFlowBody

        await ory.updateSettingsFlow({
          flow: flow.id,
          updateSettingsFlowBody: payload,
        })

        const { data } = await ory.toSession()
        setSession(data)
      } catch (error) {
        authLogger.error("onUpdateProfile failed", error)
        throw error
      }
    },
    [createSettingsFlow, session],
  )

  const onTotpSubmit = useCallback(
    async (code: string): Promise<void> => {
      if (!currentSettingsFlow) throw new Error("Settings flow is not created.")
      try {
        const { data } = await ory.updateSettingsFlow({
          flow: currentSettingsFlow.id,
          updateSettingsFlowBody: {
            totp_code: code,
            method: "totp",
            csrf_token: csrfToken,
          },
        })
        setCurrentSettingsFlow(data)
        const { session } = await ory.toSession()
        setSession(session)
      } catch (error) {
        authLogger.error("updateSettingsFlow(totp) failed", error)
        throw error
      }
    },
    [currentSettingsFlow, csrfToken],
  )

  const onTotpUnlink = useCallback(async (): Promise<void> => {
    if (!currentSettingsFlow) throw new Error("Settings flow is not created.")
    try {
      const { data } = await ory.updateSettingsFlow({
        flow: currentSettingsFlow.id,
        updateSettingsFlowBody: {
          totp_unlink: true,
          method: "totp",
          csrf_token: csrfToken,
        },
      })
      setCurrentSettingsFlow(data)
      const { session } = await ory.toSession()
      setSession(session)
    } catch (error) {
      authLogger.error("updateSettingsFlow(totp_unlink) failed", error)
      throw error
    }
  }, [currentSettingsFlow, csrfToken])

  const handleLogout = useCallback(async () => {
    try {
      const { data: flow } = await ory.createBrowserLogoutFlow()
      await ory.updateLogoutFlow({ token: flow.logout_token })

      setSession(undefined)
      router.push(LoginPath)
    } catch (error) {
      // Do NOT clear local session state on failure — the cookie may still be
      // valid server-side and silently swallowing the error would leave the
      // user thinking they're logged out while still authenticated.
      authLogger.error("Logout failed", error)
      throw error
    }
  }, [router])

  const renewSession = useCallback(async (): Promise<void> => {
    try {
      // Redirect to Ory login page with refresh=true and a return_to that
      // will bring the user back to where they were.
      const currentUrl = window.location.href
      const encodedReturnTo = encodeURIComponent(currentUrl)
      const sdkUrl =
        process.env.NEXT_PUBLIC_ORY_SDK_URL || process.env.ORY_SDK_URL || ""
      const oryLoginUrl = `${sdkUrl}/ui/login?refresh=true&return_to=${encodedReturnTo}`
      window.location.href = oryLoginUrl
    } catch (err) {
      authLogger.error("Renew session failed", err)
      router.push(LoginPath)
    }
  }, [router])

const refreshSession = async (): Promise<void> => {
  try {
    const { data } = await ory.toSession()
    setSession(data)
  } catch (err) {
    console.error("refreshSession failed:", err)
    try {
      await renewSession()
    } catch (e) {
      console.error("renewSession fallback failed:", e)
    }
  }
}


  useEffect(() => {
    // Don't probe the session on auth pages — those pages create/load their
    // own flows and probing can race with them.
    if (
      [
        ErrorPath,
        LogoutPath,
        LoginPath,
        RecoveryPath,
        RegistrationPath,
        VerificationPath,
      ].indexOf(pathname) > -1
    ) {
      setSession(undefined)
      return
    }
    ory
      .toSession()
      .then(({ data }) => {
        setSession(data)
      })
      .catch(handleError)
  }, [pathname, handleError])

  const contextValue = useMemo<OryContextType>(
    () => ({
      session,
      settingsFlow: currentSettingsFlow,
      logOut: handleLogout,
      renewSession,
      refreshSession,
      onChangePassword,
      createSettingsFlow,
      // Deprecated alias — see note on OryContextType.
      createSettingsFow: createSettingsFlow,
      onUpdateProfile,
      onTotpSubmit,
      onTotpUnlink,
      onUpdateAvatar,
    }),
    [
      session,
      currentSettingsFlow,
      onChangePassword,
      handleLogout,
      renewSession,
      refreshSession,
      onUpdateProfile,
      createSettingsFlow,
      onTotpSubmit,
      onTotpUnlink,
      onUpdateAvatar,
    ],
  )

  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#3E3E3E",
                minWidth: "100%",
                minHeight: "100vh",
                margin: "auto",
              },
            },
          },
        },
      }),
    [],
  )

  return (
    <OryGatewayContext.Provider value={contextValue}>
      {allAuthPaths.includes(pathname) && (
        <ThemeProvider theme={theme}>
          <StyledAuthLayout>
            <CssBaseline />
            {pathname === ErrorPath && <ErrorUi env={env} />}
            {pathname === LoginPath && <Login env={env} />}
            {pathname === RecoveryPath && (
              <Recovery changePasswordRoute={changePasswordRoute} env={env} />
            )}
            {pathname === RegistrationPath && <Registration />}
            {pathname === SettingsPath && <Settings />}
            {pathname === VerificationPath && <Verification />}
          </StyledAuthLayout>
        </ThemeProvider>
      )}
      {!allAuthPaths.includes(pathname) && session && children}
    </OryGatewayContext.Provider>
  )
}

export const StyledAuthLayout: any = styled(Box)(({ theme }) => ({
  backgroundColor: "#3E3E3E",
  width: "100%",
  height: "100vh",
  margin: "auto",
  [theme.breakpoints.down(640)]: {
    backgroundColor: "#2B2B2B",
  },
}))

export const useOry = () => {
  const context = useContext(OryGatewayContext)
  if (!context) {
    throw new Error("useOry must be used within an AuthProvider")
  }
  return context
}
