/* eslint-disable @typescript-eslint/no-floating-promises */
// React
import { FC, useCallback, useEffect, useState } from "react"

// Next.js
import NextJsRouter, { useRouter } from "next/router"

// Ory SDK & Ory Client
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { AxiosError } from "axios"
import { ory } from '../../pkg/sdk'

// Misc.
import { IAppComponent } from "../../common/types"
// Ory Elements
// We will use UserAuthCard from Ory Elements to display the registration form.
import { Loader } from '../../components/common/loader'
import { SetUriFlow } from "../../pkg/helpers"
import { HandleError } from "../../pkg/hooks"

import styles from './index.module.scss'

const Registration: FC<IAppComponent> = () => {
  const [flow, setFlow] = useState<RegistrationFlow>()

  // Get flow information from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getRegistrationFlow({ id })
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data)
          SetUriFlow(NextJsRouter, data.id)
        })
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .catch(handleError),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/ui/registration", true)
      return handle(error)
    },
    [getFlow],
  )

  const createFlow = useCallback(
    (returnTos: string) =>
      ory
        .createBrowserRegistrationFlow({
          returnTo: returnTos,
        })
        .then(({ data }) => {
          setFlow(data)
          SetUriFlow(NextJsRouter, data.id)
        })
        .catch(handleError),
    [handleError],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getFlow(String(flowId || "")).catch(() => createFlow(returnTo))
      return
    }

    // Otherwise we initialize it
    createFlow(returnTo)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const submitFlow = useCallback(
    (values: UpdateRegistrationFlowBody) =>
      ory
        .updateRegistrationFlow({
          flow: String(flow?.id),
          updateRegistrationFlowBody: values,
        })
        // We logged in successfully! Let's bring the user home.
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to
            return
          }
          router.push("/")
        })
        .catch(handleError),
    [flow?.id, flow?.return_to, handleError, router]
  )

  return flow ? (
    <main className={styles.login}>
      <div className="log" style={{ height: '85vh' }}>
        <UserAuthCard
          // create a registration form that dynamically renders based on the flow data using Ory Elements
          // This defines what kind of card we want to render.
          flowType={"registration"}
          // we always need to pass the flow to the card since it contains the form fields, error messages and csrf token
          flow={flow}
          // the registration card needs a way to navigate to the login page
          additionalProps={{
            loginURL: "/ui/login",
          }}
          // include the necessary scripts for webauthn to work
          includeScripts={true}
          // submit the registration form data to Ory
          onSubmit={({ body }) => submitFlow(body as UpdateRegistrationFlowBody)}

          cardImage='https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png'
        />
      </div>
    </main>
  ) : (
    <Loader />
  )
}

//Registration.getLayout = (page) => <Layout>{page}</Layout>

export default Registration
