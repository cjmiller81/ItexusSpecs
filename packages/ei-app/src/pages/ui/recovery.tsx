/* eslint-disable @typescript-eslint/no-floating-promises */
// React
import { FC, useCallback, useEffect, useState } from "react"

// Next.js
import NextJsRouter, { useRouter } from "next/router"

// Ory SDK & Ory Client
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { AxiosError } from "axios"
import { ory } from "../../pkg/sdk"

// Misc.
import { IAppComponent } from "../../common/types"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the recovery form.
import { Loader } from '../../components/common/loader'
import { HandleError } from "../../pkg/hooks"
import { SetUriFlow } from "../../pkg/helpers"

import styles from './index.module.scss'

export const Recovery: FC<IAppComponent> = () => {
  const [flow, setFlow] = useState<RecoveryFlow | null>()

  // Get flow information from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "/ui/profile")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getRecoveryFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .catch(handleError),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/ui/registration", true)

      if (error.response?.status && error.response?.status == 422) {
        const errorData: any = error.response?.data

        if (errorData?.redirect_browser_to) {
          // TODO: Just calling `handle(error)` throws `invalid URL error when `HandleError(...)` does `new URL(responseData.redirect_browser_to)`.
          // Set the full base path/origin so the URL is valid and will redirect to the `/profile` page to show recovery message.
          errorData.redirect_browser_to = `${window.location.origin}${errorData.redirect_browser_to}`
        }
      }

      return handle(error)
    },
    [getFlow],
  )

  const createFlow = useCallback(
    (returnToLocal: string) =>
      ory
        .createBrowserRecoveryFlow({
          returnTo: returnToLocal,
        })
        .then(({ data }) => {
          setFlow(data)
          SetUriFlow(NextJsRouter, data.id)
        })
        .catch((c) => {
          void handleError(c)
        }),
    [handleError],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getFlow(flowId).catch(() => createFlow(returnTo))
      // if the flow is expired, we create a new one
      return
    }

    // Otherwise we initialize it
    createFlow(returnTo)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const submitFlow = (values: UpdateRecoveryFlowBody): Promise<void> =>
    ory
      .updateRecoveryFlow({
        flow: String(flow?.id),
        updateRecoveryFlowBody: values,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((c) => {
        void handleError(c)
      })

  return flow ? (
    <main className={styles.login}>
      <div className="log" style={{ height: '85vh' }}>
        <UserAuthCard
          // create a recovery form that dynamically renders based on the flow data using Ory Elements
          // This defines what kind of card we want to render.
          flowType={"recovery"}
          // we always need the flow data which populates the form fields and error messages dynamically
          flow={flow}
          // the registration card should allow the user to go to the registration page and the login page
          additionalProps={{
            loginURL: "/ui/login",
          }}
          // we might need webauthn support which requires additional js
          includeScripts={true}
          // we submit the form data to Ory
          onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}

          cardImage='https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png'
        />
      </div>
    </main>
  ) : (
    <Loader />
  )
}

// Recovery.getLayout = (page) => <Layout>{page}</Layout>

export default Recovery
