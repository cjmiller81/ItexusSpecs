// React
import React, { useCallback, useEffect, useState } from "react"

// Next.js
import Link from "next/link"
import { useRouter } from "next/router"

import { AxiosError } from "axios"
// Ory SDK & Ory Client
import { CodeBox } from "@ory/elements"
import { ory } from "../../pkg/sdk"

// Misc.
import { HandleError } from "../../pkg/hooks"

// We will use CodeBox from Ory Elements to display the session information.

const Error = (): React.JSX.Element => {
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
        setError(
          JSON.stringify(JSON.parse(decodeURIComponent(String(err))), null, 2),
        )
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
        .catch(handleError)
    }
  }, [err, id, router.isReady, handleError])

  return (
    <>
      <Link href="/">Home</Link>

      <p>
        An error occurred. Please check the error information below and try
        again.
      </p>
      <CodeBox
        style={{
          overflow: "auto",
          maxWidth: "600px",
        }}
      >
        {error}
      </CodeBox>
    </>
  )
}

export default Error
