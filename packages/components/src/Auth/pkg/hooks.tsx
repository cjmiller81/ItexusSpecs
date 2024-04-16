import { ErrorBrowserLocationChangeRequired, GenericError, SelfServiceFlowExpiredError } from "@ory/client"
import { AxiosError } from "axios"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import { ory } from "./sdk"

export const HandleError = (
  getFlow: ((flowId: string) => Promise<void | AxiosError>) | undefined = undefined,
  setFlow: React.Dispatch<React.SetStateAction<any>> | undefined = undefined,
  defaultNav: string | undefined = undefined,
  fatalToError = false,
) => {
  return async (error: AxiosError): Promise<AxiosError | void> => {
    if (!error.response || error.response?.status === 0) {
      let errorMsg = `${error.message ?? ""} ${error.cause ?? ""}`
      window.location.href = `/ui/error?error=${encodeURIComponent(process.env.development ? JSON.stringify(error) : errorMsg)}`
      return Promise.resolve()
    }

    const responseData = (error.response?.data as ErrorBrowserLocationChangeRequired) || {}
    const responseError = responseData?.error as GenericError

    switch (error.response?.status) {
      case 400: {
        if (responseError?.id == "session_already_available") {
          await Router.push("/")
          return Promise.resolve()
        }

        // the request could contain invalid parameters which would set error messages in the flow
        if (setFlow !== undefined) {
          console.warn("sdkError 400: update flow data")
          setFlow(responseData)
          return Promise.resolve()
        }
        break
      }
      // we have no session or the session is invalid
      case 401: {
        console.warn("handleError hook 401: Navigate to /ui/login")
        await Router.push("/ui/login")
        return Promise.resolve()
      }
      case 403: {
        // the user might have a session, but would require 2FA (Two-Factor Authentication)
        if (responseError?.id === "session_aal2_required") {
          await Router.push("/ui/login?aal2=true")
          Router.reload()
          return Promise.resolve()
        }

        if (responseError?.id === "session_refresh_required" && responseData.redirect_browser_to) {
          console.warn("sdkError 403: Redirect browser to", responseData.redirect_browser_to)
          window.location.href = responseData.redirect_browser_to
          return Promise.resolve()
        }
        break
      }
      case 404: {
        console.warn("sdkError 404: Navigate to Error")
        const errorMsg = {
          data: error.response?.data || error,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: window.location.href,
        }

        await Router.push(`/ui/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`)
        return Promise.resolve()
      }
      // error.id handling
      //    "self_service_flow_expired"
      case 410: {
        if (getFlow !== undefined && (responseData as SelfServiceFlowExpiredError).use_flow_id !== undefined) {
          console.warn("sdkError 410: Update flow")
          return getFlow((responseData as SelfServiceFlowExpiredError).use_flow_id || "").catch(flowError => {
            // Something went seriously wrong - log and redirect to defaultNav if possible
            console.error(flowError)

            if (defaultNav !== undefined) {
              void Router.push(defaultNav)
            } else {
              // Rethrow error when can't navigate and let caller handle
              throw flowError
            }
          })
        } else if (defaultNav !== undefined) {
          console.warn("sdkError 410: Navigate to", defaultNav)
          await Router.push(defaultNav)
          return Promise.resolve()
        }
        break
      }
      // we need to parse the response and follow the `redirect_browser_to` URL
      // this could be when the user needs to perform a 2FA challenge
      // or passwordless login
      case 422: {
        if (responseData.redirect_browser_to !== undefined) {
          const currentUrl = new URL(window.location.href)
          const redirect = new URL(responseData.redirect_browser_to)

          // host name has changed, then change location
          if (currentUrl.host !== redirect.host) {
            console.warn("sdkError 422: Host changed redirect")
            window.location.href = responseData.redirect_browser_to
            return Promise.resolve()
          }

          // Path has changed
          if (currentUrl.pathname !== redirect.pathname) {
            console.warn("sdkError 422: Update path")
            await Router.push(redirect.pathname + redirect.search)
            return Promise.resolve()
          }

          // for webauthn we need to reload the flow
          const flowId = redirect.searchParams.get("flow")

          if (flowId != null && getFlow !== undefined) {
            // get new flow data based on the flow id in the redirect url
            console.warn("sdkError 422: Update flow")
            return getFlow(flowId).catch(flowError => {
              // Something went seriously wrong - log and redirect to defaultNav if possible
              console.error(flowError)

              if (defaultNav !== undefined) {
                void Router.push(defaultNav)
              } else {
                // Rethrow error when can't navigate and let caller handle
                throw flowError
              }
            })
          } else {
            console.warn("sdkError 422: Redirect browser to")
            window.location.href = responseData.redirect_browser_to
            return Promise.resolve()
          }
        }
      }
    }

    if (fatalToError) {
      console.warn("sdkError: fatal error redirect to /error")
      const errorData: any = error.response?.data

      await Router.push({
        pathname: "/ui/error",
        query: {
          error: JSON.stringify(error, null, 2),
          id: errorData.error?.id,
          flowType: Router.pathname,
        },
      })
      return Promise.resolve()
    }

    throw error
  }
}

// Returns a function which will log the user out
export function LogoutLink(): () => void {
  const [logoutToken, setLogoutToken] = useState<string>("")
  const handleError = HandleError()

  useEffect(() => {
    ory
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => handleError(err))
  })

  return () => {
    if (logoutToken) {
      ory
        .updateLogoutFlow({ token: logoutToken })
        .then(() => Router.push("/"))
        .catch(error => {
          console.error("Logout error:", error.message)
          void Router.push("/")
        })
    }
  }
}
