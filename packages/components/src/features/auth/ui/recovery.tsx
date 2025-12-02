import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useState } from "react"
import { Loader } from "../components/loader"
import { ory } from "../lib/sdk"
import { HandleError } from "../utils/hooks"
import { StyledAuthContainer } from "./StyledAuthContainer"
import { Stack } from "@mui/material"
import { CustomRecoveryForm } from "./CustomRecoveryForm"
import ProtectedByOryLabel from "./protectedByOryLabel"

export const Recovery: FC<{ changePasswordRoute: string }> = ({
  changePasswordRoute,
}) => {
  const [flow, setFlow] = useState<RecoveryFlow | null>()

  const router = useRouter()
  const flowId = String(router.query.flow || "")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getRecoveryFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(handleError),
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      if (error.response?.status === 410) {
          const data = error.response.data as { error?: { details?: { redirect_to?: string } } }
          const redirectTo = data?.error?.details?.redirect_to

          if (redirectTo) {
            const returnTo = window.location.origin

            const redirectUrl = new URL(redirectTo)
            redirectUrl.searchParams.set("return_to", returnTo)

            window.location.replace(redirectUrl.toString())
            return
          }
        }

      const forward = HandleError(getFlow, setFlow, "/ui/registration", true)

      if (error.response?.status === 422) {
        const data: any = error.response.data
        if (data?.redirect_browser_to) {
          data.redirect_browser_to = `${window.location.origin}${data.redirect_browser_to}`
        }
      }

      return forward(error)
    },
    [getFlow],
  )

  const createFlow = () =>
    ory
      .createBrowserRecoveryFlow()
      .then(({ data }) => {
        setFlow(data)
        router.replace(`/ui/recovery?flow=${data.id}`)
      })
      .catch((err) => void handleError(err))

  // ──────────────────────────────────────────────────────────────────────────
  // init
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!router.isReady) return
    if (flowId) {
      getFlow(flowId).catch(() => createFlow())
      return
    }
    createFlow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  // ──────────────────────────────────────────────────────────────────────────
  // submit handler
  // ──────────────────────────────────────────────────────────────────────────
  const submitFlow = (values: UpdateRecoveryFlowBody) => {
    ory
      .updateRecoveryFlow({
        flow: String(flow?.id),
        updateRecoveryFlowBody: values
      })
      .then(({ data }) => {
        /*
         * Kratos ≥ 0.11 returns 200 OK with a state field.
         *  ─ "sent_email"       -> stay on page, show message / ask for code
         *  ─ "passed_challenge" -> session cookie is set, redirect to app
         */
        if (data.state === "sent_email") {
          setFlow(data) // just update UI, ask for the recovery code
          return
        }

        if (data.state === "passed_challenge") {
          document.cookie = `postRecoveryRedirect=${encodeURIComponent(changePasswordRoute)}; path=/;`
          window.location.replace(changePasswordRoute)
          return
        }

        // fallback: still update local flow (error messages, etc.)
        setFlow(data)

        document.cookie = `postRecoveryRedirect=${encodeURIComponent(changePasswordRoute)}; path=/;`
      })
      .catch((error: AxiosError) => {
        // Older Kratos (<0.11) success branch: 422 + redirect_browser_to
        if (error.response?.status === 422) {
          const data: any = error.response.data
          if (data?.redirect_browser_to) {
            document.cookie = `postRecoveryRedirect=${encodeURIComponent(changePasswordRoute)}; path=/;`
            window.location.replace(changePasswordRoute)
            return
          }
        }
        void handleError(error)
      })
  }

  if (!flow) return <Loader />

  return (
    <StyledAuthContainer>
      <Stack alignItems="center" gap={1} className="log">
        {flow && (
          <CustomRecoveryForm
            flow={flow}
            onSubmit={submitFlow}
          />
        )}
        <ProtectedByOryLabel />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Recovery
