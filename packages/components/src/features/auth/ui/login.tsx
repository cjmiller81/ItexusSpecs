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
  const isAal2 = router.query.aal2 === "true"  // front-end trigger for MFA step-up
  const aalParam = isAal2 ? "aal2" : aal  // if front-end asks for aal2, override the param

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

  // Create a new login flow, preserving aal2 if requested.
  const createFlow = useCallback(() => {
    return ory
      .createBrowserLoginFlow({
        refresh,
        aal: aalParam,
        returnTo,
      })
      .then(({ data }) => {
        // keep aal2 flag in URL so UI shows MFA prompt
        const qs = [`flow=${data.id}`]
        if (isAal2) qs.push("aal2=true")
        router.replace(`/ui/login?${qs.join("&")}`, undefined, { shallow: true })
      })
      .catch(err => {
        // fallback for older Kratos versions that don't support aal
        if (isAal2) {
          return ory
            .createBrowserLoginFlow({ refresh, returnTo })
            .then(({ data }) => {
              router.replace(`/ui/login?flow=${data.id}`, undefined, { shallow: true })
            })
        }
        throw err
      })
  }, [refresh, aalParam, returnTo, isAal2, router])


  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const queryString = typeof window !== "undefined" ? window.location.search : ""
    const searchParams = new URLSearchParams(queryString)
    const hasFlowId = searchParams.has("flow")

    ory.toSession().then(
      () => {
        router.replace("/")
      },
      () => {
        if (hasFlowId && flowId) {
          getFlow(flowId).catch(_err => {
            createFlow()
          })
        }
      }
    )
  }, [router.isReady, flowId, returnTo])

  useEffect(() => {
    const queryString = typeof window !== "undefined" ? window.location.search : ""
    const searchParams = new URLSearchParams(queryString)
    const hasFlowId = searchParams.has("flow")

    if (!router.isReady || hasFlowId) {
      return
    }

    // Otherwise we initialize it
    ory.toSession().then(
      () => {
        router.replace("/")
      },
      () => {
        if (!hasFlowId) {
          createFlow()
        }
      }
    )
  }, [router.isReady])

  const submitFlow = (values: UpdateLoginFlowBody) => {
    ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        const match = document.cookie.split("; ")
         .find(row => row.startsWith("postRecoveryRedirect="))
 
        const redirect = match
         ? decodeURIComponent(match.split("=")[1])
         : "/"

        document.cookie = `postRecoveryRedirect=; path=/; max-age=0`
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
        <StyledUserAuthCard
          // This defines what kind of card we want to render.
          flowType={"login"}
          // We always need the flow data which populates the form fields and error messages dynamically
          flow={flow}
          // The login card should allow the user to go to the registration page and the recovery page
          additionalProps={{
            forgotPasswordURL: "/ui/recovery",
            signupURL: "/ui/registration",
          }}
          // We might need webauthn support which requires additional JS
          includeScripts={true}
          // We submit the form data to Ory
          onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
          cardImage={process.env.NEXT_PUBLIC_ORY_CARD_IMAGE_URL}
          title="Sign In"
        />
        <ProtectedByOryLabel />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Login
