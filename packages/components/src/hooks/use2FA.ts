'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useOry } from 'components'

export const use2FAVerification = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { session } = useOry()

  const is2FAVerified = useCallback((): boolean => {
    return session?.authenticator_assurance_level === 'aal2' || false
  }, [session])

  const goTo2FA = useCallback(() => {
    const target = '/profile?tab=security'
    try {
        if (router?.replace) {
          router.replace(target)
        return
      }
    } catch (e) {
    }

    if (typeof window !== 'undefined') {
        window.location.href = target
      return
    }
  }, [router, pathname])

  return { is2FAVerified, goTo2FA }
}

export default use2FAVerification
