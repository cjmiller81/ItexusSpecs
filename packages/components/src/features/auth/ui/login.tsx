import { Stack } from "@mui/material"
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { Loader } from "../components/loader"
import { HandleError } from "../utils/hooks"
import { ory } from "../lib/sdk"
import { StyledAuthContainer } from "./StyledAuthContainer"
import ProtectedByOryLabel from "./protectedByOryLabel"
import { CustomLoginForm } from "./CustomLoginForm"
import { useFlowIdExpirationTimer } from "../../../hooks/useFlowIdExpirationTimer"
import { safeReturnTo } from "../utils/safeReturnTo"
import { authLogger } from "../../../utils/authLogger"

interface LoginProps {
  env: { termsUrl: string; appTermsUrl: string }
}

export const Login: FC<LoginProps> = ({ env }) => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const router = useRouter()

  // Harden `return_to` to protect against open-redirects via crafted query
  // strings (e.g. ?return_to=https://evil.com). `postLoginPath` is always a
  // same-origin relative path — safe to hand to Next's router.
  const postLoginPath = safeReturnTo(router.query.return_to, "/")
  const flowId = String(router.query.flow || "")

  // Refresh means we want to refresh the session (used e.g. before password
  // change).
  const refresh = Boolean(router.query.refresh)

  // AAL = Authorization Assurance Level. Implies we want to upgrade AAL,
  // meaning two-factor authentication/verification.
  const aal = String(router.query.aal || "")
  const isAal2 = router.query.aal2 === "true"
  const aalParam = isAal2 ? "aal2" : aal

  const isRefreshFlowIdNeeded = useFlowIdExpirationTimer(flow)

  // Ref pattern breaks the handleError ↔ getFlow cycle that otherwise
  // produces stale closures: handleError needs the latest getFlow for the 410
  // refresh branch, but getFlow closes over handleError.
  const getFlowRef = useRef<(id: string) => Promise<void | AxiosError>>()

  const handleError = useCallback((error: AxiosError) => {
    const handle = HandleError(
      id => (getFlowRef.current ? getFlowRef.current(id) : Promise.resolve()),
      setFlow,
      "/ui/login",
      true,
    )
    return handle(error)
  }, [])

  // Create a new login flow, preserving aal2 if requested.
  const createFlow = useCallback(async () => {
    try {
      // Build the Ory `return_to` as an absolute URL rooted at the current
      // origin. Kratos rejects bare relative paths (e.g. "/") with 400, and
      // an absolute URL on the current origin is guaranteed to be safe
      // because we already validated `postLoginPath` via `safeReturnTo`.
      const oryReturnTo =
        typeof window !== "undefined"
          ? new URL(postLoginPath, window.location.origin).toString()
          : undefined

      const { data } = await ory.createBrowserLoginFlow({
        refresh,
        // Passing `aal: ""` makes Kratos 400; only send it when truthy.
        ...(aalParam ? { aal: aalParam } : {}),
        ...(oryReturnTo ? { returnTo: oryReturnTo } : {}),
      })

      const qs = [`flow=${data.id}`]
      if (isAal2) qs.push("aal2=true")
      if (refresh) qs.push("refresh=true")
      if (postLoginPath && postLoginPath !== "/") {
        qs.push(`return_to=${encodeURIComponent(postLoginPath)}`)
      }
      router.replace(`/ui/login?${qs.join("&")}`, undefined, { shallow: true })
    } catch (err) {
      authLogger.error("createBrowserLoginFlow failed", err)
      handleError(err as AxiosError)
    }
  }, [refresh, aalParam, postLoginPath, isAal2, router, handleError])

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getLoginFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 410 || error.response?.status === 404) {
            createFlow()
          } else {
            handleError(error)
          }
        }),
    [createFlow, handleError],
  )

  // Keep the ref pointed at the latest getFlow so handleError can reach it
  // without creating a new handleError identity on every change.
  useEffect(() => {
    getFlowRef.current = getFlow
  }, [getFlow])

  useEffect(() => {
    if (!router.isReady) return

    ory.toSession().then(
      () => {
        router.replace(postLoginPath)
      },
      () => {
        if (flowId) {
          getFlow(flowId).catch(() => createFlow())
        } else {
          createFlow()
        }
      },
    )
    // getFlow / createFlow are intentionally excluded — they depend on
    // postLoginPath which is already covered here. Including them would re-run
    // this effect on every render because new callback identities are
    // created whenever `router` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, flowId, postLoginPath])

  const submitFlow = (values: UpdateLoginFlowBody) => {
    return ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      .then(() => {
        // Check for postRecoveryRedirect cookie first.
        const match = document.cookie
          .split("; ")
          .find(row => row.startsWith("postRecoveryRedirect="))

        let redirect = match
          ? safeReturnTo(decodeURIComponent(match.split("=")[1]), "/")
          : "/"

        // If there's no recovery redirect, use the validated return_to.
        if (!match && postLoginPath && postLoginPath !== "/") {
          redirect = postLoginPath
        }

        document.cookie = "postRecoveryRedirect=; path=/; max-age=0"
        router.push(redirect)
      })
      .catch(c => {
        void handleError(c)
      })
  }

  if (!flow) return <Loader />

  return (
    <StyledAuthContainer>
      <Stack alignItems="center" gap={1} className="log">
        {flow && (
          <CustomLoginForm
            flow={flow}
            isRefreshFlowIdNeeded={isRefreshFlowIdNeeded}
            onRefreshFlowId={createFlow}
            onSubmit={submitFlow}
          />
        )}
        <ProtectedByOryLabel env={env} />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Login
