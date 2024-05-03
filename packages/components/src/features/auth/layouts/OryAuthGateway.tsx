import { Box, CssBaseline, ThemeProvider, createTheme, styled } from "@mui/material"
import { Session, SettingsFlow, UiNodeInputAttributes } from "@ory/client"
import { CustomLanguageFormats, CustomTranslations, IntlProvider, isUiNodeImageAttributes, isUiNodeInputAttributes } from "@ory/elements"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"
import { HandleError } from "../utils/hooks"
import { ory } from "../lib/sdk"
import ErrorUi from "../ui/error"
import Login from "../ui/login"
import Recovery from "../ui/recovery"
import Registration from "../ui/registration"
import Settings from "../ui/settings"

type OryContextType = {
  session: Session | undefined
  settingsFlow?: SettingsFlow
  logOut: () => Promise<void>
  createSettingsFow: () => Promise<SettingsFlow>
  onChangePassword: (password: string) => Promise<void>
  onTotpSubmit: (code: string) => Promise<void>
  onTotpUnlink: () => Promise<void>
}

const ErrorPath = "/ui/error"
const LoginPath = "/ui/login"
const RecoveryPath = "/ui/recovery"
const RegistrationPath = "/ui/registration"
const LogoutPath = "/ui/logout"
const SettingsPath = "/ui/settings"
const SelfServicesLogin = "/self-service/login/browser"

const allAuthPaths = [SelfServicesLogin, ErrorPath, SettingsPath, LoginPath, RecoveryPath, RegistrationPath, LogoutPath]

const OryGatewayContext = createContext<OryContextType | undefined>(undefined)

export function OryAuthGateway({
  children,
  customTranslations,
}: {
  children: ReactNode
  customTranslations?: CustomLanguageFormats
}) {
  const [session, setSession] = useState<Session | undefined>()
  const pathname = window.location.pathname
  const [currentSettingsFlow, setCurrentSettingsFlow] = useState<SettingsFlow | undefined>()

  const router = useRouter()
  const handleError = (error: AxiosError) => {
    const handle = HandleError(undefined, undefined, LoginPath)
    handle(error)
  }

  const csrfToken = useMemo(() => {
    if (!currentSettingsFlow) return undefined
    const csrfAttributes = (currentSettingsFlow.ui.nodes
      .map(node => node.attributes)
      .find(attributes => isUiNodeInputAttributes(attributes) && attributes.name === "csrf_token")) as UiNodeInputAttributes
      return csrfAttributes.value
  }, [currentSettingsFlow]);

  const onChangePassword = async (password: string) => {
    if (!currentSettingsFlow) throw Error("Settings flow is not created.")
    await ory.updateSettingsFlow({
      flow: currentSettingsFlow.id,
      updateSettingsFlowBody: {
        password,
        method: "password",
        csrf_token: csrfToken,
      },
    })
  }

  const onTotpSubmit = async (code: string): Promise<void> => {
    if (!currentSettingsFlow) throw Error("Settings flow is not created.")
    await ory.updateSettingsFlow({
      flow: currentSettingsFlow.id,
      updateSettingsFlowBody: {
        totp_code: code,
        method: "totp",
        csrf_token: csrfToken,
      },
    }).then(flow => setCurrentSettingsFlow(flow.data))
  }

  const onTotpUnlink = async (): Promise<void> => {
    if (!currentSettingsFlow) throw Error("Settings flow is not created.")
    await ory.updateSettingsFlow({
      flow: currentSettingsFlow.id,
      updateSettingsFlowBody: {
        totp_unlink: true,
        method: "totp",
        csrf_token: csrfToken,
      },
    }).then(flow => setCurrentSettingsFlow(flow.data))
  }

  const handleLogout = async () => {
    try {
      // Create a "logout flow" in Ory Identities
      const { data: flow } = await ory.createBrowserLogoutFlow()
      // Use the received token to "update" the flow and thus perform the logout
      await ory.updateLogoutFlow({
        token: flow.logout_token,
      })

      setSession(undefined)
      router.push(LoginPath)
    } catch (error) {}
  }

  useEffect(() => {
    // If the router is not ready yet, or we already have a session, do nothing.
    if ([ErrorPath, LogoutPath, LoginPath, RecoveryPath, RegistrationPath].indexOf(pathname) > -1) {
      setSession(undefined)
      return
    }
    ory
      .toSession()
      .then(({ data }) => {
        // we set the session data which contains the user Identifier and other traits.
        setSession(data as any)
      })
      .catch(handleError)
  }, [pathname])

  const createSettingsFow = async (): Promise<SettingsFlow> => {
    const flowData = await ory.createBrowserSettingsFlow()
    setCurrentSettingsFlow(flowData.data)
    return flowData.data
  }

  const contextValue = useMemo<OryContextType>(
    () => ({
      session,
      settingsFlow: currentSettingsFlow,
      logOut: handleLogout,
      onChangePassword,
      createSettingsFow,
      onTotpSubmit,
      onTotpUnlink,
    }),
    [session, currentSettingsFlow, onChangePassword, handleLogout, createSettingsFow, onTotpSubmit, onTotpUnlink],
  )

  const theme = createTheme({
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
  })

  return (
    <OryGatewayContext.Provider value={contextValue}>
      {allAuthPaths.includes(pathname) && (
        <ThemeProvider theme={theme}>
          <StyledAuthLayout>
            <CssBaseline />
            <IntlProvider<CustomTranslations>
              customTranslations={customTranslations || {}}
              locale="en"
              defaultLocale="en">
              {pathname == ErrorPath && <ErrorUi />}
              {pathname == LoginPath && <Login />}
              {pathname == RecoveryPath && <Recovery />}
              {pathname == RegistrationPath && <Registration />}
              {pathname == SettingsPath && <Settings />}
            </IntlProvider>
          </StyledAuthLayout>
        </ThemeProvider>
      )}
      {!allAuthPaths.includes(pathname) && session && children}
    </OryGatewayContext.Provider>
  )
}

export const StyledAuthLayout = styled(Box)(({ theme }) => ({
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
