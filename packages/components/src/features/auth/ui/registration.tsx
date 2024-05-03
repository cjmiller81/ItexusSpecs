import { Stack } from "@mui/material"
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useState } from "react"
import { Loader } from "../components/loader"
import { HandleError } from "../utils/hooks"
import { ory } from "../lib/sdk"
import { StyledAuthContainer } from "./StyledAuthContainer"
import { StyledUserAuthCard } from "./StyledUserAuthCard"

const Registration: FC<{}> = () => {
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
        })
        .catch(handleError),
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
          router.push(`/ui/registration?flow=${data.id}`)
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

  const submitFlow = (values: UpdateRegistrationFlowBody) => {
    ory
      .updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        router.push("/")
      })
      .catch(handleError)
  }

  if (!flow) return <Loader />
  return (
    <StyledAuthContainer>
      <Stack
        alignItems="center"
        gap={1}
        className="log">
        <StyledUserAuthCard
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
          cardImage="https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png"
        />
      </Stack>
    </StyledAuthContainer>
  )
}

export default Registration
