import { NextPage } from 'next'
import { useEffect } from 'react'
import { LogoutLink } from '../../pkg/hooks'
import { Loader } from '../../components/common/loader'

const Logout: NextPage = () => {
  const onLogout = LogoutLink()

  useEffect(() => {
    onLogout()
  }, [onLogout])

  return <Loader />
}

export default Logout
