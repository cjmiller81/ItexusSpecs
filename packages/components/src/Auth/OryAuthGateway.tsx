import { Box, CssBaseline, ThemeProvider, createTheme, styled } from "@mui/material"
import { Session } from "@ory/client"
import { CustomLanguageFormats, CustomTranslations, IntlProvider } from "@ory/elements"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"
import { HandleError } from "./pkg/hooks"
import { ory } from "./pkg/sdk"
import ErrorUi from "./ui/error"
import Login from "./ui/login"
import Recovery from "./ui/recovery"
import Registration from "./ui/registration"

type OryContextType = {
  session: Session | undefined
  logOut: () => Promise<void>
}

const ErrorPath = "/ui/error"
const LoginPath = "/ui/login"
const RecoveryPath = "/ui/recovery"
const RegistrationPath = "/ui/registration"
const LogoutPath = "/ui/logout"

const allAuthPaths = [ErrorPath, LoginPath, RecoveryPath, RegistrationPath, LogoutPath]

const OryGatewayContext = createContext<OryContextType | undefined>(undefined)

export function OryAuthGateway({
  children,
  customTranslations,
}: {
  children: ReactNode
  customTranslations?: CustomLanguageFormats
}) {
  const [session, setSession] = useState<Session | undefined>()
  const pathname = window.location.pathname;
  const router = useRouter()
  const handleError = (error: AxiosError) => {
    const handle = HandleError(undefined, undefined, LoginPath)
    handle(error)
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

  const contextValue = useMemo<OryContextType>(
    () => ({
      session,
      logOut: handleLogout,
    }),
    [session],
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
