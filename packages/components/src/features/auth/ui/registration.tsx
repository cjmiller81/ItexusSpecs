import { Button, Stack, Typography, Box } from "@mui/material"
import {
  GenericError,
  RegistrationFlow,
  UpdateRegistrationFlowBody,
} from "@ory/client"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useState, useMemo } from "react"
import { Registration as OryRegistration } from "@ory/elements-react/theme"
import { createOryConfig } from "../lib/oryConfig"
import { Loader } from "../components/loader"
import { HandleError } from "../utils/hooks"
import { ory } from "../lib/sdk"
import { StyledAuthContainer } from "./StyledAuthContainer"
import { authLogger } from "../../../utils/authLogger"

interface OryRegistrationErrorResponse {
  error?: GenericError
}

const Registration: FC<{}> = () => {
  const [flow, setFlow] = useState<RegistrationFlow>()
  const [error, setError] = useState<string | null>(null)

  // Get flow information from the URL
  const router = useRouter()

  const handleRedirect = () => {
    router.push("/");
  };

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
        .catch((error: AxiosError<OryRegistrationErrorResponse>) => {
          const errorId = error.response?.data?.error?.id
          if (errorId === "self_service_flow_disabled") {
            setError("New user registration is currently disabled")
          } else {
            authLogger.error("createBrowserRegistrationFlow failed", error)
            handleError(error)
          }
        }),
    [handleError, router],
  )

  const registrationConfig = useMemo(() => {
    return createOryConfig()
  }, [])

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

  const submitFlow = async (values: UpdateRegistrationFlowBody) => {
    try {
      await ory.updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
      // We registered successfully — bring the user home.
      router.push("/")
    } catch (err) {
      authLogger.error("updateRegistrationFlow failed", err)
      handleError(err as AxiosError)
    }
  }

  if (error) {
    return (
      <StyledAuthContainer>
        <Stack alignItems="center" gap={2} className="log">
          <Typography variant="h5" color="error" align="center">
            New user registration is currently disabled
          </Typography>
          <Button sx={{ textTransform: "capitalize" }} variant="contained" color="primary" onClick={handleRedirect}>
            Home
          </Button>
        </Stack>
      </StyledAuthContainer>
    )
  }

  if (!flow) return <Loader />
  return (
    <StyledAuthContainer>
      <Stack
        alignItems="center"
        gap={1}
        className="log">
        <Box sx={{ 
          backgroundColor: "#2B2B2B",
          borderRadius: "1rem",
          padding: "48px",
          minWidth: "400px",
          borderWidth: "2px",
          borderColor: "white",
          borderStyle: "solid",
        }}>
          {registrationConfig && flow && (
            <OryRegistration
              flow={flow as any}
              config={registrationConfig}
            />
          )}
        </Box>
      </Stack>
    </StyledAuthContainer>
  )
}

export default Registration
