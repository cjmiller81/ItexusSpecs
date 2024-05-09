import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { AxiosError } from "axios"
import { CodeBox } from "@ory/elements"
import { ory } from "../lib/sdk"
import { HandleError } from "../utils/hooks"
import { AuthContainer } from "./AuthContainer"

export const ErrorUi = (): React.JSX.Element => {
  const [error, setError] = useState<string>()
  const router = useRouter()

  const id = router.query.id
  const err = router.query.error

  const handleError = useCallback((callbackError: AxiosError) => {
    const handle = HandleError()
    return handle(callbackError)
  }, [])

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (err) {
      try {
        setError(JSON.stringify(JSON.parse(decodeURIComponent(String(err))), null, 2))
      } catch (_catchError) {
        setError(String(err))
      }
    }

    if (id) {
      // Fetch the error information from the Ory API
      ory
        .getFlowError({ id: String(id) })
        .then(({ data }) => {
          setError(JSON.stringify(data, null, 2))
        })
        .catch(err => {
          setError(JSON.stringify(err, null, 2))
          //handleError
      })
    }
  }, [err, id, router.isReady, handleError])

  return (
    <AuthContainer>
      <div
        className="log">
        <Link href="/">Home</Link>

        <p>An error occurred. Please check the error information below and try again.</p>
        <CodeBox
          style={{
            overflow: "auto",
            maxWidth: "600px",
          }}>
          {error}
        </CodeBox>
      </div>
    </AuthContainer>
  )
}

export default ErrorUi
