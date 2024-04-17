import { Session } from "@ory/client"
import { CustomLanguageFormats, CustomTranslations, IntlProvider } from "@ory/elements"
import { AxiosError } from "axios"
import { usePathname, useRouter } from "next/navigation"
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
  const pathname = usePathname()
  const router = useRouter()

  const handleError = (error: AxiosError) => {
    const handle = HandleError(undefined, undefined, LoginPath)
    return handle(error)
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
      .catch(error => {
        // Handle all other errors like error.message "network error" if Kratos can not be connected etc.
        if (error.message) {
          return router.push(`${ErrorPath}?error=${encodeURIComponent(error.message)}`)
        }

        // Just stringify error and print all data
        return router.push(`${ErrorPath}?error=${encodeURIComponent(JSON.stringify(error))}`)
      })
  }, [pathname])

  const contextValue = useMemo<OryContextType>(
    () => ({
      session,
      logOut: handleLogout,
    }),
    [session],
  )

  return (
    <OryGatewayContext.Provider value={contextValue}>
      <IntlProvider<CustomTranslations>
        customTranslations={customTranslations || {}}
        locale="en"
        defaultLocale="en">
        {pathname == ErrorPath && <ErrorUi />}
        {pathname == LoginPath && <Login />}
        {pathname == RecoveryPath && <Recovery />}
        {pathname == RegistrationPath && <Registration />}
      </IntlProvider>
      {!allAuthPaths.includes(pathname) && session && children}
    </OryGatewayContext.Provider>
  )
}

export const useOry = () => {
  const context = useContext(OryGatewayContext)
  if (!context) {
    throw new Error("useOry must be used within an AuthProvider")
  }
  return context
}
