import { Stack } from "@mui/material"
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useState } from "react"
import { Loader } from "../components/loader"
import { HandleError } from "../utils/hooks"
import { ory } from "../lib/sdk"
import { StyledAuthContainer } from "./StyledAuthContainer"
import { StyledUserAuthCard } from "./StyledUserAuthCard"
import ProtectedByOryLabel from "./protectedByOryLabel"

export const Login: FC<{}> = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const router = useRouter()
  const returnTo = String(router.query.return_to || window.location.origin)
  const flowId = String(router.query.flow || "")
  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(router.query.refresh)

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(router.query.aal || "")

  const getFlow = useCallback(
    (id: string) =>
      // If ?flow=.. was in the URL, we fetch it
      ory
        .getLoginFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleError),
    [],
  )
  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/ui/login", true)
      return handle(error)
    },
    [getFlow],
  )

  const createFlow = (refreshs: boolean, aaal: string, returnTos: string) => {
    ory
      .createBrowserLoginFlow({
        refresh: refreshs,
        // Check for two-factor authentication
        aal: aaal,
        returnTo: returnTos,
      })
      .then(({ data }) => {
        router.push(`/ui/login?flow=${data.id}`)
      })
  }

  useEffect(() => {
    const queryString = typeof window !== "undefined" ? window.location.search : ""
    const searchParams = new URLSearchParams(queryString)
    const hasFlowId = searchParams.has("flow")

    if (!router.isReady) {
      return
    }

    if (hasFlowId && flowId) {
      getFlow(flowId).catch(_err => {
        createFlow(refresh, aal, returnTo)
      })
      return
    }
  }, [router.isReady, flowId, returnTo])

  useEffect(() => {
    const queryString = typeof window !== "undefined" ? window.location.search : ""
    const searchParams = new URLSearchParams(queryString)
    const hasFlowId = searchParams.has("flow")

    if (!router.isReady || hasFlowId) {
      return
    }

    // Otherwise we initialize it
    createFlow(refresh, aal, returnTo)
  }, [router.isReady])

  const submitFlow = (values: UpdateLoginFlowBody) => {
    ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        router.push("/")
      })
      .catch(c => {
        void handleError(c)
      })
  }

  if (!flow) return <Loader />
  return (
    <StyledAuthContainer>
      <Stack
        alignItems="center"
        gap={1}
        className="log">
        <StyledUserAuthCard
          // cardImage="/ory.svg"
          // This defines what kind of card we want to render.
          flowType={"login"}
          // we always need the flow data which populates the form fields and error messages dynamically
          flow={flow}
          // the login card should allow the user to go to the registration page and the recovery page
          additionalProps={{
            forgotPasswordURL: "/ui/recovery",
            signupURL: "/ui/registration",
          }}
          // we might need webauthn support which requires additional js
          includeScripts={true}
          // we submit the form data to Ory
          onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
          cardImage="https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png"
          title="Sign In"
        />
        <ProtectedByOryLabel />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Login
