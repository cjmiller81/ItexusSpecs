import {
  ErrorBrowserLocationChangeRequired,
  GenericError,
  SelfServiceFlowExpiredError,
} from "@ory/client"
import { AxiosError } from "axios"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import { ory } from "../lib/sdk"
import { authLogger } from "../../../utils/authLogger"

type OryErrorResponseData = Partial<ErrorBrowserLocationChangeRequired> &
  Partial<SelfServiceFlowExpiredError> & {
    error?: GenericError
  }

export const HandleError = (
  getFlow: ((flowId: string) => Promise<void | AxiosError>) | undefined = undefined,
  setFlow: React.Dispatch<React.SetStateAction<any>> | undefined = undefined,
  defaultNav: string | undefined = undefined,
  fatalToError = false,
) => {
  return async (error: AxiosError): Promise<AxiosError | void> => {
    const inDevEnvironment = !!process && process.env.NODE_ENV === "development"

    if (!error.response || error.response?.status === 0) {
      const errorMsg = `${error.message ?? ""} ${error.cause ?? ""}`
      window.location.href = `/ui/error?error=${encodeURIComponent(
        inDevEnvironment ? JSON.stringify(error) : errorMsg,
      )}`
      return Promise.resolve()
    }

    const responseData = (error.response?.data as OryErrorResponseData) || {}
    const responseError = responseData?.error as GenericError | undefined

    switch (error.response?.status) {
      case 400: {
        if (responseError?.id === "session_already_available") {
          await Router.push("/")
          return Promise.resolve()
        }

        // For `update*Flow` endpoints, a 400 body is the updated flow with
        // validation messages — we feed it into local state to re-render the
        // form with errors. For `createBrowser*Flow` (and other non-flow
        // endpoints), a 400 body is a bare `{ error: GenericError }` with no
        // `ui` — pushing that into flow state would crash renderers that
        // read `flow.ui.nodes`. Guard by checking for a `ui` field.
        const looksLikeFlow =
          responseData !== null &&
          typeof responseData === "object" &&
          "ui" in (responseData as Record<string, unknown>) &&
          (responseData as { ui?: { nodes?: unknown } }).ui?.nodes !== undefined

        if (setFlow !== undefined && looksLikeFlow) {
          authLogger.debug("sdkError 400: update flow data")
          setFlow(responseData)
          return Promise.resolve()
        }
        break
      }
      // We have no session or the session is invalid.
      case 401: {
        authLogger.debug("sdkError 401: navigating to /ui/login")
        await Router.push("/ui/login")
        return Promise.resolve()
      }
      case 403: {
        // The user might have a session but would require 2FA step-up.
        if (responseError?.id === "session_aal2_required") {
          await Router.push("/ui/login?aal2=true")
          Router.reload()
          return Promise.resolve()
        }

        if (
          responseError?.id === "session_refresh_required" &&
          responseData.redirect_browser_to
        ) {
          authLogger.debug(
            "sdkError 403: redirect_browser_to",
            responseData.redirect_browser_to,
          )
          window.location.href = responseData.redirect_browser_to
          return Promise.resolve()
        }
        break
      }
      case 404: {
        authLogger.debug("sdkError 404: navigating to /ui/error")
        const errorMsg = {
          data: error.response?.data || error,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: window.location.href,
        }

        await Router.push(
          `/ui/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`,
        )
        return Promise.resolve()
      }
      // error.id handling: "self_service_flow_expired"
      case 410: {
        const expired = responseData as SelfServiceFlowExpiredError
        if (getFlow !== undefined && expired.use_flow_id !== undefined) {
          authLogger.debug("sdkError 410: refreshing flow")
          return getFlow(expired.use_flow_id || "").catch(flowError => {
            authLogger.error("sdkError 410: flow refresh failed", flowError)

            if (defaultNav !== undefined) {
              void Router.push(defaultNav)
            } else {
              // Rethrow when we can't navigate and let the caller handle.
              throw flowError
            }
          })
        } else if (defaultNav !== undefined) {
          authLogger.debug("sdkError 410: navigating to", defaultNav)
          await Router.push(defaultNav)
          return Promise.resolve()
        }
        break
      }
      // We need to parse the response and follow `redirect_browser_to`. This
      // can happen when the user needs to perform 2FA or passwordless login.
      case 422: {
        if (responseData.redirect_browser_to !== undefined) {
          const currentUrl = new URL(window.location.href)
          const redirect = new URL(responseData.redirect_browser_to)

          if (currentUrl.host !== redirect.host) {
            authLogger.debug("sdkError 422: host changed, redirecting")
            window.location.href = responseData.redirect_browser_to
            return Promise.resolve()
          }

          if (currentUrl.pathname !== redirect.pathname) {
            authLogger.debug("sdkError 422: updating path")
            await Router.push(redirect.pathname + redirect.search)
            return Promise.resolve()
          }

          // For webauthn we need to reload the flow.
          const flowId = redirect.searchParams.get("flow")

          if (flowId != null && getFlow !== undefined) {
            authLogger.debug("sdkError 422: refreshing flow")
            return getFlow(flowId).catch(flowError => {
              authLogger.error("sdkError 422: flow refresh failed", flowError)

              if (defaultNav !== undefined) {
                void Router.push(defaultNav)
              } else {
                throw flowError
              }
            })
          } else {
            authLogger.debug("sdkError 422: redirect_browser_to")
            window.location.href = responseData.redirect_browser_to
            return Promise.resolve()
          }
        }
      }
    }

    if (fatalToError) {
      authLogger.error("sdkError: fatal error, redirecting to /ui/error")
      const errorData = (error.response?.data as OryErrorResponseData) || {}
      const errorMsg = `${error.message ?? ""} ${error.cause ?? ""}`

      await Router.push({
        pathname: "/ui/error",
        query: {
          error: JSON.stringify(
            inDevEnvironment ? JSON.stringify(error) : errorMsg,
            null,
            2,
          ),
          id: errorData.error?.id,
          flowType: Router.pathname,
        },
      })
      return Promise.resolve()
    }

    throw error
  }
}

/**
 * Returns a function which will log the user out.
 *
 * The logout flow is created once per mount; calling the returned function
 * submits the logout token. Errors during both stages are routed through the
 * shared error handler rather than being silently swallowed.
 */
export function LogoutLink(): () => void {
  const [logoutToken, setLogoutToken] = useState<string>("")
  const handleError = HandleError()

  useEffect(() => {
    // Run once on mount — without an empty deps array this would re-run on
    // every render and create a new logout flow each time.
    ory
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => handleError(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return () => {
    if (logoutToken) {
      ory
        .updateLogoutFlow({ token: logoutToken })
        .then(() => Router.push("/"))
        .catch(error => {
          authLogger.error("Logout submission failed", error)
          void Router.push("/")
        })
    }
  }
}
