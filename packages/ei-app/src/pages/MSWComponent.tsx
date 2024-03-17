"use client"
import { useEffect } from "react"

export const MSWComponent = () => {
  useEffect(() => {
    async function enableMSW() {
      if (process.env.NEXT_PUBLIC_MOCK_BACKEND_API === 'true') {
        const { worker } = await import('../mocks/browserApiServices')

        return worker.start()
      }
    }
    enableMSW()
  }, [])

  return null
}
