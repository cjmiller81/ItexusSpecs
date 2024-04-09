/* eslint-disable @typescript-eslint/no-floating-promises */
// React
import { FC, useCallback, useEffect, useState } from 'react'

// Next.js
import NextJsRouter, { useRouter } from 'next/router'

// Ory SDK & Ory Client
import { LoginFlow, UpdateLoginFlowBody } from '@ory/client'

// Misc.
import { AxiosError } from 'axios'

import { UserAuthCard } from '@ory/elements'
import { ory } from '../../pkg/sdk'
import { SetUriFlow } from '../../pkg/helpers'
import { HandleError } from '../../pkg/hooks'
import { Loader } from '../../components/common/loader'
import { IAppComponent } from '../../common/types'

import "@ory/elements/style.css"
import styles from './index.module.scss'

export const Login: FC<IAppComponent> = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const router = useRouter()

  const returnTo = String(router.query.return_to || '')
  const flowId = String(router.query.flow || '')

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(router.query.refresh)

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(router.query.aal || '')

  const getFlow = useCallback(
    (id: string) =>
      // If ?flow=.. was in the URL, we fetch it
      ory
        .getLoginFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .catch(handleError),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, '/ui/login', true)
      return handle(error)
    },
    [getFlow]
  )

  const createFlow = useCallback(
    (refreshs: boolean, aaal: string, returnTos: string) =>
      ory
        .createBrowserLoginFlow({
          refresh: refreshs,
          // Check for two-factor authentication
          aal: aaal,
          returnTo: returnTos,
        })
        .then(({ data }) => {
          setFlow(data)
          SetUriFlow(NextJsRouter, data.id)
        })
        .catch((c) => {
          void handleError(c)
        }),
    [handleError]
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (flowId) {
      getFlow(flowId).catch(() => {
        createFlow(refresh, aal, returnTo)
      })
      return
    }

    // Otherwise we initialize it

    createFlow(refresh, aal, returnTo)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const submitFlow = (values: UpdateLoginFlowBody): Promise<void> =>
    ory
      .updateLoginFlow({
        flow: String(flow?.id),
        updateLoginFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to
          return
        }
        router.push('/')
      })
      .catch((c) => {
        void handleError(c)
      })

  return flow ? (
    <main className={styles.login}>
      <div className="log" style={{ height: '85vh' }}>
        <UserAuthCard
          // cardImage="/ory.svg"
          // This defines what kind of card we want to render.
          flowType={'login'}
          // we always need the flow data which populates the form fields and error messages dynamically
          flow={flow}
          // the login card should allow the user to go to the registration page and the recovery page
          additionalProps={{
            forgotPasswordURL: '/ui/recovery',
            signupURL: '/ui/registration',
          }}
          // we might need webauthn support which requires additional js
          includeScripts={true}
          // we submit the form data to Ory
          onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}

          cardImage='https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png'
          title='Sign In'
        />
      </div>
    </main>
  ) : (
    <Loader />
  )
}

// Login.getLayout = (page) => <Layout>{page}</Layout>

export default Login
