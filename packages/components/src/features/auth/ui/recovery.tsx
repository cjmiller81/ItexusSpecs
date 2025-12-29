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
import { useFlowIdExpirationTimer } from "../../../hooks/useFlowIdExpirationTimer";

export const Recovery: FC<{ changePasswordRoute: string }> = ({
  changePasswordRoute,
}) => {
  const [flow, setFlow] = useState<RecoveryFlow | null>();

  const router = useRouter();
  const flowId = String(router.query.flow || "");

  const isRefreshFlowIdNeeded = useFlowIdExpirationTimer(flow);

  useEffect(() => {
    if (isRefreshFlowIdNeeded) {
      router.push('/ui/login/');
    }

  }, [isRefreshFlowIdNeeded]);

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

  const handleResend = (email: string) => {
    // Create a new recovery flow - this will reset the flow and allow resending
    ory
      .createBrowserRecoveryFlow()
      .then(({ data: newFlow }) => {
        setFlow(newFlow)
        router.replace(`/ui/recovery?flow=${newFlow.id}`)
        
        // Extract CSRF token from the new flow
        const csrfNode = newFlow.ui.nodes.find(node => {
          if (node.attributes && typeof node.attributes === 'object' && 'name' in node.attributes) {
            return node.attributes.name === "csrf_token"
          }
          return false
        })
        const csrfToken = csrfNode && typeof csrfNode.attributes === 'object' && 'value' in csrfNode.attributes
          ? (csrfNode.attributes as any).value
          : undefined
        
        // Submit with email using the new flow ID and CSRF token
        const submitValues: UpdateRecoveryFlowBody = {
          email: email,
          method: "code",
          ...(csrfToken && { csrf_token: csrfToken }),
        } as UpdateRecoveryFlowBody
        ory
          .updateRecoveryFlow({
            flow: String(newFlow.id),
            updateRecoveryFlowBody: submitValues
          })
          .then(({ data }) => {
            if (data.state === "sent_email") {
              setFlow(data)
              router.replace(`/ui/recovery?flow=${data.id}`)
            }
          })
          .catch((err) => void handleError(err))
      })
      .catch((err) => void handleError(err))
  }

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
            onResend={handleResend}
          />
        )}
        <ProtectedByOryLabel />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Recovery
